import { useNavigate } from 'react-router-dom';
import './Login.css'; // nếu muốn style riêng

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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}