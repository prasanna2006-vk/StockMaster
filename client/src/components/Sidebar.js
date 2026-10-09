import React from 'react';

const Sidebar = ({ currentTab, setTab, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie', section: 'Core Management' },
    { id: 'products', label: 'Products', icon: 'fa-solid fa-box' },
    { id: 'stock', label: 'Stock Control', icon: 'fa-solid fa-arrow-right-arrow-left' },
    { id: 'categories', label: 'Categories', icon: 'fa-solid fa-tags' },
    { id: 'suppliers', label: 'Suppliers', icon: 'fa-solid fa-truck' },
    { id: 'sales', label: 'Sales & Billing', icon: 'fa-solid fa-cart-shopping', section: 'Transactions & Reports' },
    { id: 'reports', label: 'Reports', icon: 'fa-solid fa-file-invoice' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand-icon">
          <i className="fa-solid fa-boxes-stacked"></i>
        </div>
        <div className="sidebar-brand-text">
          <h2>StockMaster</h2>
          <p>MERN Inventory</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {item.section && <span className="nav-label">{item.section}</span>}
            <div
              className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </div>
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {(user?.username || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.fullName || user?.username || 'Admin'}</div>
            <div className="user-role">{user?.role || 'Administrator'}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout} title="Sign out">
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
