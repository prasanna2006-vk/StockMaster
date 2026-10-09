const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const StockTransaction = require('../models/StockTransaction');
const Sale = require('../models/Sale');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('supplier', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/search?query=...
router.get('/search', async (req, res) => {
  try {
    const q = req.query.query || '';
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { productCode: { $regex: q, $options: 'i' } }
      ]
    })
      .populate('category', 'name')
      .populate('supplier', 'name phone')
      .sort({ name: 1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/category/:categoryId
router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate('category', 'name')
      .populate('supplier', 'name phone')
      .sort({ name: 1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/low-stock
router.get('/low-stock', async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    })
      .populate('category', 'name')
      .populate('supplier', 'name phone')
      .sort({ quantity: 1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('supplier', 'name phone');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const {
      productCode, name, description, price, costPrice,
      quantity, lowStockThreshold, categoryId, supplierId
    } = req.body;

    if (!productCode || !name || price === undefined || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Required fields: productCode, name, price, quantity' });
    }

    const code = productCode.trim().toUpperCase();
    const existing = await Product.findOne({ productCode: code });
    if (existing) {
      return res.status(400).json({ success: false, message: `Product code "${code}" already exists` });
    }

    const product = new Product({
      productCode: code,
      name: name.trim(),
      description,
      price: Number(price),
      costPrice: costPrice !== undefined && costPrice !== null && costPrice !== '' ? Number(costPrice) : undefined,
      quantity: Number(quantity),
      lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : 10,
      category: categoryId || undefined,
      supplier: supplierId || undefined
    });

    const saved = await product.save();

    // Log initial stock movement if quantity > 0
    if (saved.quantity > 0) {
      await StockTransaction.create({
        product: saved._id,
        transactionType: 'STOCK_IN',
        quantity: saved.quantity,
        previousQuantity: 0,
        newQuantity: saved.quantity,
        referenceNote: 'Initial stock intake',
        supplier: supplierId || undefined
      });
    }

    const populated = await Product.findById(saved._id).populate('category', 'name').populate('supplier', 'name');
    res.status(201).json({ success: true, message: 'Product created successfully', data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const {
      productCode, name, description, price, costPrice,
      quantity, lowStockThreshold, categoryId, supplierId
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (productCode) {
      const code = productCode.trim().toUpperCase();
      if (code !== product.productCode) {
        const existing = await Product.findOne({ _id: { $ne: req.params.id }, productCode: code });
        if (existing) {
          return res.status(400).json({ success: false, message: `Product code "${code}" already exists` });
        }
        product.productCode = code;
      }
    }

    if (name) product.name = name.trim();
    product.description = description;
    if (price !== undefined) product.price = Number(price);
    product.costPrice = costPrice !== undefined && costPrice !== null && costPrice !== '' ? Number(costPrice) : undefined;
    if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold);
    product.category = categoryId || undefined;
    product.supplier = supplierId || undefined;

    // Track stock change if edited directly
    if (quantity !== undefined && Number(quantity) !== product.quantity) {
      const oldQty = product.quantity;
      const newQty = Number(quantity);
      product.quantity = newQty;

      await StockTransaction.create({
        product: product._id,
        transactionType: 'ADJUSTMENT',
        quantity: Math.abs(newQty - oldQty),
        previousQuantity: oldQty,
        newQuantity: newQty,
        referenceNote: 'Quantity manual adjustment in product edit',
        supplier: supplierId || undefined
      });
    }

    const updated = await product.save();
    const populated = await Product.findById(updated._id).populate('category', 'name').populate('supplier', 'name');
    res.json({ success: true, message: 'Product updated successfully', data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const salesCount = await Sale.countDocuments({ product: req.params.id });
    if (salesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete product "${product.name}" as it is linked to ${salesCount} sale transaction(s). You can adjust its stock to 0 instead.`
      });
    }

    await StockTransaction.deleteMany({ product: req.params.id });
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
