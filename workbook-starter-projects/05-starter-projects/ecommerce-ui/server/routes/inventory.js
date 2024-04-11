import express from 'express';
const router = express.Router();
import('node-fetch').then(({ default: fetch }) => {
  const INVENTORY_API_HOST = process.env.REACT_APP_INVENTORY_API_HOST;
  const PRODUCT_API_HOST = process.env.REACT_APP_PRODUCT_API_HOST;

  router.get('/inventory', async (req, res) => {
    try {
      const inventoryResponse = await fetch(`${INVENTORY_API_HOST}:3002/api/inventory`);
      if (!inventoryResponse.ok) {
        const errorData = await inventoryResponse.json();
        throw new Error(errorData.error);
      }
      const inventoryData = await inventoryResponse.json();

      const productsResponse = await fetch(`${PRODUCT_API_HOST}:3001/api/products`);
      if (!productsResponse.ok) {
        const errorData = await productsResponse.json();
        throw new Error(errorData.error);
      }
      const productsData = await productsResponse.json();

      const combinedData = productsData.map(product => {
        const inventoryItem = inventoryData.find(item => item.id === product.id) || {};
        return {
          ...product,
          quantity: inventoryItem.quantity || 0,
        };
      });

      res.json(combinedData);
    } catch (error) {
      console.error('Error fetching inventory and products:', error);
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/inventory/:id', async (req, res) => {
    try {
      const response = await fetch(`${INVENTORY_API_HOST}:3002/api/inventory/${req.params.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

export default router;