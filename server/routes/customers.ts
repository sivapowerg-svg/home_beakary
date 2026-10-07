import { Router, Request, Response } from 'express';
import { db } from '../db.ts';

export const customersRouter = Router();

// GET /api/customers
customersRouter.get('/', (req: Request, res: Response) => {
  try {
    const customers = db.getCustomers();
    const orders = db.getOrders();

    // Enrich with order stats for the admin view
    const enriched = customers.map((c) => {
      const custOrders = orders.filter((o) => o.customerId === c.id);
      const latestOrder = custOrders.length > 0 ? custOrders[0] : null;
      return {
        ...c,
        orderCount: custOrders.length,
        latestOrderDate: latestOrder ? latestOrder.createdAt : null,
        latestOrderNumber: latestOrder ? latestOrder.orderNumber : null
      };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve customers' });
  }
});

// GET /api/customers/:id
customersRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid customer ID' });
    }
    const customer = db.getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ success: false, message: `Customer with ID ${id} not found` });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve customer' });
  }
});

// POST /api/customers
customersRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, city, pincode } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }
    if (!phone || typeof phone !== 'string' || !/^\+?[0-9\s-]{8,15}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Valid phone number is required (min 8 digits)' });
    }
    if (!address || typeof address !== 'string' || !address.trim()) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }
    if (!city || typeof city !== 'string' || !city.trim()) {
      return res.status(400).json({ success: false, message: 'City is required' });
    }
    if (!pincode || typeof pincode !== 'string' || !pincode.trim()) {
      return res.status(400).json({ success: false, message: 'Pincode is required' });
    }

    const customer = db.createOrUpdateCustomer({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim()
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create customer' });
  }
});
