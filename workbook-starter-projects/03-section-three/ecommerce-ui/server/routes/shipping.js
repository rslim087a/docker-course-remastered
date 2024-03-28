import express from 'express';
const router = express.Router();
import('node-fetch').then(({ default: fetch }) => {
  const SHIPPING_API_HOST = process.env.REACT_APP_SHIPPING_API_HOST;

  router.get('/shipping-explanation', async (req, res) => {
    try {
      const response = await fetch(`${SHIPPING_API_HOST}:8080/shipping-explanation`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching shipping explanation:', error);
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/all-shipping-fees', async (req, res) => {
    try {
      const response = await fetch(`${SHIPPING_API_HOST}:8080/all-shipping-fees`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching all shipping fees:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

export default router;