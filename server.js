 const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const productsRouter = require('./routes/products');
const errorHandler = require('./middlewares/errorHandler');
const { AuthenticationError } = require('./errors/myErrors');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Parse JSON
app.use(express.json());

// API key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  const validApiKey = 'Password@2027!';

  if (!apiKey) {
    const error = new AuthenticationError('API key is missing');
    error.statusCode = 401;
    return next(error);
  }

  if (apiKey !== validApiKey) {
    const error = new AuthenticationError('Invalid API key');
    error.statusCode = 403;
    return next(error);
  }

  next();
};

// Hello World route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Use product routes with auth
app.use('/api/products', authenticateApiKey, productsRouter);

// Catch-all 404 for unmatched routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
