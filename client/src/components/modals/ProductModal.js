import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, onSave, product, categories, suppliers }) => {
  const [formData, setFormData] = useState({
    productCode: '',
    name: '',
    categoryId: '',
    supplierId: '',
    price: '',
    costPrice: '',
    quantity: '',
    lowStockThreshold: 10,
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productCode: product.productCode || '',
        name: product.name || '',
        categoryId: product.category?._id || product.category || '',
        supplierId: product.supplier?._id || product.supplier || '',
        price: product.price ?? '',
        costPrice: product.costPrice ?? '',
        quantity: product.quantity ?? '',
        lowStockThreshold: product.lowStockThreshold ?? 10,
        description: product.description || ''
      });
    } else {
      setFormData({
        productCode: '',
        name: '',
        categoryId: '',
        supplierId: '',
        price: '',
        costPrice: '',
        quantity: '',
        lowStockThreshold: 10,
        description: ''
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
      quantity: parseInt(formData.quantity, 10),
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box modal-lg">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Product SKU / Code <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PRD-2001"
                  value={formData.productCode}
                  onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Supplier</label>
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
                <label className="form-label">Selling Price ($) <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cost / Purchase Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity <span className="required">*</span></label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Low-Stock Alert Level</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  required
                />
              </div>

              <div className="form-group form-full">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="Item specifications, model..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
