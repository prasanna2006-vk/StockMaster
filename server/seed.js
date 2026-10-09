const User = require('./models/User');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const StockTransaction = require('./models/StockTransaction');

async function seedData() {
  try {
    // 1. Seed Admin
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        fullName: 'System Administrator',
        email: 'admin@inventory.local',
        role: 'ADMIN'
      });
      console.log('🌱 Seeded Admin user (admin / admin123)');
    }

    // 2. Seed Categories
    let catElectronics = await Category.findOne({ name: 'Electronics' });
    if (!catElectronics) {
      catElectronics = await Category.create({ name: 'Electronics', description: 'Displays, laptops, adapters' });
    }
    let catPeripherals = await Category.findOne({ name: 'Peripherals' });
    if (!catPeripherals) {
      catPeripherals = await Category.create({ name: 'Peripherals', description: 'Mice, keyboards, webcams' });
    }
    let catNetworking = await Category.findOne({ name: 'Networking' });
    if (!catNetworking) {
      catNetworking = await Category.create({ name: 'Networking', description: 'Routers, cables, switches' });
    }
    let catOffice = await Category.findOne({ name: 'Office Supplies' });
    if (!catOffice) {
      catOffice = await Category.create({ name: 'Office Supplies', description: 'Chairs, paper rolls, organizers' });
    }

    // 3. Seed Suppliers
    let supTech = await Supplier.findOne({ name: 'TechDistro Global' });
    if (!supTech) {
      supTech = await Supplier.create({
        name: 'TechDistro Global',
        contactPerson: 'Robert Lang',
        phone: '+1-555-0199',
        email: 'sales@techdistro.com',
        address: '400 Tech Boulevard, San Jose, CA'
      });
    }
    let supApex = await Supplier.findOne({ name: 'Apex Components Inc' });
    if (!supApex) {
      supApex = await Supplier.create({
        name: 'Apex Components Inc',
        contactPerson: 'Sarah Connor',
        phone: '+1-555-0144',
        email: 'contact@apexcomp.io',
        address: '720 Silicon Way, Austin, TX'
      });
    }
    let supLogi = await Supplier.findOne({ name: 'Office Prime Solutions' });
    if (!supLogi) {
      supLogi = await Supplier.create({
        name: 'Office Prime Solutions',
        contactPerson: 'David Miller',
        phone: '+1-555-0177',
        email: 'support@officeprime.com',
        address: '18 Enterprise Road, Chicago, IL'
      });
    }

    // 4. Seed Products
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      const p1 = await Product.create({
        productCode: 'PRD-1001',
        name: 'Dell UltraSharp 27" 4K Monitor',
        description: 'IPS display with USB-C Hub, 99% sRGB color gamut',
        price: 329.99,
        costPrice: 240.00,
        quantity: 25,
        lowStockThreshold: 10,
        category: catElectronics._id,
        supplier: supTech._id
      });

      const p2 = await Product.create({
        productCode: 'PRD-1002',
        name: 'Logitech MX Master 3S Wireless Mouse',
        description: 'Quiet clicks, 8K DPI sensor, ergonomic contouring',
        price: 99.50,
        costPrice: 65.00,
        quantity: 18,
        lowStockThreshold: 10,
        category: catPeripherals._id,
        supplier: supLogi._id
      });

      const p3 = await Product.create({
        productCode: 'PRD-1003',
        name: 'Mechanical RGB Gaming Keyboard',
        description: 'Hot-swappable tactile switches with aluminum top frame',
        price: 84.99,
        costPrice: 52.00,
        quantity: 14,
        lowStockThreshold: 10,
        category: catPeripherals._id,
        supplier: supApex._id
      });

      // Low Stock Item
      const p4 = await Product.create({
        productCode: 'PRD-1004',
        name: 'USB-C Multiport Hub 8-in-1',
        description: 'Dual HDMI 4K, 100W Power Delivery, SD Card reader',
        price: 42.00,
        costPrice: 22.00,
        quantity: 5,
        lowStockThreshold: 10,
        category: catElectronics._id,
        supplier: supTech._id
      });

      const p5 = await Product.create({
        productCode: 'PRD-1005',
        name: 'Cat6 Snagless Ethernet Cable 15m',
        description: 'High bandwidth 550MHz UTP patch cable with gold-plated connectors',
        price: 12.50,
        costPrice: 6.00,
        quantity: 45,
        lowStockThreshold: 10,
        category: catNetworking._id,
        supplier: supApex._id
      });

      // Low Stock Item
      const p6 = await Product.create({
        productCode: 'PRD-1006',
        name: 'High-Speed Thermal Receipt Rolls (Box of 50)',
        description: 'BPA Free standard 80mm POS receipt paper rolls',
        price: 38.00,
        costPrice: 20.00,
        quantity: 3,
        lowStockThreshold: 10,
        category: catOffice._id,
        supplier: supLogi._id
      });

      // Low Stock Item
      const p7 = await Product.create({
        productCode: 'PRD-1007',
        name: 'Ergonomic Lumbar Mesh Office Chair',
        description: 'Breathable high-back desk chair with 3D armrests',
        price: 179.99,
        costPrice: 115.00,
        quantity: 7,
        lowStockThreshold: 10,
        category: catOffice._id,
        supplier: supLogi._id
      });

      const p8 = await Product.create({
        productCode: 'PRD-1008',
        name: 'Wi-Fi 6 Dual-Band Mesh Router AX3000',
        description: 'Whole home gigabit mesh wireless coverage up to 3000 sq ft',
        price: 129.99,
        costPrice: 85.00,
        quantity: 16,
        lowStockThreshold: 10,
        category: catNetworking._id,
        supplier: supTech._id
      });

      // Initial Stock Movement Logs
      await StockTransaction.create([
        { product: p1._id, transactionType: 'STOCK_IN', quantity: 25, previousQuantity: 0, newQuantity: 25, referenceNote: 'Initial procurement PO-9801', supplier: supTech._id },
        { product: p2._id, transactionType: 'STOCK_IN', quantity: 20, previousQuantity: 0, newQuantity: 20, referenceNote: 'Batch intake PO-9802', supplier: supLogi._id },
        { product: p3._id, transactionType: 'STOCK_IN', quantity: 15, previousQuantity: 0, newQuantity: 15, referenceNote: 'Batch intake PO-9803', supplier: supApex._id },
        { product: p4._id, transactionType: 'STOCK_IN', quantity: 10, previousQuantity: 0, newQuantity: 10, referenceNote: 'Stock intake PO-9804', supplier: supTech._id },
        { product: p5._id, transactionType: 'STOCK_IN', quantity: 50, previousQuantity: 0, newQuantity: 50, referenceNote: 'Bulk purchase PO-9805', supplier: supApex._id },
        { product: p6._id, transactionType: 'STOCK_IN', quantity: 10, previousQuantity: 0, newQuantity: 10, referenceNote: 'Office restock PO-9806', supplier: supLogi._id },
        { product: p7._id, transactionType: 'STOCK_IN', quantity: 10, previousQuantity: 0, newQuantity: 10, referenceNote: 'Furniture batch PO-9807', supplier: supLogi._id },
        { product: p8._id, transactionType: 'STOCK_IN', quantity: 18, previousQuantity: 0, newQuantity: 18, referenceNote: 'Hardware intake PO-9808', supplier: supTech._id }
      ]);

      // Seed Initial Sales
      const s1 = await Sale.create({
        invoiceNumber: 'INV-20261007-1011',
        product: p1._id,
        quantity: 1,
        unitPrice: 329.99,
        totalAmount: 329.99,
        customerName: 'Campus IT Department',
        customerPhone: '+1-555-8821',
        paymentMethod: 'Card',
        notes: 'Lab workstation display'
      });

      const s2 = await Sale.create({
        invoiceNumber: 'INV-20261008-1012',
        product: p2._id,
        quantity: 2,
        unitPrice: 99.50,
        totalAmount: 199.00,
        customerName: 'Alice Johnson',
        customerPhone: '+1-555-9012',
        paymentMethod: 'UPI',
        notes: 'Student purchase'
      });

      const s3 = await Sale.create({
        invoiceNumber: 'INV-20261009-1013',
        product: p4._id,
        quantity: 3,
        unitPrice: 42.00,
        totalAmount: 126.00,
        customerName: 'Mark Stevens',
        customerPhone: '+1-555-3344',
        paymentMethod: 'Cash',
        notes: 'Engineering dept adapters'
      });

      const s4 = await Sale.create({
        invoiceNumber: 'INV-20261009-1014',
        product: p7._id,
        quantity: 2,
        unitPrice: 179.99,
        totalAmount: 359.98,
        customerName: 'Faculty Office',
        customerPhone: '+1-555-4422',
        paymentMethod: 'Bank Transfer',
        notes: 'Staff chairs'
      });

      await StockTransaction.create([
        { product: p2._id, transactionType: 'SALE', quantity: 2, previousQuantity: 20, newQuantity: 18, referenceNote: 'Sale Invoice #' + s2.invoiceNumber, supplier: supLogi._id },
        { product: p4._id, transactionType: 'SALE', quantity: 3, previousQuantity: 8, newQuantity: 5, referenceNote: 'Sale Invoice #' + s3.invoiceNumber, supplier: supTech._id },
        { product: p7._id, transactionType: 'SALE', quantity: 2, previousQuantity: 9, newQuantity: 7, referenceNote: 'Sale Invoice #' + s4.invoiceNumber, supplier: supLogi._id }
      ]);

      console.log('🌱 Seeded initial products, stock audit logs, and sales records.');
    }
  } catch (err) {
    console.error('Error during data seeding:', err.message);
  }
}

module.exports = seedData;
