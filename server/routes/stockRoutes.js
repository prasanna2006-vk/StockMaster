const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const StockTransaction = require('../models/StockTransaction');

// POST /api/stock/adjust
router.post('/adjust', async (req, res) => {
  try {
    const { productId, transactionType, quantity, referenceNote, supplierId } = req.body;

    if (!productId || !transactionType || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Required: productId, transactionType, quantity' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive number' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const oldQty = product.quantity;
    let newQty = oldQty;
    const type = transactionType.toUpperCase().trim();

    if (type === 'STOCK_IN') {
      newQty = oldQty + qty;
    } else if (type === 'STOCK_OUT') {
      if (oldQty < qty) {
        return res.status(400).json({
          success: false,
          message: `Cannot deduct ${qty} units. Current stock is only ${oldQty}.`
        });
      }
      newQty = oldQty - qty;
    } else if (type === 'ADJUSTMENT') {
      newQty = qty;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid transaction type' });
    }

    product.quantity = newQty;
    await product.save();

    const transaction = await StockTransaction.create({
      product: product._id,
      transactionType: type,
      quantity: qty,
      previousQuantity: oldQty,
      newQuantity: newQty,
      referenceNote: referenceNote || `Manual ${type}`,
      supplier: supplierId || product.supplier
    });

    const populated = await StockTransaction.findById(transaction._id)
      .populate('product', 'name productCode')
      .populate('supplier', 'name');

    const actionText = type === 'STOCK_IN' ? 'Stock added' : 'Stock adjusted';
    res.json({ success: true, message: `${actionText} successfully`, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/stock/transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await StockTransaction.find()
      .populate('product', 'name productCode')
      .populate('supplier', 'name')
      .sort({ transactionDate: -1 })
      .limit(30);
    res.json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
