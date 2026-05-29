import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import ContentArea from '../components/ContentArea';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-area">
        <TopHeader />
        <ContentArea />
      </div>
      {/* HIỂN THỊ TOAST CẢNH BÁO NỔI NẾU CÓ TRẠM VƯỢT NGƯỠNG */}
      {warningsCount > 0 && (
        <div className="alert-toast">
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>Phát hiện rò rỉ khí CO! Vui lòng kiểm tra ngay!</span>
        </div>
      )}
    </div>
  );
}