const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const secretKey = 'secret-key';

// In-memory storage for users
const users = [];

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
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, address, postalCode, email, password } = req.body;

  // Check if the email is already registered
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  // Create a new user object
  const newUser = {
    id: users.length + 1,
    firstName,
    lastName,
    address,
    postalCode,
    email,
    password,
  };

  // Add the new user to the users array
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// Sign in route
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = users.find((user) => user.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, secretKey);

  res.json({ message: 'Login successful', token, user });
});

// Sign out route
app.post('/api/signout', authenticateToken, (req, res) => {
  // The user is already authenticated at this point
  // You can perform any necessary cleanup or invalidate the token if needed
  res.json({ message: 'Logout successful' });
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  const user = users.find((user) => user.id === req.userId);
  res.json({ message: 'Protected route accessed successfully', user });
});

// Update user route
app.put('/api/update', authenticateToken, (req, res) => {
    // Only allow updates to certain fields
    const { firstName, lastName, address, postalCode } = req.body;
  
    // Find the user by their ID (decoded from the JWT in authenticateToken)
    const userIndex = users.findIndex((user) => user.id === req.userId);
  
    // If user not found, return error
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      firstName: firstName || users[userIndex].firstName,
      lastName: lastName || users[userIndex].lastName,
      address: address || users[userIndex].address,
      postalCode: postalCode || users[userIndex].postalCode,
    };
  
    // Respond with a success message
    res.json({ message: 'User updated successfully', user: users[userIndex] });
  });
  
// Start the server
const port = 3003;
app.listen(port, () => {
  console.log(`Authentication API is running on port ${port}`);
});