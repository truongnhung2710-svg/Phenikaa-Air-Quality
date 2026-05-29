import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
}