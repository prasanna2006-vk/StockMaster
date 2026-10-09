import React, { useState, useEffect } from 'react';

const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name || '', description: category.description || '' });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>{category ? 'Edit Category' : 'Add Category'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Category Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Networking Gear"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Description or scope..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
