import React, { useState } from 'react';
import { api } from '../services/api';

const Login = ({ onLoginSuccess, showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ username, password });
      if (res.success && res.data) {
        showToast(res.message, 'success');
        onLoginSuccess(res.data);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-icon">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>StockMaster</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            MERN Inventory Management System
          </p>
        </div>

        <div className="demo-pill">
          <div>
            <strong><i className="fa-solid fa-key"></i> Demo Credentials:</strong><br />
            <span>admin / admin123</span>
          </div>
          <button type="button" className="btn-quick-fill" onClick={handleQuickFill}>
            Quick Fill
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '10px 14px',
            borderRadius: 6,
            fontSize: 13,
            marginBottom: 16
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 6 }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Username <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-user" style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8', fontSize: 14 }}></i>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 36 }}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Password <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-lock" style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8', fontSize: 14 }}></i>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 36 }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: 12, fontSize: 14 }}
            disabled={loading}
          >
            {loading ? (
              <span><i className="fa-solid fa-spinner fa-spin"></i> Authenticating...</span>
            ) : (
              <span><i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94a3b8' }}>
          College Project Demonstration &bull; MongoDB &bull; Express &bull; React &bull; Node.js
        </div>
      </div>
    </div>
  );
};

export default Login;
