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
    </div>
  );
}