# 📦 Inventory Management System (MERN Stack)

A complete, production-ready, full-stack **Inventory Management System** designed for academic evaluation, college project demonstrations, and enterprise small-business inventory tracking.

Built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with real-time database persistence, interactive dashboards, POS billing with automatic stock validation, printable tax invoices, and stock movement audit logs.

---

## 🌟 Key Features

1. **📊 Executive Dashboard**
   - KPI metrics: Total Products, Total Stock Units, Low Stock Alert Count, Total Sales Revenue.
   - Interactive Visual Analytics:
     - **Doughnut Chart**: Category-wise stock unit distribution.
     - **Bar Chart**: Top selling products by revenue.
   - Recent Sales activity log and real-time Low Stock alert notifications.

2. **🏷️ Product Catalog Management**
   - Full CRUD operations (Create, Read, Update, Delete).
   - Attributes: SKU Code, Product Name, Category, Supplier, Unit Selling Price, Cost Price, Quantity, Low Stock Threshold.
   - Dynamic Status Badges:
     - 🟢 `In Stock` (Quantity > Threshold)
     - 🟡 `Low Stock` (Quantity &le; Threshold)
     - 🔴 `Out of Stock` (Quantity = 0)
   - Real-time search by Product Name or SKU, plus category filtering.

3. **📥 Stock Control & Restocking**
   - **Stock In (Restock)**: Receive new stock shipments with notes/supplier references.
   - **Stock Out / Adjustments**: Deduct damaged, expired, or returned stock.
   - **Automatic Stock Updates**: Instant recalculation across all views.
   - **Audit Trail**: Every adjustment is recorded in the `StockTransaction` ledger with timestamp and reason.
   - Low-Stock alerts triggered whenever inventory falls below the threshold (default: 10 units).

4. **🛒 Sales & POS Billing**
   - Point-of-Sale (POS) order recording with dynamic product selection.
   - **Strict Stock Validation**: Backend and frontend prevent sales exceeding current stock.
   - Real-time unit price and total price calculations.
   - Customer details: Name, phone, and payment method (Cash, Card, UPI, Bank Transfer).
   - Automatic generation of unique invoice numbers (e.g. `INV-20261009-4821`).
   - Instant reduction of inventory quantities upon sale confirmation.

5. **🧾 Printable Tax Invoices**
   - Clean, professional modal receipt view for every sale.
   - One-click **"Print Receipt"** button triggering browser print dialog with styled printable layout.

6. **📁 Category & 🚚 Supplier Management**
   - Categorize items (Electronics, Furniture, Groceries, Clothing, etc.).
   - Supplier directory tracking vendor company names, contact persons, emails, phone numbers, and addresses.
   - Category badges reflecting real-time linked product counts.

7. **📑 Inventory & Sales Reports**
   - **Inventory Valuation Report**: Breakdown of stock quantities, cost values, selling values, and potential profit margins.
   - **Low-Stock Alert Report**: Instant filtered list of items needing immediate reorder.
   - **Sales Summary Report**: Date-range filtering (Today, Last 7 Days, This Month, All Time) with print layout.

8. **🔐 Admin Authentication**
   - Clean, modern login interface with pre-configured quick-fill demo credentials.
   - Session storage token persistence to safeguard protected views.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React.js (v18) | Single Page Application (SPA) architecture |
| **Routing** | React Router v6 | Client-side page navigation |
| **Icons** | Lucide React | Modern vector icon set |
| **Charts** | Chart.js & react-chartjs-2 | Visual analytical charts |
| **Backend** | Node.js & Express.js | RESTful API server with modular routing |
| **Database** | MongoDB | Document database with Mongoose ODM |
| **Theme / UI** | Custom CSS3 | Professional Blue, White, and Slate Grey theme |

---

## 📁 Project Directory Structure

