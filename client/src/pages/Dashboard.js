import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = ({ setTab }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.getDashboardSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading dashboard metrics...</div>;
  }

  const d = summary || {};
  const catDist = d.categoryDistribution || {};
  const catLabels = Object.keys(catDist);
  const catValues = Object.values(catDist);

  const doughnutData = {
    labels: catLabels.length > 0 ? catLabels : ['No Data'],
    datasets: [{
      data: catValues.length > 0 ? catValues : [1],
      backgroundColor: [
        '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
        '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const topProds = d.topSellingProducts || [];
  const barData = {
    labels: topProds.length > 0 ? topProds.map(p => p.name) : ['No Sales Yet'],
    datasets: [{
      label: 'Revenue ($)',
      data: topProds.length > 0 ? topProds.map(p => p.revenue) : [0],
      backgroundColor: '#10b981',
      borderRadius: 6
    }]
  };

  return (
    <div>
      {/* Low Stock Alert Banner */}
      {d.lowStockCount > 0 && (
        <div className="alert-banner">
          <div className="alert-banner-content">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>Warning: <strong>{d.lowStockCount} product(s)</strong> are currently below minimum stock threshold!</span>
          </div>
          <button className="btn btn-warning btn-sm" onClick={() => setTab('stock')}>
            Review Low Stock
          </button>
        </div>
      )}

      {/* Metrics Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <i className="fa-solid fa-box-open"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{d.totalProducts ?? 0}</div>
            <div className="stat-subtext">Active catalog items</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">
            <i className="fa-solid fa-cubes-stacked"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Stock Quantity</div>
            <div className="stat-value">{d.totalStockQuantity ?? 0}</div>
            <div className="stat-subtext">Available warehouse units</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Low Stock Alerts</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{d.lowStockCount ?? 0}</div>
            <div className="stat-subtext">&le; 10 units remaining</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Sales Revenue</div>
            <div className="stat-value">${Number(d.totalSalesAmount || 0).toFixed(2)}</div>
            <div className="stat-subtext">{d.totalSalesCount ?? 0} completed transactions</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3><i className="fa-solid fa-chart-pie" style={{ color: '#3b82f6', marginRight: 8 }}></i> Stock Distribution by Category</h3>
            <span className="badge badge-blue">Category Breakdown</span>
          </div>
          <div className="chart-canvas-container">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3><i className="fa-solid fa-chart-column" style={{ color: '#10b981', marginRight: 8 }}></i> Top Products by Sales Revenue</h3>
            <span className="badge badge-purple">High Performers</span>
          </div>
          <div className="chart-canvas-container">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { callback: (val) => '$' + val }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activities and Recent Sales */}
      <div className="dashboard-tables-grid">
        <div className="card-section">
          <div className="card-header">
            <h3><i className="fa-solid fa-clock-rotate-left"></i> Recent Sales Transactions</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setTab('sales')}>View All</button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {!d.recentSales || d.recentSales.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>No sales recorded yet.</td></tr>
                ) : (
                  d.recentSales.slice(0, 5).map(s => (
                    <tr key={s._id}>
                      <td><strong>{s.invoiceNumber}</strong></td>
                      <td>{s.product?.name || 'Unknown'}</td>
                      <td><span className="badge badge-purple">{s.quantity} pcs</span></td>
                      <td><strong>${Number(s.totalAmount).toFixed(2)}</strong></td>
                      <td>{new Date(s.saleDate).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-section">
          <div className="card-header">
            <h3><i className="fa-solid fa-arrows-spin"></i> Recent Inventory Activities</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setTab('stock')}>Stock Logs</button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Change</th>
                  <th>New Qty</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {!d.recentStockTransactions || d.recentStockTransactions.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>No stock movements logged.</td></tr>
                ) : (
                  d.recentStockTransactions.slice(0, 5).map(tx => {
                    const badge = tx.transactionType === 'STOCK_IN' ? 'badge-in-stock' :
                                  tx.transactionType === 'SALE' ? 'badge-purple' : 'badge-low-stock';
                    const sign = tx.transactionType === 'STOCK_IN' ? '+' : '-';
                    return (
                      <tr key={tx._id}>
                        <td>{tx.product?.name || 'Product'}</td>
                        <td><span className={`badge ${badge}`}>{tx.transactionType}</span></td>
                        <td><strong>{sign}{tx.quantity}</strong></td>
                        <td>{tx.newQuantity} units</td>
                        <td>{new Date(tx.transactionDate).toLocaleDateString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
