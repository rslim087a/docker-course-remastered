const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const secretKey = 'secret-key';
let connection;

// MySQL connection details
const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

// Connect to MySQL with retry
async function connectToMySQL() {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('Connected to MySQL');
      
      // Call the createUsersTable function after successful connection
      await createUsersTable();
      
      break;
    } catch (error) {
      console.error(`Error connecting to MySQL (attempt ${i + 1}):`, error);
      if (i === maxRetries - 1) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

// Create users table if it doesn't exist
async function createUsersTable() {
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        postalCode VARCHAR(10) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log('Users table created');
  } catch (error) {
    console.error('Error creating users table:', error);
    process.exit(1);
  }
}

// Call the connectToMySQL function
connectToMySQL();

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Sign up route
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, address, postalCode, email, password } = req.body;

  try {
    // Check if the email is already registered
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create a new user
    await connection.execute(
      'INSERT INTO users (firstName, lastName, address, postalCode, email, password) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, address, postalCode, email, password]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in route
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, secretKey);
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign out route
app.post('/api/signout', authenticateToken, (req, res) => {
  // The user is already authenticated at this point
  // You can perform any necessary cleanup or invalidate the token if needed
  res.json({ message: 'Logout successful' });
});

// Protected route example
app.get('/api/protected', authenticateToken, async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [req.userId]);
    const user = rows[0];
    res.json({ message: 'Protected route accessed successfully', user });
  } catch (error) {
    console.error('Error accessing protected route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user route
app.put('/api/update', authenticateToken, async (req, res) => {
  // Only allow updates to certain fields
  const { firstName, lastName, address, postalCode } = req.body;

  try {
    // Find the user by their ID (decoded from the JWT in authenticateToken)
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [req.userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    await connection.execute(
      'UPDATE users SET firstName = ?, lastName = ?, address = ?, postalCode = ? WHERE id = ?',
      [firstName || user.firstName, lastName || user.lastName, address || user.address, postalCode || user.postalCode, req.userId]
    );

    // Fetch the updated user data
    const [updatedRows] = await connection.execute('SELECT * FROM users WHERE id = ?', [req.userId]);
    const updatedUser = updatedRows[0];

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = 3003;
app.listen(port, () => {
  console.log(`Authentication API is running on port ${port}`);
});