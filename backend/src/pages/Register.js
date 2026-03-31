import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    // TODO: gọi API register
    navigate('/login'); // sau khi đăng ký xong chuyển về login
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}