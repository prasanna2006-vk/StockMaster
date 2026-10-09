const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');

// GET /api/reports/stock
router.get('/stock', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('supplier', 'name phone')
      .sort({ name: 1 });

    let totalStockQuantity = 0;
    let totalStockValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      totalStockQuantity += p.quantity;
      totalStockValuation += (p.price * p.quantity);
      if (p.quantity <= 0) outOfStockCount++;
      else if (p.quantity <= p.lowStockThreshold) lowStockCount++;
    });

    res.json({
      success: true,
      data: {
        products,
        totalProducts: products.length,
        totalStockQuantity,
        totalStockValuation: parseFloat(totalStockValuation.toFixed(2)),
        lowStockCount,
        outOfStockCount,
        generatedAt: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reports/low-stock
router.get('/low-stock', async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    })
      .populate('category', 'name')
      .populate('supplier', 'name phone email')
      .sort({ quantity: 1 });

    res.json({
      success: true,
      data: {
        products,
        count: products.length,
        generatedAt: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reports/sales?startDate=...&endDate=...
router.get('/sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.saleDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.saleDate.$lte = end;
      }
    }

    const sales = await Sale.find(query)
      .populate('product', 'name productCode price')
      .sort({ saleDate: -1 });

    let totalRevenue = 0;
    let totalUnitsSold = 0;

    sales.forEach(s => {
      totalRevenue += s.totalAmount;
      totalUnitsSold += s.quantity;
    });

    const averageOrderValue = sales.length > 0 ? parseFloat((totalRevenue / sales.length).toFixed(2)) : 0;

    res.json({
      success: true,
      data: {
        sales,
        totalSalesCount: sales.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalUnitsSold,
        averageOrderValue,
        startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        endDate: endDate || new Date().toISOString().slice(0, 10),
        generatedAt: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
