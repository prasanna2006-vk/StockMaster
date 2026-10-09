import React from 'react';

const InvoiceModal = ({ isOpen, onClose, sale, user }) => {
  if (!isOpen || !sale) return null;

  const dateStr = sale.saleDate ? new Date(sale.saleDate).toLocaleString() : new Date().toLocaleString();

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>Official Sales Invoice</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="invoice-card">
            <div className="invoice-header">
              <h2>StockMaster Inventory Store</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>MERN College Project Demonstration &bull; Tax Invoice</p>
            </div>
            <div className="invoice-details-grid">
              <div><strong>Invoice No:</strong> {sale.invoiceNumber}</div>
              <div><strong>Date & Time:</strong> {dateStr}</div>
              <div><strong>Customer Name:</strong> {sale.customerName || 'Walk-in'}</div>
              <div><strong>Phone:</strong> {sale.customerPhone || 'N/A'}</div>
              <div><strong>Payment Method:</strong> {sale.paymentMethod || 'Cash'}</div>
              <div><strong>Cashier:</strong> {user?.username || 'Admin'}</div>
            </div>
            <table className="data-table" style={{ marginTop: 12, border: '1px solid var(--border-color)' }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{sale.product?.name || 'Product'}</strong><br />
                    <small style={{ color: 'var(--text-muted)' }}>{sale.product?.productCode}</small>
                  </td>
                  <td>{sale.quantity}</td>
                  <td>${Number(sale.unitPrice).toFixed(2)}</td>
                  <td><strong>${Number(sale.totalAmount).toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
            <div className="invoice-total-row">
              <span>Total Amount Paid:</span>
              <span>${Number(sale.totalAmount).toFixed(2)}</span>
            </div>
            {sale.notes && (
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                <em>Notes: {sale.notes}</em>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <i className="fa-solid fa-print"></i> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
