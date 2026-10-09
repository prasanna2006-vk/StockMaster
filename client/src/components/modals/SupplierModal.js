import React, { useState, useEffect } from 'react';

const SupplierModal = ({ isOpen, onClose, onSave, supplier }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contactPerson: supplier.contactPerson || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || ''
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: ''
      });
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>{supplier ? 'Edit Supplier' : 'Add Supplier'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Company / Supplier Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Apex Global Distributors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>
            <div className="form-grid" style={{ marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+1-555-0100"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="contact@supplier.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Physical Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="Street address, City, State"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Supplier</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;
