const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Environment variables
const mongoUrl = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
const dbName = process.env.MONGODB_DATABASE;

// Load products data from JSON file
const productsData = JSON.parse(fs.readFileSync('products.json'));

// Connect to MongoDB
MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
  console.log('Connected to MongoDB');
  const db = client.db(dbName);

  // Check if products collection is empty
  const count = await db.collection('products').countDocuments();
  if (count === 0) {
    // Insert products data into the database
    await db.collection('products').insertMany(productsData);
    console.log('Inserted initial products data');
  }

  // Get all products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await db.collection('products').find().toArray();
      res.json(products);
    } catch (err) {
      console.error('Error retrieving products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get a single product by ID
  app.get('/api/products/:id', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await db.collection('products').findOne({ id: productId });
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (err) {
      console.error('Error retrieving product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Start the server
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Product Catalog microservice is running on port ${port}`);
  });
});