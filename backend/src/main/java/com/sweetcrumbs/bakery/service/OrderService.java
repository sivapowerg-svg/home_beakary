package com.sweetcrumbs.bakery.service;

import com.sweetcrumbs.bakery.dto.OrderRequestDto;
import com.sweetcrumbs.bakery.entity.Customer;
import com.sweetcrumbs.bakery.entity.Order;
import com.sweetcrumbs.bakery.entity.OrderStatus;
import com.sweetcrumbs.bakery.entity.Product;
import com.sweetcrumbs.bakery.exception.BusinessRuleException;
import com.sweetcrumbs.bakery.exception.ResourceNotFoundException;
import com.sweetcrumbs.bakery.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final CustomerService customerService;

    @Autowired
    public OrderService(OrderRepository orderRepository, ProductService productService, CustomerService customerService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.customerService = customerService;
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("No order found with order number: " + orderNumber));
    }

    public Order createOrder(OrderRequestDto dto) {
        // 1. Business Rule: Product must exist
        Product product = productService.getProductById(dto.getProductId());

        // 2. Business Rule: Product must be available
        if (Boolean.FALSE.equals(product.getAvailable())) {
            throw new BusinessRuleException("This treat is currently out of stock or unavailable for ordering.");
        }

        // 3. Business Rule: Quantity must be greater than 0
        if (dto.getQuantity() == null || dto.getQuantity() <= 0) {
            throw new BusinessRuleException("Quantity must be at least 1.");
        }

        // 4. Business Rule: Delivery date cannot be in the past
        if (dto.getDeliveryDate().isBefore(LocalDate.now())) {
            throw new BusinessRuleException("Delivery date cannot be in the past.");
        }

        // 5. Customer Entity
        Customer customer = customerService.getOrCreateCustomer(dto.getCustomer());

        // 6. Business Rule: Total must be calculated strictly on the backend
        BigDecimal basePrice = product.getPrice();
        BigDecimal sizeAddon = BigDecimal.ZERO;
        String sizeStr = dto.getSize().toLowerCase();
        if (sizeStr.contains("1 kg") || sizeStr.contains("12 pcs")) {
            sizeAddon = new BigDecimal("350.00");
        } else if (sizeStr.contains("1.5 kg")) {
            sizeAddon = new BigDecimal("650.00");
        } else if (sizeStr.contains("2 kg") || sizeStr.contains("24 pcs")) {
            sizeAddon = new BigDecimal("950.00");
        }

        BigDecimal qty = BigDecimal.valueOf(dto.getQuantity());
        BigDecimal subtotal = basePrice.add(sizeAddon).multiply(qty);

        BigDecimal egglessFee = Boolean.TRUE.equals(dto.getEggless()) ? new BigDecimal("50.00") : BigDecimal.ZERO;
        BigDecimal decoFee = BigDecimal.ZERO;
        String deco = dto.getAdditionalDecorations() != null ? dto.getAdditionalDecorations().toLowerCase() : "";
        if (deco.contains("gold") || deco.contains("macaron")) {
            decoFee = new BigDecimal("150.00");
        } else if (deco.contains("berry") || deco.contains("strawberr") || deco.contains("flower")) {
            decoFee = new BigDecimal("120.00");
        } else if (deco.contains("drip") || deco.contains("truffle")) {
            decoFee = new BigDecimal("100.00");
        } else if (deco.contains("fondant") || deco.contains("topper")) {
            decoFee = new BigDecimal("180.00");
        }

        BigDecimal customizationCharge = egglessFee.add(decoFee).multiply(qty);
        BigDecimal deliveryCharge = new BigDecimal("50.00");
        BigDecimal total = subtotal.add(customizationCharge).add(deliveryCharge);

        // 7. Business Rule: Order number must be unique
        String orderNumber = generateUniqueOrderNumber();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setCustomer(customer);
        order.setProduct(product);
        order.setQuantity(dto.getQuantity());
        order.setSize(dto.getSize());
        order.setFlavor(dto.getFlavor());
        order.setTheme(dto.getTheme() != null ? dto.getTheme() : "Classic");
        order.setCakeMessage(dto.getCakeMessage());
        order.setEggless(Boolean.TRUE.equals(dto.getEggless()));
        order.setAdditionalDecorations(dto.getAdditionalDecorations());
        order.setSpecialInstructions(dto.getSpecialInstructions());
        order.setDeliveryDate(dto.getDeliveryDate());
        order.setDeliveryTime(dto.getDeliveryTime());
        order.setDeliveryAddress(dto.getDeliveryAddress());
        order.setSubtotal(subtotal);
        order.setCustomizationCharge(customizationCharge);
        order.setDeliveryCharge(deliveryCharge);
        order.setTotal(total);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = getOrderById(id);

        // Business Rule: Cancelled orders cannot become delivered
        if (order.getStatus() == OrderStatus.CANCELLED && newStatus == OrderStatus.DELIVERED) {
            throw new BusinessRuleException("A cancelled order cannot be marked as delivered.");
        }

        // Business Rule: Delivered orders cannot be cancelled
        if (order.getStatus() == OrderStatus.DELIVERED && newStatus == OrderStatus.CANCELLED) {
            throw new BusinessRuleException("A delivered order cannot be cancelled.");
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }

    private String generateUniqueOrderNumber() {
        Random random = new Random();
        for (int i = 0; i < 20; i++) {
            String candidate = "SC-" + (1000 + random.nextInt(9000));
            if (orderRepository.findByOrderNumber(candidate).isEmpty()) {
                return candidate;
            }
        }
        return "SC-" + System.currentTimeMillis() % 100000;
    }
}
