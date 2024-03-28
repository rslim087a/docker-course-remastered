import express from 'express';
const router = express.Router();
import('node-fetch').then(({ default: fetch }) => {
  const CONTACT_API_HOST = process.env.REACT_APP_CONTACT_API_HOST;

  router.get('/contact-message', async (req, res) => {
    try {
      const response = await fetch(`${CONTACT_API_HOST}:8000/api/contact-message`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching contact message:', error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/contact-submit', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      const response = await fetch(`${CONTACT_API_HOST}:8000/api/contact-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

export default router;