import React, { useState } from 'react';
import './App.css'; 

import AuthPages from './pages/AuthPages';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import ManagementPage from './pages/ManagementPage'; 

const CO_WARNING_LEVEL = 30;

export default function App() {
  const [view, setView] = useState('login'); 
  const [activePage, setActivePage] = useState('dashboard'); 
  const [userName, setUserName] = useState('Admin Phenikaa');
  const [userPhone, setUserPhone] = useState('');
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme; 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setView('login');
  };

  if (view !== 'app') {
    return <AuthPages view={view} setView={setView} setUserName={setUserName} setUserPhone={setUserPhone} />;
  }

  return (
    <div id="app-container" className={theme}>
      <div id="main-app" className="view active">
        
        <aside className="sidebar">
          <div className="sidebar-header"><i className="fa-solid fa-wind"></i><h3>HỆ THỐNG CO</h3></div>
          <div className="nav-links">
            <div className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}><i className="fa-solid fa-house"></i> Trang Chủ</div>
            <div className={`nav-item ${activePage === 'management' ? 'active' : ''}`} onClick={() => setActivePage('management')}><i className="fa-solid fa-server"></i> Quản Lý</div>
            <div className={`nav-item ${activePage === 'history' ? 'active' : ''}`} onClick={() => setActivePage('history')}><i className="fa-solid fa-clock-rotate-left"></i> Lịch Sử</div>
            <div className={`nav-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => setActivePage('profile')}><i className="fa-solid fa-user-gear"></i> Hồ Sơ</div>
          </div>
          <div className="sidebar-footer">
            <button className="btn" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Đăng xuất</button>
          </div>
        </aside>

        <main className="main-content" style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
          <header className="top-header">
            <h2>{activePage.toUpperCase()}</h2>
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button className="theme-toggle-btn" onClick={toggleTheme}><i className={theme === 'dark' ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i></button>
              <span>{userName}</span>
              <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </header>

          <div className="content-area">
            {activePage === 'dashboard' && <DashboardPage theme={theme} CO_WARNING_LEVEL={CO_WARNING_LEVEL} />}
            {activePage === 'history' && <HistoryPage THRESHOLD={CO_WARNING_LEVEL} />}
            {activePage === 'profile' && <ProfilePage userName={userName} setUserName={setUserName} />}
            {activePage === 'management' && <ManagementPage CO_WARNING_LEVEL={CO_WARNING_LEVEL} />}
          </div>
        </main>

      </div>
    </div>
  );
}