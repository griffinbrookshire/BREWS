// server/index.js

const express = require('express');
const connectDB = require('../config/db');

const PORT = process.env.PORT || 3001;

// Initialize Express
const app = express();

// Connect Database
connectDB();

// Initialize Middleware
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/breweries', require('./routes/api/breweries'));
app.use('/api/beers', require('./routes/api/beers'));
app.use('/api/auth', require('./routes/api/auth'));

// Start Server
app.listen(PORT, () => {
  console.log(`Backend Server listening on ${PORT}`);
});
