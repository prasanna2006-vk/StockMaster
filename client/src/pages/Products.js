import React, { useState } from 'react';
import ProductModal from '../components/modals/ProductModal';

const Products = ({ products, categories, suppliers, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory ||
      (p.category?._id === selectedCategory || p.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleSave = (data) => {
    if (editingProduct) {
      onUpdateProduct(editingProduct._id, data);
    } else {
      onAddProduct(data);
    }
    setModalOpen(false);
  };

  return (
    <div className="card-section">
      <div className="toolbar-bar">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="fa-solid fa-plus"></i> Add Product
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Selling Price</th>
              <th>Cost Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: '#94a3b8' }}>
                  No matching products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => {
                let statusBadge = <span className="badge badge-in-stock">In Stock</span>;
                if (p.quantity <= 0) {
                  statusBadge = <span className="badge badge-out-of-stock">Out of Stock</span>;
                } else if (p.quantity <= p.lowStockThreshold) {
                  statusBadge = <span className="badge badge-low-stock">Low Stock ({p.quantity})</span>;
                }

                return (
                  <tr key={p._id}>
                    <td><strong>{p.productCode}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                      <small style={{ color: 'var(--text-muted)' }}>{p.description || ''}</small>
                    </td>
                    <td><span className="badge badge-blue">{p.category?.name || 'Unassigned'}</span></td>
                    <td>{p.supplier?.name || '-'}</td>
                    <td><strong>${Number(p.price).toFixed(2)}</strong></td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {p.costPrice ? `$${Number(p.costPrice).toFixed(2)}` : '-'}
                    </td>
                    <td><strong style={{ fontSize: 14 }}>{p.quantity}</strong></td>
                    <td>{statusBadge}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-icon btn-action-edit"
                          title="Edit"
                          onClick={() => handleOpenEdit(p)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="btn btn-icon btn-action-delete"
                          title="Delete"
                          onClick={() => onDeleteProduct(p._id, p.name)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
        categories={categories}
        suppliers={suppliers}
      />
    </div>
  );
};

export default Products;
