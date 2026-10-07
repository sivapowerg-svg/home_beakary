package com.sweetcrumbs.bakery.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class OrderRequestDto {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotBlank(message = "Size is required")
    private String size;

    @NotBlank(message = "Flavor is required")
    private String flavor;

    private String theme;
    private String cakeMessage;
    private Boolean eggless = false;
    private String additionalDecorations;
    private String specialInstructions;

    @NotNull(message = "Delivery date is required")
    @FutureOrPresent(message = "Delivery date cannot be in the past")
    private LocalDate deliveryDate;

    @NotBlank(message = "Delivery time slot is required")
    private String deliveryTime;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    @NotNull(message = "Customer details are required")
    @Valid
    private CustomerDto customer;

    public OrderRequestDto() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getFlavor() { return flavor; }
    public void setFlavor(String flavor) { this.flavor = flavor; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getCakeMessage() { return cakeMessage; }
    public void setCakeMessage(String cakeMessage) { this.cakeMessage = cakeMessage; }

    public Boolean getEggless() { return eggless; }
    public void setEggless(Boolean eggless) { this.eggless = eggless; }

    public String getAdditionalDecorations() { return additionalDecorations; }
    public void setAdditionalDecorations(String additionalDecorations) { this.additionalDecorations = additionalDecorations; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getDeliveryTime() { return deliveryTime; }
    public void setDeliveryTime(String deliveryTime) { this.deliveryTime = deliveryTime; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public CustomerDto getCustomer() { return customer; }
    public void setCustomer(CustomerDto customer) { this.customer = customer; }
}
