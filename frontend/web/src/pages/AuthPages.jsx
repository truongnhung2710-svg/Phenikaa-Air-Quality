import React, { useState } from 'react';

export default function AuthPages({ view, setView, setUserName, setUserPhone }) {
  // 1. KHAI BÁO STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. CÁC HÀM XỬ LÝ LÔ-GÍC
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, password }) 
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        setUserName(data.user?.name || 'Admin Phenikaa'); 
        setView('app'); 
      } else {
        setErrorMsg(data.message || 'Đăng nhập thất bại!');
      }
    } catch { 
      setErrorMsg('Lỗi máy chủ!'); 
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault(); 
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email) {
      setErrorMsg('Vui lòng nhập email!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/reset-password', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email }) 
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccessMsg('Vui lòng kiểm tra email để nhận mật khẩu mới.');
        setTimeout(() => {
          setView('login');
          setSuccessMsg('');
        }, 3000);
      } else {
        setErrorMsg(data.message || 'Không thể gửi yêu cầu!');
      }
    } catch { 
      setErrorMsg('Lỗi máy chủ!'); 
    } finally {
      setLoading(false);
    }
  };

  // 3. PHẦN RENDER GIAO DIỆN CHÍNH
  return (
    <div className="view active login-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: view === 'login' ? 'flex-end' : 'center', paddingRight: view === 'login' ? '8%' : '0', minHeight: '100vh', width: '100vw', backgroundImage: `url('/assets/phenikaa-bg.png')`, backgroundSize: 'cover' }}>
      <div className="glass-panel login-box" style={{ padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '420px', background: 'rgba(15, 23, 42, 0.65)' }}>
        
        {/* --- KHỐI 1: GIAO DIỆN ĐĂNG NHẬP --- */}
        {view === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>Phenikaa CO System</h2>
            {errorMsg && <div style={{ color: '#ef4444' }}>{errorMsg}</div>}
            
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{width: '100%', padding: '0.8rem', marginBottom:'1rem'}} required/>
            
            <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} style={{width: '100%', padding: '0.8rem', marginBottom:'0.5rem'}} required/>
            
            <div style={{ width: '100%', textAlign: 'right', marginBottom: '1.5rem' }}>
              <span 
                onClick={() => { setView('forgot_password'); setErrorMsg(''); setSuccessMsg(''); }} 
                style={{ color: '#60a5fa', cursor: 'pointer', fontSize: '14px' }}
              >
                Quên mật khẩu?
              </span>
            </div>

            <button type="submit" className="btn" style={{ width: '100%', background: '#2563eb', padding: '12px', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Đăng nhập</button>
            <p style={{marginTop:'1rem', color:'#fff'}}>Chưa có tài khoản? <span onClick={() => setView('register')} style={{color:'#60a5fa', cursor:'pointer'}}>Đăng ký</span></p>
          </form>
        )}

        {/* --- KHỐI 2: GIAO DIỆN QUÊN MẬT KHẨU --- */}
        {view === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #f59e0b, #d97706)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', color: '#fff' }}>🔑</span>
            </div>

            <h2 style={{ color: 'white', marginBottom: '8px' }}>Khôi Phục Mật Khẩu</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>
              Nhập email của bạn, hệ thống sẽ gửi mật khẩu mới.
            </p>

            {errorMsg && <div style={{ color: '#ef4444', marginBottom: '12px' }}>{errorMsg}</div>}
            {successMsg && <div style={{ color: '#10b981', marginBottom: '12px', textAlign: 'center' }}>{successMsg}</div>}

            <input 
              type="email" 
              placeholder="email@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '0.8rem', marginBottom: '1.5rem', borderRadius: '8px', border: 'none' }} 
              required
            />

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', background: '#d97706', padding: '12px', border: 'none', color: 'white', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>

            <span 
              onClick={() => { setView('login'); setErrorMsg(''); setSuccessMsg(''); }} 
              style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '14px', marginTop: '20px' }}
            >
              Quay lại đăng nhập
            </span>
          </form>
        )}

      </div>
    </div>
  );
}