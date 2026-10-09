const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'STAFF'],
    default: 'ADMIN'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
