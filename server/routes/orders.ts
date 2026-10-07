import { Router, Request, Response } from 'express';
import { db, OrderStatus } from '../db.ts';

export const ordersRouter = Router();

const VALID_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'BAKING',
  'READY_FOR_DELIVERY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
];

// Helper to calculate pricing deterministically on the backend
export function calculateOrderPricing(
  productPrice: number,
  quantity: number,
  size: string,
  eggless: boolean,
  decorations: string
) {
  let sizeAddon = 0;
  const s = (size || '').toLowerCase();
  if (s.includes('1 kg') || s.includes('12 pcs')) {
    sizeAddon = 350;
  } else if (s.includes('1.5 kg')) {
    sizeAddon = 650;
  } else if (s.includes('2 kg') || s.includes('24 pcs')) {
    sizeAddon = 950;
  }

  let decoAddon = 0;
  const d = (decorations || '').toLowerCase();
  if (d.includes('gold') || d.includes('macaron')) {
    decoAddon = 150;
  } else if (d.includes('berry') || d.includes('strawberr') || d.includes('flower')) {
    decoAddon = 120;
  } else if (d.includes('drip') || d.includes('truffle')) {
    decoAddon = 100;
  } else if (d.includes('fondant') || d.includes('topper')) {
    decoAddon = 180;
  } else if (d && !d.includes('none') && !d.includes('standard')) {
    decoAddon = 100;
  }

  const egglessAddon = eggless ? 50 : 0;

  const subtotal = (productPrice + sizeAddon) * quantity;
  const customizationCharge = (egglessAddon + decoAddon) * quantity;
  const deliveryCharge = 50;
  const total = subtotal + customizationCharge + deliveryCharge;

  return {
    subtotal,
    customizationCharge,
    deliveryCharge,
    total
  };
}

// POST /api/orders
ordersRouter.post('/', (req: Request, res: Response) => {
  try {
    const {
      productId,
      quantity,
      size,
      flavor,
      theme,
      cakeMessage,
      eggless,
      additionalDecorations,
      specialInstructions,
      deliveryDate,
      deliveryTime,
      deliveryAddress,
      // Customer details can be submitted together
      customer
    } = req.body;

    // 1. Validate Product
    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ success: false, message: 'Valid product ID is required' });
    }
    const product = db.getProductById(Number(productId));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Selected product was not found' });
    }
    if (!product.available) {
      return res.status(400).json({ success: false, message: 'This product is currently unavailable for order' });
    }

    // 2. Validate Quantity
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive whole number' });
    }

    // 3. Validate Delivery Date (cannot be in the past)
    if (!deliveryDate || typeof deliveryDate !== 'string') {
      return res.status(400).json({ success: false, message: 'Delivery date is required' });
    }
    const todayStr = new Date().toISOString().split('T')[0];
    if (deliveryDate < todayStr) {
      return res.status(400).json({ success: false, message: 'Delivery date cannot be in the past' });
    }

    // 4. Validate Delivery Details
    if (!deliveryAddress || typeof deliveryAddress !== 'string' || !deliveryAddress.trim()) {
      return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }
    if (!deliveryTime || typeof deliveryTime !== 'string' || !deliveryTime.trim()) {
      return res.status(400).json({ success: false, message: 'Delivery time slot is required' });
    }

    // 5. Validate Customer Details
    if (!customer) {
      return res.status(400).json({ success: false, message: 'Customer information is required' });
    }
    const { name, email, phone, city, pincode } = customer;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }
    if (!phone || typeof phone !== 'string' || !/^\+?[0-9\s-]{8,15}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Valid phone number is required (at least 8 digits)' });
    }
    if (!city || typeof city !== 'string' || !city.trim()) {
      return res.status(400).json({ success: false, message: 'City is required' });
    }
    if (!pincode || typeof pincode !== 'string' || !pincode.trim()) {
      return res.status(400).json({ success: false, message: 'Pincode is required' });
    }

    // Create or update customer entity
    const savedCustomer = db.createOrUpdateCustomer({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: deliveryAddress.trim(),
      city: city.trim(),
      pincode: pincode.trim()
    });

    // 6. Backend-calculated Total (Frontend is NEVER trusted for final price)
    const pricing = calculateOrderPricing(
      product.price,
      qty,
      size || '0.5 kg',
      Boolean(eggless),
      additionalDecorations || ''
    );

    // 7. Generate Unique Order Number
    let uniqueOrderNumber = '';
    let attempts = 0;
    while (!uniqueOrderNumber && attempts < 20) {
      const candidate = `SC-${Math.floor(1000 + Math.random() * 9000)}`;
      if (!db.getOrderByOrderNumber(candidate)) {
        uniqueOrderNumber = candidate;
      }
      attempts++;
    }
    if (!uniqueOrderNumber) {
      uniqueOrderNumber = `SC-${Date.now().toString().slice(-6)}`;
    }

    // 8. Create Order in Database
    const newOrder = db.createOrder({
      orderNumber: uniqueOrderNumber,
      customerId: savedCustomer.id,
      productId: product.id,
      quantity: qty,
      size: size?.trim() || '0.5 kg',
      flavor: flavor?.trim() || 'Signature Flavor',
      theme: theme?.trim() || 'Classic Elegance',
      cakeMessage: cakeMessage?.trim() || '',
      eggless: Boolean(eggless),
      additionalDecorations: additionalDecorations?.trim() || 'None',
      specialInstructions: specialInstructions?.trim() || '',
      deliveryDate: deliveryDate.trim(),
      deliveryTime: deliveryTime.trim(),
      deliveryAddress: deliveryAddress.trim(),
      subtotal: pricing.subtotal,
      customizationCharge: pricing.customizationCharge,
      deliveryCharge: pricing.deliveryCharge,
      total: pricing.total,
      status: 'PENDING'
    });

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order: ' + (error?.message || 'Server error') });
  }
});

// GET /api/orders
ordersRouter.get('/', (req: Request, res: Response) => {
  try {
    const orders = db.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
});

// GET /api/orders/track/:orderNumber
ordersRouter.get('/track/:orderNumber', (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    if (!orderNumber || !orderNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Order number is required' });
    }

    const order = db.getOrderByOrderNumber(orderNumber.trim());
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No order found with order number "${orderNumber.trim()}". Please verify and try again.`
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track order' });
  }
});

// GET /api/orders/:id
ordersRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    const order = db.getOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: `Order with ID ${id} not found` });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order' });
  }
});

// PUT /api/orders/:id/status
ordersRouter.put('/:id/status', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const result = db.updateOrderStatus(id, status);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json(result.order);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

// DELETE /api/orders/:id
ordersRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    const deleted = db.deleteOrder(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Order with ID ${id} not found` });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
});
