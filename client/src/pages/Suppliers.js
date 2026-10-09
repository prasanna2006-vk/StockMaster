import React, { useState } from 'react';
import SupplierModal from '../components/modals/SupplierModal';

const Suppliers = ({ suppliers, onAddSupplier, onUpdateSupplier, onDeleteSupplier }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const filteredSuppliers = suppliers.filter(s => {
    return !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSupplier(s);
    setModalOpen(true);
  };

  const handleSave = (data) => {
    if (editingSupplier) {
      onUpdateSupplier(editingSupplier._id, data);
    } else {
      onAddSupplier(data);
    }
    setModalOpen(false);
  };

  return (
    <div className="card-section">
      <div className="toolbar-bar">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="fa-solid fa-plus"></i> Add Supplier
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Supplier / Company</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>
                  No suppliers found. Click "+ Add Supplier" to add vendor details.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.contactPerson || '-'}</td>
                  <td>
                    <i className="fa-solid fa-phone" style={{ color: '#94a3b8', fontSize: 11, marginRight: 4 }}></i>
                    {s.phone || '-'}
                  </td>
                  <td>
                    <i className="fa-solid fa-envelope" style={{ color: '#94a3b8', fontSize: 11, marginRight: 4 }}></i>
                    {s.email || '-'}
                  </td>
                  <td>{s.address || '-'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-icon btn-action-edit"
                        title="Edit"
                        onClick={() => handleOpenEdit(s)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn btn-icon btn-action-delete"
                        title="Delete"
                        onClick={() => onDeleteSupplier(s._id, s.name)}
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

      <SupplierModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        supplier={editingSupplier}
      />
    </div>
  );
};

export default Suppliers;
