const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Name is required and must be a string' });
  }

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ message: 'Description is required and must be a string' });
  }

  if (price === undefined || typeof price !== 'number') {
    return res.status(400).json({ message: 'Price is required and must be a number' });
  }

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ message: 'Category is required and must be a string' });
  }

  if (inStock === undefined || typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'inStock is required and must be a boolean' });
  }

  // Passed all checks
  next();
};

module.exports = validateProduct;
