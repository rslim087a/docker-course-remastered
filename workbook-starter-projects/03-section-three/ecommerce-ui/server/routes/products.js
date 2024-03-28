import express from 'express';
const router = express.Router();
import('node-fetch').then(({ default: fetch }) => {
  const PRODUCT_API_HOST = process.env.REACT_APP_PRODUCT_API_HOST;

  router.get('/products', async (req, res) => {
    try {
      const response = await fetch(`${PRODUCT_API_HOST}:3001/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  });

  router.get('/products/:id', async (req, res) => {
    try {
      const response = await fetch(`${PRODUCT_API_HOST}:3001/api/products/${req.params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Error fetching product' });
    }
  });
});

export default router;