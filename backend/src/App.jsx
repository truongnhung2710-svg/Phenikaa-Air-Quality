import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './App.css'; 

// Đăng ký Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const THRESHOLD = 50; // Ngưỡng cảnh báo khí CO

export default function App() {
  const [view, setView] = useState('login'); 
  const [activePage, setActivePage] = useState('dashboard'); 

  const [errorMsg, setErrorMsg] = useState('');
  const [userName, setUserName] = useState('Admin Phenikaa');
  const [userPhone, setUserPhone] = useState('');

  // State cho Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- QUẢN LÝ STATE REAL-TIME DỮ LIỆU ---
  const [timeLabels, setTimeLabels] = useState([]);
  const [st1Data, setSt1Data] = useState([]);
  const [st2Data, setSt2Data] = useState([]);
  const [liveTable, setLiveTable] = useState([]);

  // --- STATE CHO ĐĂNG KÝ ---
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // --- QUẢN LÝ STATE BỘ LỌC CHO QUẢN LÝ TRẠM ---
  const [filterStation, setFilterStation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [appliedFilters, setAppliedFilters] = useState({ station: 'all', status: 'all' });



  // --- VÒNG LẶP KÉO DỮ LIỆU THẬT TỪ BACKEND (INFLUXDB) ---
  useEffect(() => {
    if (view !== 'app') return;

    const fetchRealtimeData = async () => {
      try {
        // Gọi API lấy dữ liệu mới nhất từ InfluxDB (Thông qua Node.js của bạn)
        const response = await fetch('http://192.168.234.129:5000/api/readings/history');
        if (!response.ok) return;
        const data = await response.json();

        // data trả về đang sắp xếp mới nhất ở trên cùng. 
        // Ta lấy khoảng 30 bản ghi mới nhất và đảo ngược lại để vẽ biểu đồ từ trái qua phải
        const recentData = data.slice(0, 30).reverse();

        // 1. Dùng object để gom nhóm dữ liệu của 2 trạm theo đúng từng giây
        const timeMap = {};

        recentData.forEach(row => {
          // Lưới lọc Regex: Bắt chính xác chuỗi định dạng HH:MM:SS
          const timeMatch = row.time.match(/\d{1,2}:\d{2}:\d{2}/);
          const timeStr = timeMatch ? timeMatch[0] : row.time; // Ví dụ: 14:30:15
          
          if (!timeMap[timeStr]) {
            timeMap[timeStr] = { st1: null, st2: null };
          }

          // Phân loại nhét vào đúng trạm (Trạm 1 hoặc Trạm 2)
          if (row.station == '1') {
            timeMap[timeStr].st1 = row.value;
          } else if (row.station == '2') {
            timeMap[timeStr].st2 = row.value;
          }
        });

        // 2. Tách ra thành các mảng song song để đưa cho Biểu đồ vẽ
        const newLabels = Object.keys(timeMap).slice(-15); // Lấy 15 mốc giờ gần nhất
        const newSt1 = newLabels.map(t => timeMap[t].st1);
        const newSt2 = newLabels.map(t => timeMap[t].st2);

        // 3. Xử lý dữ liệu cho bảng phía dưới
        const newTable = recentData.map(row => ({
          station: row.station,
          time: row.time.match(/\d{1,2}:\d{2}:\d{2}/)?.[0] || row.time,
          value: row.value,
          status: row.isWarning ? 'warning' : 'normal'
        })).reverse();

        // 4. Cập nhật lên Giao diện
        setTimeLabels(newLabels);
        setSt1Data(newSt1);
        setSt2Data(newSt2);
        setLiveTable(newTable.slice(0, 20));

        // Cập nhật lên Giao diện
        setTimeLabels(newLabels.slice(-15)); // Giữ 15 mốc thời gian gần nhất
        setSt1Data(newSt1.slice(-15));
        setSt2Data(newSt2.slice(-15));
        setLiveTable(newTable.slice(0, 20)); // Bảng giữ 20 dòng mới nhất

      } catch (err) {
        console.error("Lỗi kéo dữ liệu realtime:", err);
      }
    };

    // 1. Gọi ngay lập tức lần đầu tiên khi vừa mở Dashboard
    fetchRealtimeData();

    // 2. Thiết lập vòng lặp: Cứ đúng 30 giây lại tự động kéo dữ liệu mới 1 lần
    const interval = setInterval(fetchRealtimeData, 30000);

    // Dọn dẹp vòng lặp khi chuyển trang
    return () => clearInterval(interval);
  }, [view]);


  // --- XỬ LÝ AUTH ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(''); 
    try {
      const response = await fetch('http://192.168.234.129:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) 
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', email);
        }
        setUserName(data.user?.name || data.name || 'Admin Phenikaa'); 
        setUserPhone(data.user?.phone || data.phone || '');
        setView('app'); 
      } else {
        setErrorMsg(data.message || 'Đăng nhập thất bại, vui lòng thử lại!');
      }
    } catch (error) {
      setErrorMsg('Không thể kết nối đến máy chủ!');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch('http://192.168.234.129:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setRegName(''); setRegEmail(''); setRegPassword('');
        setView('login'); 
      } else {
        setErrorMsg(data.message || 'Đăng ký thất bại, vui lòng kiểm tra lại!');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến máy chủ!');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch('http://192.168.234.129:5000/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Thành công! Vui lòng kiểm tra email để nhận hướng dẫn đặt lại mật khẩu.');
        setView('login');
      } else {
        setErrorMsg(data.message || 'Lỗi: Không thể gửi yêu cầu đặt lại mật khẩu!');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối đến máy chủ!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setView('login');
    setEmail('');
    setPassword('');
  };

  const handleSearchLive = () => {
    setAppliedFilters({ station: filterStation, status: filterStatus });
  };

  const currentSt1 = st1Data[st1Data.length - 1] || 0;
  const currentSt2 = st2Data[st2Data.length - 1] || 0;
  const warningsCount = (currentSt1 >= THRESHOLD ? 1 : 0) + (currentSt2 >= THRESHOLD ? 1 : 0);

  const filteredLiveTable = liveTable.filter(row => {
    const matchStation = appliedFilters.station === 'all' || row.station.toString() === appliedFilters.station;
    const matchStatus = appliedFilters.status === 'all' || row.status === appliedFilters.status;
    return matchStation && matchStatus;
  });

  return (
    <div id="app-container">
      {/* --- LOGIN VIEW --- */}
      {view === 'login' && (
        <div id="login-view" className="view active">
          <div className="login-box glass-panel">
            <div className="logo-placeholder"><i className="fa-solid fa-wind"></i></div>
            <h2>Phenikaa CO System</h2>
            <form onSubmit={handleLogin}>
              {errorMsg && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{errorMsg}</div>}
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@phenikaa.edu.vn" required />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              
              <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setErrorMsg(''); setView('forgot-password'); }} style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>Quên mật khẩu?</a>
              </div>

              <button type="submit" className="btn"><i className="fa-solid fa-right-to-bracket"></i> Login</button>
              <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Chưa có tài khoản? </span>
                <a href="#" onClick={(e) => { e.preventDefault(); setErrorMsg(''); setView('register'); }} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Đăng ký ngay</a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REGISTER VIEW --- */}
      {view === 'register' && (
        <div id="register-view" className="view active">
          <div className="login-box glass-panel">
            <div className="logo-placeholder" style={{ background: 'linear-gradient(135deg, var(--success), #10b981)' }}><i className="fa-solid fa-user-plus"></i></div>
            <h2>Đăng Ký Tài Khoản</h2>
            <form onSubmit={handleRegister}>
              {errorMsg && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{errorMsg}</div>}
              <div className="input-group">
                <label>Họ và tên</label>
                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Mật khẩu</label>
                <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn" style={{ background: 'var(--success)', marginBottom: 0 }}>Đăng ký</button>
              <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setErrorMsg(''); setView('login'); }} style={{ color: 'var(--success)', textDecoration: 'none', fontWeight: 500 }}>Đăng nhập</a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FORGOT PASSWORD VIEW --- */}
      {view === 'forgot-password' && (
        <div id="forgot-password-view" className="view active">
          <div className="login-box glass-panel">
            <div className="logo-placeholder" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}><i className="fa-solid fa-key"></i></div>
            <h2>Khôi Phục Mật Khẩu</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Nhập email của bạn, hệ thống sẽ gửi mật khẩu mới.</p>
            <form onSubmit={handleForgotPassword}>
              {errorMsg && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{errorMsg}</div>}
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn" style={{ background: '#f59e0b', marginBottom: 0 }}>Gửi yêu cầu</button>
              <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setErrorMsg(''); setView('login'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Quay lại đăng nhập</a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MAIN APP VIEW --- */}
      {view === 'app' && (
        <div id="main-app" className="view active">
          <aside className="sidebar" id="sidebar">
            <div className="sidebar-header">
              <i className="fa-solid fa-wind"></i>
              <h3>Phần mềm quan trắc<br />Khí CO</h3>
            </div>
            <div className="nav-links">
              <div className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>
                <i className="fa-solid fa-house"></i> Trang Chủ
              </div>
              <div className={`nav-item ${activePage === 'management' ? 'active' : ''}`} onClick={() => setActivePage('management')}>
                <i className="fa-solid fa-server"></i> Quản Lý Trạm
              </div>
              <div className={`nav-item ${activePage === 'history' ? 'active' : ''}`} onClick={() => setActivePage('history')}>
                <i className="fa-solid fa-clock-rotate-left"></i> Lịch Sử Dữ Liệu
              </div>
              <div className={`nav-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => setActivePage('profile')}>
                <i className="fa-solid fa-user-gear"></i> Hồ Sơ Cá Nhân
              </div>
            </div>
            <div className="sidebar-footer">
              <button className="btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--panel-border)' }} onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
              </button>
            </div>
          </aside>

          <main className="main-content">
            <header className="top-header">
              <button className="mobile-toggle" id="mobile-toggle"><i className="fa-solid fa-bars"></i></button>
              <div style={{ flexGrow: 1 }}></div>
              <div className="user-profile">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{userName}</span>
                <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
              </div>
            </header>

            <div className="content-area">
              {activePage === 'dashboard' && (
                <div className="page active">
                  <div className="page-header"><h1>Tổng Quan Hệ Thống</h1></div>
                  <div className="stats-grid">
                    <StatCard icon="fa-tower-broadcast" colorClass="bg-blue" title="Tổng trạm" value="2" />
                    <StatCard icon="fa-check" colorClass="bg-green" title="Online" value="2" />
                    <StatCard icon="fa-power-off" colorClass="bg-gray" title="Offline" value="0" />
                    <StatCard icon="fa-triangle-exclamation" colorClass="bg-yellow" title="Cảnh báo" value={warningsCount} />
                  </div>
                  <div className="dashboard-content">
                    <div className="chart-container glass-panel">
                      <h3 style={{ marginBottom: '1rem' }}>Biểu đồ Realtime (2 Trạm)</h3>
                      <Line 
                        data={{
                          labels: timeLabels,
                          datasets: [
                            { label: 'Trạm 1 (ppm)', data: st1Data, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4, pointRadius: 3 },
                            { label: 'Trạm 2 (ppm)', data: st2Data, borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', fill: true, tension: 0.4, pointRadius: 3 }
                          ]
                        }}
                        options={{ responsive: true, maintainAspectRatio: false, animation: { duration: 0 }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } }, x: { grid: { display: false } } } }}
                      />
                    </div>
                    <div className="stations-list">
                      <StationCard name="TRẠM 1" value={currentSt1} isWarning={currentSt1 >= THRESHOLD} />
                      <StationCard name="TRẠM 2" value={currentSt2} isWarning={currentSt2 >= THRESHOLD} />
                    </div>
                  </div>
                </div>
              )}

              {activePage === 'management' && (
                <div className="page active">
                  <div className="page-header"><h1>Quản Lý Trạm / Giám Sát Trực Tuyến</h1></div>
                  <div className="filter-bar glass-panel">
                    <div className="filter-group">
                      <label>Chọn Trạm</label>
                      <select value={filterStation} onChange={e => setFilterStation(e.target.value)}>
                        <option value="all">Tất cả các trạm</option>
                        <option value="1">Trạm 1</option>
                        <option value="2">Trạm 2</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Trạng Thái</label>
                      <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="all">Tất cả</option>
                        <option value="normal">Bình thường</option>
                        <option value="warning">Cảnh báo</option>
                      </select>
                    </div>
                    <button className="btn" onClick={handleSearchLive}><i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm</button>
                  </div>
                  <div className="table-container glass-panel">
                    <table>
                      <thead><tr><th>Trạm</th><th>Thời Gian Cập Nhật</th><th>CO (ppm)</th><th>Trạng Thái</th></tr></thead>
                      <tbody>
                        {filteredLiveTable.length > 0 ? (
                          filteredLiveTable.map((row, idx) => (
                            <tr key={idx}>
                              <td><strong>Trạm {row.station}</strong></td>
                              <td>{row.time}</td>
                              <td style={{ fontWeight: 'bold', color: row.status === 'warning' ? 'var(--warning)' : 'inherit' }}>{row.value}</td>
                              <td>{row.status === 'warning' ? <span style={{color:'var(--warning)'}}><i className="fa-solid fa-triangle-exclamation"></i> Cảnh báo</span> : <span style={{color:'var(--success)'}}><i className="fa-solid fa-circle-check"></i> Bình thường</span>}</td>
                            </tr>
                          ))
                        ) : (<tr><td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activePage === 'history' && <HistoryPage THRESHOLD={THRESHOLD} />}

              {activePage === 'profile' && 
                <ProfilePage 
                  userName={userName} 
                  setUserName={setUserName} 
                  userPhone={userPhone}       
                  setUserPhone={setUserPhone}
                />
              }

            </div>
          </main>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function StatCard({ icon, colorClass, title, value }) {
  return (
    <div className="stat-card glass-panel">
      <div className={`stat-icon ${colorClass}`}><i className={`fa-solid ${icon}`}></i></div>
      <div className="stat-info"><h4>{title}</h4><p>{value}</p></div>
    </div>
  );
}

function StationCard({ name, value, isWarning }) {
  return (
    <div className={`station-card glass-panel ${isWarning ? 'warning-st' : 'active-st'}`}>
      <h3>{name} <span className={`status-badge ${isWarning ? 'warning' : ''}`}>{isWarning ? 'Cảnh báo mức CO' : 'Đang hoạt động'}</span></h3>
      <div className="co-value"><span>{value}</span> <span>ppm</span></div>
      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}><i className="fa-regular fa-clock"></i> Cập nhật: <span>Vừa xong</span></div>
    </div>
  );
}

function HistoryPage({ THRESHOLD }) {
  const today = new Date().toISOString().split('T')[0];
  const [filterStation, setFilterStation] = useState('all');
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState({ min: 0, max: 0, avg: 0 });

  const handleSearch = () => {
    let min = 999, max = 0, sum = 0;
    const newData = [];
    for(let i=0; i<15; i++) {
      let v = Math.floor(Math.random() * 60) + 5;
      min = Math.min(min, v); max = Math.max(max, v); sum += v;
      let st = filterStation === 'all' ? (Math.random() > 0.5 ? 1 : 2) : parseInt(filterStation);
      newData.push({ station: st, time: new Date(Date.now() - i*3600000).toLocaleString('vi-VN'), value: v, isWarning: v >= THRESHOLD });
    }
    setHistoryData(newData);
    setStats({ min: min === 999 ? 0 : min, max, avg: Math.round(sum/15) });
  };

  const exportToExcel = () => {
    if (historyData.length === 0) return alert("Không có dữ liệu để xuất!");
    const headers = ['Trạm', 'Thời Gian', 'CO (ppm)', 'Trạng Thái'];
    const rows = historyData.map(row => [`Trạm ${row.station}`, row.time, row.value, row.isWarning ? 'Cảnh báo' : 'Bình thường']);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const stationName = filterStation === 'all' ? 'Tat_Ca_Tram' : `Tram_${filterStation}`;
    link.setAttribute('download', `Du_Lieu_CO_${stationName}_${dateFrom}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => { handleSearch(); }, []);

  return (
    <div className="page active">
      <div className="page-header"><h1>Lịch Sử Dữ Liệu & Cảnh Báo</h1></div>
      <div className="filter-bar glass-panel">
        <div className="filter-group"><label>Chọn Trạm</label><select value={filterStation} onChange={e => setFilterStation(e.target.value)}><option value="all">Tất cả</option><option value="1">Trạm 1</option><option value="2">Trạm 2</option></select></div>
        <div className="filter-group"><label>Từ Ngày</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
        <div className="filter-group"><label>Đến Ngày</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn" onClick={handleSearch}><i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm</button>
          <button className="btn" style={{ background: 'var(--success)' }} onClick={exportToExcel}><i className="fa-solid fa-file-excel"></i> Xuất</button>
        </div>
      </div>
      <div className="summary-cards">
        <div className="summary-card glass-panel"><h4>Nhỏ Nhất (MIN)</h4><div className="val">{stats.min} ppm</div></div>
        <div className="summary-card glass-panel"><h4>Trung Bình (TB)</h4><div className="val" style={{color: 'var(--success)'}}>{stats.avg} ppm</div></div>
        <div className="summary-card glass-panel"><h4>Lớn Nhất (MAX)</h4><div className="val" style={{color: 'var(--danger)'}}>{stats.max} ppm</div></div>
      </div>
      <div className="table-container glass-panel">
        <table>
          <thead><tr><th>Trạm</th><th>Thời Gian</th><th>CO (ppm)</th><th>Trạng Thái</th></tr></thead>
          <tbody>
            {historyData.map((row, idx) => (
              <tr key={idx}>
                <td><strong>Trạm {row.station}</strong></td><td>{row.time}</td>
                <td style={{ fontWeight:'bold', color: row.isWarning ? 'var(--warning)':'inherit' }}>{row.value}</td>
                <td>{row.isWarning ? <span style={{color:'var(--warning)'}}><i className="fa-solid fa-triangle-exclamation"></i> Cảnh báo</span> : <span style={{color:'var(--success)'}}><i className="fa-solid fa-circle-check"></i> Bình thường</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfilePage({ userName, setUserName, userPhone, setUserPhone }) {
  // State cho Đổi Thông Tin
  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone || ''); // Bổ sung OR '' để không bị lỗi vàng uncontrolled
  const [infoMessage, setInfoMessage] = useState({ text: '', type: '' });

  // State cho Đổi Mật Khẩu
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState({ text: '', type: '' });

  const email = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setInfoMessage({ text: '', type: '' });
    try {
      const response = await fetch('http://192.168.234.129:5000/api/user/update', {
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ email: email, name: editName, phone: editPhone }) 
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setInfoMessage({ text: 'Cập nhật thông tin cá nhân thành công!', type: 'success' });
        setUserName(editName); 
        setUserPhone(editPhone);
      } else {
        setInfoMessage({ text: data.message || 'Cập nhật thất bại!', type: 'error' });
      }
    } catch (error) {
      setInfoMessage({ text: 'Lỗi kết nối máy chủ!', type: 'error' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMessage({ text: '', type: '' });
    if (newPassword !== confirmPassword) return setPassMessage({ text: 'Mật khẩu xác nhận không khớp!', type: 'error' });
    try {
      const response = await fetch('http://192.168.234.129:5000/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: email, oldPassword, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setPassMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
        setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        setPassMessage({ text: data.message || 'Đổi mật khẩu thất bại!', type: 'error' });
      }
    } catch (error) {
      setPassMessage({ text: 'Lỗi kết nối máy chủ!', type: 'error' });
    }
  };

  return (
    <div className="page active">
      <div className="page-header"><h1>Hồ Sơ Cá Nhân & Bảo Mật</h1></div>
      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.5rem' }}>
            <i className="fa-regular fa-id-card"></i> Thông Tin Cá Nhân
          </h3>
          {infoMessage.text && <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', color: infoMessage.type === 'success' ? 'var(--success)' : 'var(--danger)', border: `1px solid ${infoMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`}}>{infoMessage.text}</div>}
          
          <form onSubmit={handleUpdateInfo}>
            <div className="input-group">
              <label>Tài khoản Email</label>
              <input type="email" value={email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="input-group">
              <label>Họ và Tên hiển thị</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required />
            </div>
            
            <div className="input-group">
              <label>Số điện thoại</label>
              <input type="tel" value={editPhone || ''} onChange={e => setEditPhone(e.target.value)} placeholder="Nhập số điện thoại..." />
            </div>

            <button type="submit" className="btn" style={{ background: 'var(--primary)' }}>
              <i className="fa-solid fa-floppy-disk"></i> Lưu thay đổi
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.5rem' }}>
            <i className="fa-solid fa-lock"></i> Đổi Mật Khẩu
          </h3>
          {passMessage.text && <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', color: passMessage.type === 'success' ? 'var(--success)' : 'var(--danger)', border: `1px solid ${passMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`}}>{passMessage.text}</div>}
          <form onSubmit={handleChangePassword}>
            <div className="input-group"><label>Mật khẩu hiện tại</label><input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required placeholder="••••••••" /></div>
            <div className="input-group"><label>Mật khẩu mới</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="••••••••" /></div>
            <div className="input-group"><label>Xác nhận mật khẩu</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••" /></div>
            <button type="submit" className="btn" style={{ background: 'var(--warning)', color: '#000' }}><i className="fa-solid fa-key"></i> Đổi mật khẩu</button>
          </form>
        </div>
      </div>
    </div>
  );
}