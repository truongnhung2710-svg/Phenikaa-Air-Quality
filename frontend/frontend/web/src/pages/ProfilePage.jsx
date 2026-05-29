import React, { useState } from 'react';

export default function ProfilePage({ userName, setUserName, userPhone, setUserPhone, email }) {
  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone || '');
  const [infoMsg, setInfoMsg] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const token = localStorage.getItem('token');

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/user/update', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email, name: editName, phone: editPhone }) 
      });
      if (response.ok) { setInfoMsg('Cập nhật thông tin thành công!'); setUserName(editName); setUserPhone(editPhone); }
    } catch { setInfoMsg('Lỗi cập nhật!'); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setPassMsg('Mật khẩu xác nhận không khớp!');
    try {
      const response = await fetch('http://localhost:5001/api/user/change-password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email, oldPassword, newPassword })
      });
      if (response.ok) { setPassMsg('Đổi mật khẩu thành công!'); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }
    } catch { setPassMsg('Lỗi đổi mật khẩu!'); }
  };

  return (
    <div className="page active">
      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Thông Tin Cá Nhân</h3>
          {infoMsg && <p style={{ color: '#10b981', fontWeight: 'bold' }}>{infoMsg}</p>}
          <form onSubmit={handleUpdateInfo}>
            <div className="input-group"><label>Email</label><input type="email" value={email || ''} disabled /></div>
            <div className="input-group"><label>Họ Tên</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} /></div>
            <div className="input-group"><label>SĐT</label><input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} /></div>
            <button type="submit" className="btn">Lưu thay đổi</button>
          </form>
        </div>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Đổi Mật Khẩu</h3>
          {passMsg && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{passMsg}</p>}
          <form onSubmit={handleChangePassword}>
            <div className="input-group"><label>Mật khẩu cũ</label><input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} /></div>
            <div className="input-group"><label>Mật khẩu mới</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></div>
            <div className="input-group"><label>Xác nhận MK</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></div>
            <button type="submit" className="btn" style={{ background: '#f59e0b' }}>Đổi mật khẩu</button>
          </form>
        </div>
      </div>
    </div>
  );
}