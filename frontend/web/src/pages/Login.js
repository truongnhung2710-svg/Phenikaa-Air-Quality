import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; 

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: gọi API login
    navigate('/'); // chuyển tới Dashboard nếu login thành công
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <div style={{ textAlign: 'right', marginBottom: '15px', width: '100%' }}>
        <Link to="/forgot-password" style={{ color: '#3b82f6', fontSize: '14px', textDecoration: 'none' }}>
          Quên mật khẩu?
        </Link>
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
    
  );
}