```
inventory-mern/
├── package.json              # Root script runner
├── README.md                 # Complete documentation
├── server/                   # Backend Express & MongoDB application
│   ├── models/               # Mongoose Schema Definitions
│   │   ├── User.js           # Admin authentication schema
│   │   ├── Category.js       # Product categories
│   │   ├── Supplier.js       # Supplier directory
│   │   ├── Product.js        # Product catalog & stock counts
│   │   ├── Sale.js           # Sales records & invoice details
│   │   └── StockTransaction.js # Stock in/out movement audit ledger
│   ├── routes/               # Modular REST API routes
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── supplierRoutes.js
│   │   ├── productRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── saleRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── reportRoutes.js
│   ├── seed.js               # Auto-seeder for sample products & data
│   └── server.js             # Express entry point & static React server
└── client/                   # Frontend React Application
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/       # Reusable UI components
    │   │   ├── Sidebar.js    # Collapsible navigation bar
    │   │   ├── Navbar.js     # Top bar with user profile & logout
    │   │   ├── Toast.js      # Success / Error notification alerts
    │   │   └── modals/       # Popups for Products, Sales, Stock, Invoices
    │   │       ├── ProductModal.js
    │   │       ├── StockModal.js
    │   │       ├── CategoryModal.js
    │   │       ├── SupplierModal.js
    │   │       ├── SaleModal.js
    │   │       └── InvoiceModal.js
    │   ├── pages/            # Main application views
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── Products.js
    │   │   ├── StockControl.js
    │   │   ├── Categories.js
    │   │   ├── Suppliers.js
    │   │   ├── Sales.js
    │   │   └── Reports.js
    │   ├── services/
    │   │   └── api.js        # Centralized Axios API service
    │   ├── App.js            # Main routing configuration
    │   ├── App.css           # Blue/White/Grey theme stylesheet
    │   └── index.js
    └── build/                # Compiled production bundle served by Express
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: LTS version (v18 or higher recommended).
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI).

### 2. Running the Application
The Express server is configured to serve both the backend REST APIs **and** the compiled React production frontend simultaneously on port `5000`.

Open PowerShell or Command Prompt in the project folder:
```powershell
cd C:\Users\Work\.gemini\antigravity\scratch\inventory-mern
node server/server.js
```

### 3. Open in Browser
Visit:
👉 **[http://localhost:5000](http://localhost:5000)**

### 4. Default Login Credentials
- **Username:** `admin`
- **Password:** `admin123`
*(A convenient **"Quick Fill Admin Credentials"** button is also available directly on the login screen).*

---

## 🧪 Development Mode (Optional)
If you wish to run React in hot-reload development mode alongside the backend:
1. Start Backend:
   ```bash
   cd server
   npm start
   ```
2. In a separate terminal, start React Dev Server:
   ```bash
   cd client
   npm start
   ```
   React development server runs on `http://localhost:3000` and proxies API requests to `http://localhost:5000`.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Server health check |
| `/api/auth/login` | POST | Authenticate user credentials & return profile |
| `/api/dashboard/stats` | GET | Retrieve KPI card metrics & chart data |
| `/api/products` | GET / POST | List all products / Create new product |
| `/api/products/:id` | PUT / DELETE | Update existing product / Delete product |
| `/api/stock/adjust` | POST | Add (Stock In) or Deduct (Stock Out) quantity |
| `/api/stock/transactions` | GET | Audit log of all inventory movements |
| `/api/sales` | GET / POST | View sales history / Process new sale with stock deduction |
| `/api/sales/:id` | GET | Retrieve detailed invoice receipt |
| `/api/categories` | GET / POST | Manage product categories |
| `/api/suppliers` | GET / POST | Manage supplier directory |
| `/api/reports/valuation` | GET | Generate inventory valuation report |
| `/api/reports/sales` | GET | Generate date-filtered sales report |

---

## 🎓 College Viva / Project Presentation Q&A

### Q1: Why did you choose the MERN stack for this project?
> **Answer:** The MERN (MongoDB, Express.js, React.js, Node.js) stack offers a unified JavaScript/JSON environment across both client and server. React provides a fluid, responsive single-page application experience with component reusability, Express simplifies building modular REST APIs, and MongoDB's flexible document model pairs naturally with dynamic product attributes and nested invoice structures.

### Q2: How does the system prevent overselling when stock is insufficient?
> **Answer:** The system implements a two-tier defense:
> 1. **Client-side:** The POS Sale modal dynamically displays available stock and disables the Submit button if requested quantity exceeds current stock.
> 2. **Server-side:** In `/api/sales`, the backend queries the product by ID and verifies `product.quantity >= requestedQuantity`. If insufficient, it immediately aborts the transaction with HTTP 400 (`"Insufficient stock available. Current stock: X"`).

### Q3: How is inventory updated when a sale occurs?
> **Answer:** When a sale is processed:
> 1. The product's `quantity` is decremented by the sold amount (`product.quantity -= quantity`).
> 2. The updated product is saved back to MongoDB.
> 3. An audit record is logged into the `StockTransaction` collection marking the type as `'OUT'`, linking the sale reference and recording the previous and new balance.

### Q4: How is low-stock alerting implemented?
> **Answer:** Each product defines a `minThreshold` (defaulting to 10). When `quantity <= minThreshold`, the product is tagged as `'Low Stock'` (or `'Out of Stock'` if 0). The dashboard aggregates these into the Low-Stock KPI card and displays an alert banner with direct links to replenish stock.
