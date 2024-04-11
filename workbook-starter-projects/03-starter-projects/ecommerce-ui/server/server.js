import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import inventoryRoutes from './routes/inventory.js';
import orderRoutes from './routes/orders.js';
import shippingRoutes from './routes/shipping.js';
import contactRoutes from './routes/contact.js';

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', orderRoutes);
app.use('/api', shippingRoutes);
app.use('/api', contactRoutes);

// Handle requests for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Handle requests for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// # Developer: Captain DevOps, here's how to run the app:

// # 1. Clone the repo and navigate to the server directory
// # 2. Run 'npm install' to install server dependencies
// # 3. Navigate to the client directory and run 'npm install' for React app dependencies
// # 4. In the client directory, run 'npm run build' to build the React app
// # 5. Navigate back to the server directory and run 'node app.js'

// # This starts the Node.js server, serving the React app and providing API routes.

// # I've been running it bare metal, but I need you to containerize it.

// # Let me know if you need anything else.

// # Cheers,
// # Master NodeJS
