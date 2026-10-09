const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/categories/counts
router.get('/counts', async (req, res) => {
  try {
    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const map = {};
    counts.forEach(c => {
      if (c._id) map[c._id.toString()] = c.count;
    });
    res.json({ success: true, data: map });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/categories/:id
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (existing) {
      return res.status(400).json({ success: false, message: `Category "${name}" already exists` });
    }

    const category = new Category({ name: name.trim(), description });
    const saved = await category.save();
    res.status(201).json({ success: true, message: 'Category created successfully', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    if (name && name.trim()) {
      const existing = await Category.findOne({
        _id: { $ne: req.params.id },
        name: new RegExp(`^${name.trim()}$`, 'i')
      });
      if (existing) {
        return res.status(400).json({ success: false, message: `Category "${name}" already exists` });
      }
      category.name = name.trim();
    }
    category.description = description;
    const updated = await category.save();
    res.json({ success: true, message: 'Category updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const linkedProducts = await Product.countDocuments({ category: req.params.id });
    if (linkedProducts > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}" because it contains ${linkedProducts} product(s). Please reassign or delete them first.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
