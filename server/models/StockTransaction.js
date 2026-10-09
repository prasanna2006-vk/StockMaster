const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  transactionType: {
    type: String,
    enum: ['STOCK_IN', 'STOCK_OUT', 'SALE', 'ADJUSTMENT'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousQuantity: {
    type: Number,
    required: true
  },
  newQuantity: {
    type: Number,
    required: true
  },
  referenceNote: {
    type: String,
    trim: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  transactionDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);
