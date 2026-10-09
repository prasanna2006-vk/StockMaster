const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user || user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const token = 'TOKEN-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
