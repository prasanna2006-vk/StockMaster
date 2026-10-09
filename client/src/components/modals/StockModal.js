import React, { useState, useEffect } from 'react';

const StockModal = ({ isOpen, onClose, onSave, products, suppliers, defaultType = 'STOCK_IN', preselectedProductId = '' }) => {
  const [formData, setFormData] = useState({
    productId: '',
    transactionType: defaultType,
    quantity: '',
    supplierId: '',
    referenceNote: ''
  });

  useEffect(() => {
    setFormData({
      productId: preselectedProductId || '',
      transactionType: defaultType,
      quantity: '',
      supplierId: '',
      referenceNote: ''
    });
  }, [defaultType, preselectedProductId, isOpen]);

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p._id === formData.productId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      quantity: parseInt(formData.quantity, 10),
      supplierId: formData.supplierId || undefined
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>{formData.transactionType === 'STOCK_IN' ? 'Add Stock (Stock In)' : 'Stock Count Adjustment'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Select Product <span className="required">*</span></label>
              <select
                className="form-select"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
              >
                <option value="">-- Choose Product --</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.productCode} - {p.name} ({p.quantity} in stock)
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Current Stock: <strong>{selectedProduct.quantity} units</strong> (Min: {selectedProduct.lowStockThreshold})
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Movement Type <span className="required">*</span></label>
              <select
                className="form-select"
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                required
              >
                <option value="STOCK_IN">Stock In (Inbound Delivery / Restock)</option>
                <option value="STOCK_OUT">Stock Out (Damaged / Removal)</option>
                <option value="ADJUSTMENT">Direct Count Adjustment</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Quantity <span className="required">*</span></label>
              <input
                type="number"
                min="1"
                className="form-input"
                placeholder="Number of units"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Supplier (Optional)</label>
              <select
                className="form-select"
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              >
                <option value="">Select Supplier</option>
                {suppliers.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reference / PO / Reason</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Shipment PO #9921"
                value={formData.referenceNote}
                onChange={(e) => setFormData({ ...formData, referenceNote: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success">Submit Stock</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockModal;
