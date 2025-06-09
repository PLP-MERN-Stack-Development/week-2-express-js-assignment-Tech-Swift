const express = require('express');
const router = express.Router();
const validateProduct = require('../middlewares/validateProduct');

const { NotFoundError, ValidationError } = require('../errors/myErrors'); // ✅ updated case

// Sample products
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true,
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true,
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false,
  },
];

// GET all products with optional category filtering
// GET all products with optional category filter and pagination
router.get('/', (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  let filteredProducts = products;

  // Filter by category if provided
  if (category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Pagination logic
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Response with pagination metadata
  res.json({
    totalItems: filteredProducts.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredProducts.length / parseInt(limit)),
    products: paginatedProducts
  });
});


router.get('/error', (req, res, next) => {
  const error = new Error('This is a forced error');
  error.statusCode = 400;
  next(error);
});

async function someAsyncFunction() {
  // Simulate delay (optional)
  await new Promise(resolve => setTimeout(resolve, 100));
  return null; // Always returns null to simulate "not found"
}

router.get('/async-error', async (req, res, next) => {
  try {
    const product = await someAsyncFunction();
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// SEARCH products by name
router.get('/search', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Query parameter "name" is required' });
  }

  const searchTerm = name.toLowerCase();

  const matchedProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );

  res.json({
    totalResults: matchedProducts.length,
    products: matchedProducts
  });
});

// GET product statistics (count by category)
router.get('/stats', (req, res) => {
  const categoryCounts = {};

  products.forEach(product => {
    const category = product.category.toLowerCase();
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  res.json({
    totalProducts: products.length,
    countByCategory: categoryCounts
  });
});

// GET specific product by ID
router.get('/:id', (req, res, next) => {
  const productId = req.params.id;
  const product = products.find(p => p.id === productId);
  if (!product) {
    return next(new NotFoundError(`Product with ID ${productId} not found`));
  }
  res.json(product);
});

// POST create new product
router.post('/', validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    if (!name || !description || price == null || !category || inStock == null) {
      throw new ValidationError('All fields are required to create a product.');
    }

    const newProduct = {
      id: String(products.length + 1),
      name,
      description,
      price,
      category,
      inStock,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PUT update product by ID
router.put('/:id', validateProduct, (req, res, next) => {
  try {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      throw new NotFoundError(`Product with ID ${productId} not found`);
    }

    const { name, description, price, category, inStock } = req.body;

    if (!name || !description || price == null || !category || inStock == null) {
      throw new ValidationError('All fields are required to update the product.');
    }

    products[productIndex] = {
      ...products[productIndex],
      name,
      description,
      price,
      category,
      inStock,
    };

    res.json(products[productIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE product by ID
router.delete('/:id', (req, res, next) => {
  try {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      throw new NotFoundError(`Product with ID ${productId} not found`);
    }

    products.splice(productIndex, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

 
module.exports = router;
