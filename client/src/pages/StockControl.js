import React, { useState } from 'react';
import StockModal from '../components/modals/StockModal';

const StockControl = ({ products, suppliers, transactions, onAdjustStock }) => {
  const [filterMode, setFilterMode] = useState('all');
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [modalType, setModalType] = useState('STOCK_IN');
  const [preselectedProdId, setPreselectedProdId] = useState('');

  const displayProducts = filterMode === 'low'
    ? products.filter(p => p.quantity <= p.lowStockThreshold)
    : products;

  const handleOpenModal = (type, prodId = '') => {
    setModalType(type);
    setPreselectedProdId(prodId);
    setStockModalOpen(true);
  };

  const handleSaveStock = (data) => {
    onAdjustStock(data);
    setStockModalOpen(false);
  };

  return (
    <div>
      <div className="card-section">
        <div className="toolbar-bar">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Filter Stock:</span>
            <button
              className={`btn btn-sm ${filterMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterMode('all')}
            >
              All Products
            </button>
            <button
              className="btn btn-sm btn-warning"
              style={{
                background: filterMode === 'low' ? 'var(--warning)' : '#fffbeb',
                color: filterMode === 'low' ? '#ffffff' : '#b45309',
                border: '1px solid #fde68a'
              }}
              onClick={() => setFilterMode('low')}
            >
              <i className="fa-solid fa-triangle-exclamation"></i> Low Stock Only (&le; 10)
            </button>
          </div>
          <div className="card-actions">
            <button className="btn btn-success" onClick={() => handleOpenModal('STOCK_IN')}>
              <i className="fa-solid fa-circle-plus"></i> Add Stock (Stock In)
            </button>
            <button className="btn btn-secondary" onClick={() => handleOpenModal('ADJUSTMENT')}>
              <i className="fa-solid fa-sliders"></i> Adjust Stock
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Available Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Quick Restock</th>
              </tr>
            </thead>
            <tbody>
              {displayProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8' }}>
                    {filterMode === 'low' ? 'No products currently below low stock threshold.' : 'No products found.'}
                  </td>
                </tr>
              ) : (
                displayProducts.map(p => {
                  let status = <span className="badge badge-in-stock"><i className="fa-solid fa-check"></i> Sufficient</span>;
                  if (p.quantity <= 0) {
                    status = <span className="badge badge-out-of-stock"><i className="fa-solid fa-ban"></i> Out of Stock</span>;
                  } else if (p.quantity <= p.lowStockThreshold) {
                    status = <span className="badge badge-low-stock"><i className="fa-solid fa-triangle-exclamation"></i> Low ({p.quantity})</span>;
                  }

                  return (
                    <tr key={p._id}>
                      <td><strong>{p.productCode}</strong></td>
                      <td><strong>{p.name}</strong></td>
                      <td><span className="badge badge-blue">{p.category?.name || 'Unassigned'}</span></td>
                      <td>
                        <strong style={{
                          fontSize: 15,
                          color: p.quantity <= p.lowStockThreshold ? 'var(--danger)' : 'var(--text-primary)'
                        }}>
                          {p.quantity} units
                        </strong>
                      </td>
                      <td>{p.lowStockThreshold} units</td>
                      <td>{status}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleOpenModal('STOCK_IN', p._id)}
                        >
                          <i className="fa-solid fa-plus"></i> Restock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement Audit Log */}
      <div className="card-section">
        <div className="card-header">
          <h3><i className="fa-solid fa-clock-rotate-left"></i> Stock Movement Audit Log</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Product</th>
                <th>Movement Type</th>
                <th>Quantity Changed</th>
                <th>Previous Qty</th>
                <th>New Qty</th>
                <th>Reference / Reason</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8' }}>
                    No stock transaction history recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map(tx => {
                  const badge = tx.transactionType === 'STOCK_IN' ? 'badge-in-stock' :
                                tx.transactionType === 'SALE' ? 'badge-purple' : 'badge-low-stock';
                  const sign = tx.transactionType === 'STOCK_IN' ? '+' : '-';
                  return (
                    <tr key={tx._id}>
                      <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                      <td><strong>{tx.product?.name || '-'}</strong></td>
                      <td><span className={`badge ${badge}`}>{tx.transactionType}</span></td>
                      <td><strong>{sign}{tx.quantity}</strong></td>
                      <td>{tx.previousQuantity}</td>
                      <td><strong>{tx.newQuantity}</strong></td>
                      <td>{tx.referenceNote || '-'}</td>
                      <td>{tx.supplier?.name || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StockModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        onSave={handleSaveStock}
        products={products}
        suppliers={suppliers}
        defaultType={modalType}
        preselectedProductId={preselectedProdId}
      />
    </div>
  );
};

export default StockControl;
