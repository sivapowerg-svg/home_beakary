import { Router, Request, Response } from 'express';
import { db } from '../db.ts';

export const productsRouter = Router();

// GET /api/products
productsRouter.get('/', (req: Request, res: Response) => {
  try {
    const products = db.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve products' });
  }
});

// GET /api/products/:id
productsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    const product = db.getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: `Product with ID ${id} not found` });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve product' });
  }
});

// POST /api/products
productsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, description, category, price, imageUrl, available } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }
    if (price === undefined || price === null || isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be a positive number' });
    }

    const created = db.createProduct({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: Number(price),
      imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
      available: available !== undefined ? Boolean(available) : true
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

// PUT /api/products/:id
productsRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const existing = db.getProductById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `Product with ID ${id} not found` });
    }

    const { name, description, category, price, imageUrl, available } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (price !== undefined) {
      const p = Number(price);
      if (isNaN(p) || p <= 0) {
        return res.status(400).json({ success: false, message: 'Price must be positive' });
      }
      updateData.price = p;
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (available !== undefined) updateData.available = Boolean(available);

    const updated = db.updateProduct(id, updateData);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id
productsRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const deleted = db.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Product with ID ${id} not found` });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});
