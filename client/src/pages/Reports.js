import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Reports = () => {
  const [reportType, setReportType] = useState('stock');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchReport(reportType);
  }, [reportType]);

  const fetchReport = async (type, start = '', end = '') => {
    setLoading(true);
    try {
      let res;
      if (type === 'stock') {
        res = await api.getStockReport();
      } else if (type === 'low') {
        res = await api.getLowStockReport();
      } else if (type === 'sales') {
        res = await api.getSalesReport(start, end);
      }
      if (res && res.success) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySalesFilter = () => {
    fetchReport('sales', startDate, endDate);
  };

  const handleSetPreset = (preset) => {
    const today = new Date().toISOString().slice(0, 10);
    if (preset === 'today') {
      setStartDate(today);
      setEndDate(today);
      fetchReport('sales', today, today);
    } else if (preset === 'month') {
      const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
      setStartDate(firstDay);
      setEndDate(today);
      fetchReport('sales', firstDay, today);
    }
  };

  return (
    <div className="card-section">
      <div className="toolbar-bar">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${reportType === 'stock' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setReportType('stock')}
          >
            Stock Report
          </button>
          <button
            className={`btn btn-sm ${reportType === 'low' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setReportType('low')}
          >
            Low Stock Report
          </button>
          <button
            className={`btn btn-sm ${reportType === 'sales' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setReportType('sales')}
          >
            Sales Summary Report
          </button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
          <i className="fa-solid fa-print"></i> Print Report
        </button>
      </div>

      {reportType === 'sales' && (
        <div style={{
          padding: '12px 20px',
          background: '#f1f5f9',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Date Range:</label>
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto', padding: '6px 10px' }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto', padding: '6px 10px' }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" onClick={handleApplySalesFilter}>Filter</button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleSetPreset('today')}>Today</button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleSetPreset('month')}>This Month</button>
        </div>
      )}

      <div style={{ padding: 24 }}>
        {loading ? (
          <p style={{ color: '#64748b' }}>Generating report...</p>
        ) : !reportData ? (
          <p>No report data available.</p>
        ) : reportType === 'stock' ? (
          <div>
            <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: 12, marginBottom: 16 }}>
              <h2>Inventory Stock Valuation Report</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Generated on {new Date(reportData.generatedAt).toLocaleString()}
              </p>
            </div>

            <div className="stats-grid" style={{ marginBottom: 20 }}>
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-label">Total Catalog Products</div>
                  <div className="stat-value">{reportData.totalProducts}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-label">Total Stock Quantity</div>
                  <div className="stat-value">{reportData.totalStockQuantity} units</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-label">Total Inventory Valuation</div>
                  <div className="stat-value" style={{ color: 'var(--primary)' }}>
                    ${Number(reportData.totalStockValuation).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Selling Price</th>
                  <th>Stock Qty</th>
                  <th>Valuation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.products?.map(p => (
                  <tr key={p._id}>
                    <td><strong>{p.productCode}</strong></td>
                    <td>{p.name}</td>
                    <td>{p.category?.name || '-'}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td><strong>{p.quantity}</strong></td>
                    <td>${(p.quantity * Number(p.price)).toFixed(2)}</td>
                    <td>
                      {p.quantity <= p.lowStockThreshold ? (
                        <span className="badge badge-low-stock">Low Stock</span>
                      ) : (
                        <span className="badge badge-in-stock">Healthy</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : reportType === 'low' ? (
          <div>
            <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: 12, marginBottom: 16 }}>
              <h2>Low Stock & Replenishment Reorder Report</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Generated on {new Date(reportData.generatedAt).toLocaleString()}
              </p>
            </div>

            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 8,
              padding: '12px 18px',
              marginBottom: 18,
              color: '#92400e'
            }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }}></i>
              Currently <strong>{reportData.count} product(s)</strong> require replenishment order.
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Supplier</th>
                  <th>Supplier Phone</th>
                </tr>
              </thead>
              <tbody>
                {reportData.products?.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>All stock levels are healthy!</td></tr>
                ) : (
                  reportData.products?.map(p => (
                    <tr key={p._id}>
                      <td><strong>{p.productCode}</strong></td>
                      <td><strong>{p.name}</strong></td>
                      <td><span className="badge badge-low-stock">{p.quantity} units</span></td>
                      <td>{p.lowStockThreshold} units</td>
                      <td>{p.supplier?.name || 'Unassigned'}</td>
                      <td>{p.supplier?.phone || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: 12, marginBottom: 16 }}>
              <h2>Sales & Revenue Performance Report</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Period: {reportData.startDate} to {reportData.endDate} &bull; Generated: {new Date(reportData.generatedAt).toLocaleString()}
              </p>
            </div>

            <div className="stats-grid" style={{ marginBottom: 20 }}>
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-label">Total Transactions</div>
                  <div className="stat-value">{reportData.totalSalesCount}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-label">Total Units Sold</div>
                  <div className="stat-value">{reportData.totalUnitsSold} pcs</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-label">Total Revenue Generated</div>
                  <div className="stat-value" style={{ color: 'var(--success)' }}>
                    ${Number(reportData.totalRevenue).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-label">Average Order Value</div>
                  <div className="stat-value">${Number(reportData.averageOrderValue).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Amount</th>
                  <th>Customer</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {reportData.sales?.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center' }}>No sales for the selected date range.</td></tr>
                ) : (
                  reportData.sales?.map(s => (
                    <tr key={s._id}>
                      <td><strong>{s.invoiceNumber}</strong></td>
                      <td>{new Date(s.saleDate).toLocaleDateString()}</td>
                      <td>{s.product?.name || 'Unknown'}</td>
                      <td>{s.quantity}</td>
                      <td>${Number(s.unitPrice).toFixed(2)}</td>
                      <td><strong>${Number(s.totalAmount).toFixed(2)}</strong></td>
                      <td>{s.customerName || 'Walk-in'}</td>
                      <td><span className="badge badge-blue">{s.paymentMethod || 'Cash'}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
