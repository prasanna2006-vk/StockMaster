import React from 'react';

const Toast = ({ toasts }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => {
        const icon = t.type === 'success' ? 'fa-circle-check' :
                     t.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';
        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <i className={`fa-solid ${icon} toast-icon`}></i>
            <span className="toast-message">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
