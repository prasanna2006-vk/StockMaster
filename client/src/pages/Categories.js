import React, { useState } from 'react';
import CategoryModal from '../components/modals/CategoryModal';

const Categories = ({ categories, categoryCounts, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCategory(c);
    setModalOpen(true);
  };

  const handleSave = (data) => {
    if (editingCategory) {
      onUpdateCategory(editingCategory._id, data);
    } else {
      onAddCategory(data);
    }
    setModalOpen(false);
  };

  return (
    <div className="card-section">
      <div className="toolbar-bar">
        <div style={{ fontWeight: 600, fontSize: 15 }}>Product Categories</div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="fa-solid fa-plus"></i> Add Category
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Linked Products</th>
              <th>Created Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>
                  No categories found. Click "+ Add Category" to create one.
                </td>
              </tr>
            ) : (
              categories.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.description || '-'}</td>
                  <td>
                    <span className="badge badge-blue">
                      {categoryCounts[c._id] || 0} Products
                    </span>
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-icon btn-action-edit"
                        title="Edit"
                        onClick={() => handleOpenEdit(c)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn btn-icon btn-action-delete"
                        title="Delete"
                        onClick={() => onDeleteCategory(c._id, c.name)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={editingCategory}
      />
    </div>
  );
};

export default Categories;
