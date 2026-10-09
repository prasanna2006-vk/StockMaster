const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const StockTransaction = require('../models/StockTransaction');

// Helper to generate invoice number
const generateInvoiceNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let invoice = '';
  let exists = true;
  while (exists) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    invoice = `INV-${dateStr}-${rand}`;
    const found = await Sale.findOne({ invoiceNumber: invoice });
    if (!found) exists = false;
  }
  return invoice;
};

// POST /api/sales
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, unitPrice, customerName, customerPhone, paymentMethod, notes } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product and quantity are required' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Sale quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Prevent sales when sufficient stock is unavailable
    if (product.quantity < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${qty}`
      });
    }

    const price = unitPrice !== undefined && unitPrice !== null && unitPrice !== '' ? Number(unitPrice) : product.price;
    const totalAmount = parseFloat((price * qty).toFixed(2));
    const invoiceNumber = await generateInvoiceNumber();

    const oldQty = product.quantity;
    const newQty = oldQty - qty;
    product.quantity = newQty;
    await product.save();

    const sale = new Sale({
      invoiceNumber,
      product: product._id,
      quantity: qty,
      unitPrice: price,
      totalAmount,
      customerName: customerName && customerName.trim() ? customerName.trim() : 'Walk-in Customer',
      customerPhone,
      paymentMethod: paymentMethod || 'Cash',
      notes,
      saleDate: new Date()
    });

    const savedSale = await sale.save();

    // Log Stock Movement
    await StockTransaction.create({
      product: product._id,
      transactionType: 'SALE',
      quantity: qty,
      previousQuantity: oldQty,
      newQuantity: newQty,
      referenceNote: `Sale Invoice #${invoiceNumber}`,
      supplier: product.supplier
    });

    const populated = await Sale.findById(savedSale._id).populate('product', 'name productCode price');
    res.status(201).json({
      success: true,
      message: `Sale recorded successfully! Invoice: ${invoiceNumber}`,
      data: populated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('product', 'name productCode price')
      .sort({ saleDate: -1 });
    res.json({ success: true, data: sales });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sales/recent
router.get('/recent', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('product', 'name productCode price')
      .sort({ saleDate: -1 })
      .limit(10);
    res.json({ success: true, data: sales });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sales/:id
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('product', 'name productCode price');
    if (!sale) return res.status(404).json({ success: false, message: 'Sale invoice not found' });
    res.json({ success: true, data: sale });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
