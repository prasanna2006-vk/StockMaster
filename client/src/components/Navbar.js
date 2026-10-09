import React, { useState, useEffect } from 'react';

const Navbar = ({ currentTab, onOpenQuickSale }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const titles = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'Real-time metrics, stock levels, and revenue' },
    products: { title: 'Product Catalog', subtitle: 'Manage, search, and monitor all product inventory' },
    stock: { title: 'Stock Control', subtitle: 'Arrivals, manual count adjustments, and movement logs' },
    categories: { title: 'Category Management', subtitle: 'Group products into classification categories' },
    suppliers: { title: 'Supplier Directory', subtitle: 'Manage vendors, distributor phone numbers, and addresses' },
    sales: { title: 'Sales & Billing', subtitle: 'Point of sale transactions and official invoices' },
    reports: { title: 'Inventory & Sales Reports', subtitle: 'Valuations, low-stock reorder lists, and revenue summaries' }
  };

  const current = titles[currentTab] || titles.dashboard;

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="page-title-box">
          <h1>{current.title}</h1>
          <p>{current.subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-badge">
          <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i>
          <span>MERN System Online</span>
        </div>
        <div className="live-time">{time}</div>
        <button className="btn btn-primary btn-sm" onClick={onOpenQuickSale}>
          <i className="fa-solid fa-plus"></i> New Sale
        </button>
      </div>
    </header>
  );
};

export default Navbar;
