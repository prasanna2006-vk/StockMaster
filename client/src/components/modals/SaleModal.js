import React, { useState, useEffect } from 'react';

const SaleModal = ({ isOpen, onClose, onSave, products }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    unitPrice: '',
    customerName: '',
    customerPhone: '',
    paymentMethod: 'Cash',
    notes: ''
  });

  useEffect(() => {
    setFormData({
      productId: '',
      quantity: 1,
      unitPrice: '',
      customerName: '',
      customerPhone: '',
      paymentMethod: 'Cash',
      notes: ''
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p._id === formData.productId);

  const handleProductChange = (prodId) => {
    const prod = products.find(p => p._id === prodId);
    setFormData({
      ...formData,
      productId: prodId,
      unitPrice: prod ? prod.price : ''
    });
  };

  const qty = parseInt(formData.quantity, 10) || 0;
  const price = parseFloat(formData.unitPrice) || 0;
  const total = (qty * price).toFixed(2);

  const isOutOfStock = selectedProduct && selectedProduct.quantity <= 0;
  const isExcessive = selectedProduct && qty > selectedProduct.quantity;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOutOfStock || isExcessive) return;
    onSave({
      ...formData,
      quantity: qty,
      unitPrice: price
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3><i className="fa-solid fa-cart-shopping" style={{ color: 'var(--primary)', marginRight: 8 }}></i> Record New Sale</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Select Product to Sell <span className="required">*</span></label>
              <select
                className="form-select"
                value={formData.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                required
              >
                <option value="">-- Choose Product --</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.productCode} - {p.name} ({p.quantity} available)
                  </option>
                ))}
              </select>

              {selectedProduct && (
                <div style={{ marginTop: 6, fontSize: 13, fontWeight: 500 }}>
                  {isOutOfStock ? (
                    <span style={{ color: 'var(--danger)' }}>
                      <i className="fa-solid fa-circle-xmark"></i> OUT OF STOCK! Sales are disabled for this product.
                    </span>
                  ) : isExcessive ? (
                    <span style={{ color: 'var(--danger)' }}>
                      <i className="fa-solid fa-triangle-exclamation"></i> Requested quantity ({qty}) exceeds available stock ({selectedProduct.quantity})!
                    </span>
                  ) : (
                    <span style={{ color: 'var(--success)' }}>
                      <i className="fa-solid fa-boxes-stacked"></i> Available Stock: <strong>{selectedProduct.quantity} units</strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="form-grid" style={{ marginBottom: 14 }}>
              <div className="form-group">
                <label className="form-label">Quantity <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit Price ($) <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 14,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Calculated Total:</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>${total}</span>
            </div>

            <div className="form-grid" style={{ marginBottom: 14 }}>
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Walk-in Customer"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Customer Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+1-555-0000"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="UPI">UPI / Digital Payment</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Memo</label>
              <input
                type="text"
                className="form-input"
                placeholder="Warranty, customer remarks..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isOutOfStock || isExcessive || !formData.productId}
            >
              <i className="fa-solid fa-check"></i> Complete Sale & Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleModal;
