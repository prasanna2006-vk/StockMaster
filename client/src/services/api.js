import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response helper
const handleResponse = (promise) => {
  return promise
    .then(res => res.data)
    .catch(err => {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message || 'An error occurred';
      throw new Error(msg);
    });
};

export const api = {
  // Auth
  login: (data) => handleResponse(client.post('/auth/login', data)),

  // Dashboard
  getDashboardSummary: () => handleResponse(client.get('/dashboard/summary')),

  // Products
  getProducts: () => handleResponse(client.get('/products')),
  searchProducts: (query) => handleResponse(client.get(`/products/search?query=${encodeURIComponent(query)}`)),
  getProductsByCategory: (catId) => handleResponse(client.get(`/products/category/${catId}`)),
  getLowStockProducts: () => handleResponse(client.get('/products/low-stock')),
  createProduct: (data) => handleResponse(client.post('/products', data)),
  updateProduct: (id, data) => handleResponse(client.put(`/products/${id}`, data)),
  deleteProduct: (id) => handleResponse(client.delete(`/products/${id}`)),

  // Stock
  adjustStock: (data) => handleResponse(client.post('/stock/adjust', data)),
  getStockTransactions: () => handleResponse(client.get('/stock/transactions')),

  // Categories
  getCategories: () => handleResponse(client.get('/categories')),
  getCategoryCounts: () => handleResponse(client.get('/categories/counts')),
  createCategory: (data) => handleResponse(client.post('/categories', data)),
  updateCategory: (id, data) => handleResponse(client.put(`/categories/${id}`, data)),
  deleteCategory: (id) => handleResponse(client.delete(`/categories/${id}`)),

  // Suppliers
  getSuppliers: () => handleResponse(client.get('/suppliers')),
  searchSuppliers: (query) => handleResponse(client.get(`/suppliers/search?query=${encodeURIComponent(query)}`)),
  createSupplier: (data) => handleResponse(client.post('/suppliers', data)),
  updateSupplier: (id, data) => handleResponse(client.put(`/suppliers/${id}`, data)),
  deleteSupplier: (id) => handleResponse(client.delete(`/suppliers/${id}`)),

  // Sales
  getSales: () => handleResponse(client.get('/sales')),
  getRecentSales: () => handleResponse(client.get('/sales/recent')),
  getSaleById: (id) => handleResponse(client.get(`/sales/${id}`)),
  createSale: (data) => handleResponse(client.post('/sales', data)),

  // Reports
  getStockReport: () => handleResponse(client.get('/reports/stock')),
  getLowStockReport: () => handleResponse(client.get('/reports/low-stock')),
  getSalesReport: (start, end) => {
    let url = '/reports/sales';
    const params = [];
    if (start) params.push(`startDate=${start}`);
    if (end) params.push(`endDate=${end}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return handleResponse(client.get(url));
  }
};
