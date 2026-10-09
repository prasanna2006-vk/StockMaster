const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// GET /api/suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.json({ success: true, data: suppliers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/suppliers/search?query=...
router.get('/search', async (req, res) => {
  try {
    const q = req.query.query || '';
    const suppliers = await Supplier.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { contactPerson: { $regex: q, $options: 'i' } }
      ]
    }).sort({ name: 1 });
    res.json({ success: true, data: suppliers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/suppliers/:id
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
    res.json({ success: true, data: supplier });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/suppliers
router.post('/', async (req, res) => {
  try {
    const { name, contactPerson, phone, email, address } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Supplier name is required' });
    }

    const supplier = new Supplier({
      name: name.trim(),
      contactPerson,
      phone,
      email,
      address
    });
    const saved = await supplier.save();
    res.status(201).json({ success: true, message: 'Supplier created successfully', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/suppliers/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, contactPerson, phone, email, address } = req.body;
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

    if (name) supplier.name = name.trim();
    supplier.contactPerson = contactPerson;
    supplier.phone = phone;
    supplier.email = email;
    supplier.address = address;

    const updated = await supplier.save();
    res.json({ success: true, message: 'Supplier updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/suppliers/:id
router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
    res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
