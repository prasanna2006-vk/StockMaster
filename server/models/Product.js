const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: {
    type: String,
    required: [true, 'Product code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price must be positive']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [1, 'Low stock threshold must be at least 1']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  }
}, { timestamps: true });

productSchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.lowStockThreshold;
});

module.exports = mongoose.model('Product', productSchema);
