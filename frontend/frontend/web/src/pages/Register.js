export default function Register({ onBackToLogin }) {
  
  const handleRegister = () => {
    // TODO: gọi API register
    onBackToLogin(); 
  };

  return (
    // Bọc thêm 1 lớp nền bên ngoài nếu component này đứng độc lập
    <div className="view active login-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      
      <div className="glass-panel login-box" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px', width: '100%', maxWidth: '400px' }}>
        
        <h2 style={{ color: '#fff', textAlign: 'center', margin: '0' }}>ĐĂNG KÝ</h2>
        
        <input 
          type="text" 
          placeholder="Email" 
          style={{ padding: '12px', borderRadius: '8px', border: 'none', outline: 'none' }} 
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          style={{ padding: '12px', borderRadius: '8px', border: 'none', outline: 'none' }} 
        />
        
        <button 
          onClick={handleRegister}
          style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Xác nhận Đăng ký
        </button>
        
        <button 
          onClick={onBackToLogin}
          style={{ padding: '12px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '8px', cursor: 'pointer' }}
        >
          Quay lại đăng nhập
        </button>

      </div>
    </div>
  );
}