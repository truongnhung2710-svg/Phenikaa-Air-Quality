import React from 'react';

export default function StatCard({ icon, colorClass, title, value }) {
  return (
    <div className="stat-card glass-panel">
      <div className={`stat-icon ${colorClass}`}><i className={`fa-solid ${icon}`}></i></div>
      <div className="stat-info">
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
}