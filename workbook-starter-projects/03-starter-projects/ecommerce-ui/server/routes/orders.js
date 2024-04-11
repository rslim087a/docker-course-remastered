import express from 'express';
const router = express.Router();
import('node-fetch').then(({ default: fetch }) => {
  const ORDER_API_HOST = process.env.REACT_APP_ORDER_API_HOST;

  router.post('/orders/:userId/cart', async (req, res) => {
    try {
      const response = await fetch(`${ORDER_API_HOST}:9090/api/orders/${req.params.userId}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/orders/:userId/cart', async (req, res) => {
    try {
      const response = await fetch(`${ORDER_API_HOST}:9090/api/orders/${req.params.userId}/cart`);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/orders/:userId/cart/subtotal', async (req, res) => {
    try {
      const response = await fetch(`${ORDER_API_HOST}:9090/api/orders/${req.params.userId}/cart/subtotal`);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Error fetching subtotal:', error);
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/orders/:userId/cart/shipping', async (req, res) => {
    try {
      const response = await fetch(`${ORDER_API_HOST}:9090/api/orders/${req.params.userId}/cart/shipping`);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Error fetching shipping total:', error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/orders/:userId/purchase', async (req, res) => {
    try {
      const response = await fetch(`${ORDER_API_HOST}:9090/api/orders/${req.params.userId}/purchase`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

export default router;