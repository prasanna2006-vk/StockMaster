const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const saleRoutes = require('./routes/saleRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');
const seedData = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory_mern';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Serve static frontend in production if built
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Inventory MERN Backend is running', timestamp: new Date() });
});

// For any route not handled by API, serve React's index.html if build exists
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Inventory Management System (MERN Stack)</title></head>
        <body style="font-family:sans-serif; text-align:center; padding:50px;">
          <h2>Inventory Management System - MERN Backend</h2>
          <p>MongoDB connected and REST APIs active at <code>/api/*</code>.</p>
          <p>React Frontend runs concurrently on <code>http://localhost:3000</code> or run <code>npm run build</code> to serve from this port.</p>
        </body>
        </html>
      `);
    }
  });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB at:', MONGO_URI);
    // Auto-seed initial catalog if database is empty
    await seedData();
    app.listen(PORT, () => {
      console.log('==================================================================');
      console.log(`🚀 INVENTORY MANAGEMENT SYSTEM (MERN) RUNNING ON PORT ${PORT}`);
      console.log(`   API Endpoint: http://localhost:${PORT}/api/health`);
      console.log(`   Admin Login:  admin / admin123`);
      console.log('==================================================================');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
