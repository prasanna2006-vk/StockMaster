const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const StockTransaction = require('../models/StockTransaction');
const Category = require('../models/Category');

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    // Aggregations on products
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalStockQuantity: { $sum: '$quantity' },
          totalValuation: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);

    const totalStockQuantity = productStats[0] ? productStats[0].totalStockQuantity : 0;
    const totalStockValuation = productStats[0] ? parseFloat(productStats[0].totalValuation.toFixed(2)) : 0;

    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    });

    const outOfStockCount = await Product.countDocuments({ quantity: { $lte: 0 } });

    // Aggregations on sales
    const salesStats = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSalesAmount: { $sum: '$totalAmount' },
          totalSalesCount: { $sum: 1 }
        }
      }
    ]);

    const totalSalesAmount = salesStats[0] ? parseFloat(salesStats[0].totalSalesAmount.toFixed(2)) : 0;
    const totalSalesCount = salesStats[0] ? salesStats[0].totalSalesCount : 0;

    // Recent items
    const recentSales = await Sale.find()
      .populate('product', 'name productCode')
      .sort({ saleDate: -1 })
      .limit(10);

    const recentStockTransactions = await StockTransaction.find()
      .populate('product', 'name productCode')
      .populate('supplier', 'name')
      .sort({ transactionDate: -1 })
      .limit(10);

    // Category distribution
    const categoryAgg = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryObj'
        }
      },
      {
        $unwind: { path: '$categoryObj', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: { $ifNull: ['$categoryObj.name', 'Unassigned'] },
          totalQty: { $sum: '$quantity' }
        }
      }
    ]);

    const categoryDistribution = {};
    categoryAgg.forEach(item => {
      categoryDistribution[item._id] = item.totalQty;
    });

    // Top Selling Products
    const topSelling = await Sale.aggregate([
      {
        $group: {
          _id: '$product',
          quantity: { $sum: '$quantity' },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'prod'
        }
      },
      { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ['$prod.name', 'Unknown'] },
          quantity: 1,
          revenue: { $round: ['$revenue', 2] }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalStockQuantity,
        lowStockCount,
        outOfStockCount,
        totalSalesAmount,
        totalSalesCount,
        totalStockValuation,
        recentSales,
        recentStockTransactions,
        categoryDistribution,
        topSellingProducts: topSelling
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
