import React, { useState } from 'react';
import SaleModal from '../components/modals/SaleModal';
import InvoiceModal from '../components/modals/InvoiceModal';

const Sales = ({ sales, products, user, onRecordSale }) => {
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  const handleOpenNewSale = () => {
    setSaleModalOpen(true);
  };

  const handleSaveSale = async (data) => {
    const saved = await onRecordSale(data);
    setSaleModalOpen(false);
    if (saved) {
      setCurrentSale(saved);
      setInvoiceModalOpen(true);
    }
  };

  const handleViewInvoice = (sale) => {
    setCurrentSale(sale);
    setInvoiceModalOpen(true);
  };

  return (
    <div className="card-section">
      <div className="toolbar-bar">
        <div style={{ fontWeight: 600, fontSize: 15 }}>Sales History & Billing Invoices</div>
        <button className="btn btn-primary" onClick={handleOpenNewSale}>
          <i className="fa-solid fa-cart-plus"></i> Record New Sale
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date & Time</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Amount</th>
              <th>Customer</th>
              <th>Payment</th>
              <th style={{ textAlign: 'right' }}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: '#94a3b8' }}>
                  No sales recorded yet. Click "+ Record New Sale" to create an invoice.
                </td>
              </tr>
            ) : (
              sales.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.invoiceNumber}</strong></td>
                  <td>{new Date(s.saleDate).toLocaleString()}</td>
                  <td><strong>{s.product?.name || 'Product'}</strong></td>
                  <td><span className="badge badge-purple">{s.quantity} pcs</span></td>
                  <td>${Number(s.unitPrice).toFixed(2)}</td>
                  <td>
                    <strong style={{ color: 'var(--primary)', fontSize: 14 }}>
                      ${Number(s.totalAmount).toFixed(2)}
                    </strong>
                  </td>
                  <td>{s.customerName || 'Walk-in'}</td>
                  <td><span className="badge badge-blue">{s.paymentMethod || 'Cash'}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-sm btn-action-view" onClick={() => handleViewInvoice(s)}>
                      <i className="fa-solid fa-receipt"></i> Invoice
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SaleModal
        isOpen={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        onSave={handleSaveSale}
        products={products}
      />

      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        sale={currentSale}
        user={user}
      />
    </div>
  );
};

export default Sales;
