import React from 'react';
import { Line } from 'react-chartjs-2';


import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

import StatCard from '../components/StatCard';
import StationCard from '../components/StationCard';
import { useRealtimeData } from '../hooks/useRealtimeData';

// KÍCH HOẠT ĐĂNG KÝ 
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function DashboardPage({ theme, CO_WARNING_LEVEL }) {
  const { timeLabels, st1Data, st2Data, liveTable, onlineCount, offlineCount, alertToast } = useRealtimeData(CO_WARNING_LEVEL);

  const currentSt1 = liveTable.find(row => String(row.station).includes('1'))?.value || 0;
  const currentSt2 = liveTable.find(row => String(row.station).includes('2'))?.value || 0;
  const warningsCount = (currentSt1 >= CO_WARNING_LEVEL ? 1 : 0) + (currentSt2 >= CO_WARNING_LEVEL ? 1 : 0);

 
  const chartData = {
    labels: [...(timeLabels || [])], 
    datasets: [
      { label: 'Trạm 1', data: [...(st1Data || [])], borderDash: [5, 5], borderColor: 'rgba(52, 211, 153, 0.8)', pointBackgroundColor: '#34d399', borderWidth: 2, tension: 0, spanGaps: true },
      { label: 'Trạm 2', data: [...(st2Data || [])], borderDash: [5, 5], borderColor: 'rgba(245, 158, 11, 0.8)', pointBackgroundColor: '#f59e0b', borderWidth: 2, tension: 0, spanGaps: true }
    ]
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 30, ticks: { color: theme === 'dark' ? '#94a3b8' : '#475569', callback: (v) => v + ' ppm' }, grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
      x: { ticks: { color: theme === 'dark' ? '#94a3b8' : '#475569' }, grid: { display: false } }
    },
    plugins: { legend: { labels: { color: theme === 'dark' ? '#f8fafc' : '#1e293b', usePointStyle: true } } }
  };

  return (
    <div className="page active">
      {alertToast && <div className="alert-toast glass-panel"><i className="fa-solid fa-bell-ringing fa-shake"></i>{alertToast}</div>}
      <div className="stats-grid">
        <StatCard icon="fa-tower-broadcast" colorClass="bg-blue" title="Tổng trạm" value="2" />
        <StatCard icon="fa-check" colorClass="bg-green" title="Online" value={onlineCount} />
        <StatCard icon="fa-power-off" colorClass="bg-gray" title="Offline" value={offlineCount} />
        <StatCard icon="fa-triangle-exclamation" colorClass="bg-yellow" title="Cảnh báo" value={warningsCount} />
      </div>
      <div className="dashboard-content">
        <div className="chart-container glass-panel">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Biểu đồ Realtime 2 trạm</h3>
          <div style={{ position: 'relative', flex: 1, overflowY: 'auto', minHeight: '300px' }}>
            
            <Line data={chartData} options={chartOptions} redraw={true} /> 

          </div>
        </div>
        <div className="stations-list">
          <StationCard name="TRẠM 1" value={currentSt1} isOnline={onlineCount >= 1} isWarning={currentSt1 > CO_WARNING_LEVEL} />
          <StationCard name="TRẠM 2" value={currentSt2} isOnline={onlineCount >= 2} isWarning={currentSt2 > CO_WARNING_LEVEL} />
        </div>
      </div>
    </div>
  );
}