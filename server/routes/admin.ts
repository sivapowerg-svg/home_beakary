import { Router, Request, Response } from 'express';
import { db } from '../db.ts';

export const adminRouter = Router();

// POST /api/admin/login
adminRouter.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Simple academic authentication
  const validUsernames = ['admin', 'baker', 'baker@sweetcrumbs.com', 'admin@sweetcrumbs.com'];
  const validPasswords = ['sweetcrumbs2026', 'baker123', 'admin123', 'sweetcrumbs'];

  const normalizedUser = (username || '').toLowerCase().trim();
  const normalizedPass = (password || '').trim();

  if (validUsernames.includes(normalizedUser) && validPasswords.includes(normalizedPass)) {
    res.json({
      success: true,
      token: 'sc_token_' + Buffer.from(`${normalizedUser}:${Date.now()}`).toString('base64'),
      user: {
        name: 'Head Baker Claire',
        email: 'baker@sweetcrumbs.com',
        role: 'BAKER_ADMIN'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials. Hint: use username "admin" and password "sweetcrumbs2026"'
    });
  }
});

// GET /api/admin/stats
adminRouter.get('/stats', (req: Request, res: Response) => {
  try {
    const orders = db.getOrders();
    const products = db.getProducts();
    const customers = db.getCustomers();

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
    const bakingOrders = orders.filter((o) => o.status === 'BAKING').length;
    const outForDelivery = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length;
    const completedOrders = orders.filter((o) => o.status === 'DELIVERED').length;
    const confirmedOrders = orders.filter((o) => o.status === 'CONFIRMED').length;
    const readyOrders = orders.filter((o) => o.status === 'READY_FOR_DELIVERY').length;

    // Total revenue excluding cancelled orders
    const revenue = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    res.json({
      totalOrders,
      pendingOrders,
      bakingOrders,
      outForDelivery,
      completedOrders,
      confirmedOrders,
      readyOrders,
      revenue,
      totalProducts: products.length,
      totalCustomers: customers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to calculate stats' });
  }
});
