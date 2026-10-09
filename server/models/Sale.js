const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true,
    trim: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  customerName: {
    type: String,
    trim: true,
    default: 'Walk-in Customer'
  },
  customerPhone: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Bank Transfer'],
    default: 'Cash'
  },
  notes: {
    type: String,
    trim: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
