import React, { useState, useEffect } from 'react';
import './App.css';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import SaleModal from './components/modals/SaleModal';
import InvoiceModal from './components/modals/InvoiceModal';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import StockControl from './pages/StockControl';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
import Reports from './pages/Reports';

function App() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('inventory_mern_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [toasts, setToasts] = useState([]);

  // Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  // Quick Sale Modal from header
  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [quickInvoiceOpen, setQuickInvoiceOpen] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleLoginSuccess = (userData) => {
    sessionStorage.setItem('inventory_mern_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      sessionStorage.removeItem('inventory_mern_user');
      setUser(null);
    }
  };

  const refreshAllData = async () => {
    try {
      const [prodRes, catRes, supRes, salesRes, txRes, countsRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getSuppliers(),
        api.getSales(),
        api.getStockTransactions(),
        api.getCategoryCounts()
      ]);

      if (prodRes.success) setProducts(prodRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
      if (supRes.success) setSuppliers(supRes.data || []);
      if (salesRes.success) setSales(salesRes.data || []);
      if (txRes.success) setTransactions(txRes.data || []);
      if (countsRes.success) setCategoryCounts(countsRes.data || {});
    } catch (err) {
      console.error('Data refresh error:', err);
    }
  };

  useEffect(() => {
    if (user) {
      refreshAllData();
    }
  }, [user]);

  // Handlers for CRUD
  const handleAddProduct = async (data) => {
    try {
      const res = await api.createProduct(data);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateProduct = async (id, data) => {
    try {
      const res = await api.updateProduct(id, data);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      const res = await api.deleteProduct(id);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAdjustStock = async (data) => {
    try {
      const res = await api.adjustStock(data);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddCategory = async (data) => {
    try {
      const res = await api.createCategory(data);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateCategory = async (id, data) => {
    try {
      const res = await api.updateCategory(id, data);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await api.deleteCategory(id);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddSupplier = async (data) => {
    try {
      const res = await api.createSupplier(data);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateSupplier = async (id, data) => {
    try {
      const res = await api.updateSupplier(id, data);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteSupplier = async (id, name) => {
    if (!window.confirm(`Delete supplier "${name}"?`)) return;
    try {
      const res = await api.deleteSupplier(id);
      showToast(res.message, 'success');
      refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRecordSale = async (data) => {
    try {
      const res = await api.createSale(data);
      showToast(res.message, 'success');
      await refreshAllData();
      return res.data;
    } catch (err) {
      showToast(err.message, 'error');
      return null;
    }
  };

  const handleQuickSaleSubmit = async (data) => {
    const saved = await handleRecordSale(data);
    setQuickSaleOpen(false);
    if (saved) {
      setLastSale(saved);
      setQuickInvoiceOpen(true);
    }
  };

  if (!user) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} showToast={showToast} />
        <Toast toasts={toasts} />
      </>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        currentTab={currentTab}
        setTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        <Navbar
          currentTab={currentTab}
          onOpenQuickSale={() => setQuickSaleOpen(true)}
        />

        <main className="content-body">
          {currentTab === 'dashboard' && <Dashboard setTab={setCurrentTab} />}

          {currentTab === 'products' && (
            <Products
              products={products}
              categories={categories}
              suppliers={suppliers}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {currentTab === 'stock' && (
            <StockControl
              products={products}
              suppliers={suppliers}
              transactions={transactions}
              onAdjustStock={handleAdjustStock}
            />
          )}

          {currentTab === 'categories' && (
            <Categories
              categories={categories}
              categoryCounts={categoryCounts}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {currentTab === 'suppliers' && (
            <Suppliers
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}

          {currentTab === 'sales' && (
            <Sales
              sales={sales}
              products={products}
              user={user}
              onRecordSale={handleRecordSale}
            />
          )}

          {currentTab === 'reports' && <Reports />}
        </main>
      </div>

      <SaleModal
        isOpen={quickSaleOpen}
        onClose={() => setQuickSaleOpen(false)}
        onSave={handleQuickSaleSubmit}
        products={products}
      />

      <InvoiceModal
        isOpen={quickInvoiceOpen}
        onClose={() => setQuickInvoiceOpen(false)}
        sale={lastSale}
        user={user}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
