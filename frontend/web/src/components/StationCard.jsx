import React from 'react';

export default function StationCard({ name, value, isOnline, isWarning }) {
  let statusText = "Tốt";
  let statusColor = "#10b981"; 
  let needleRotation = -90; 

  // Thuật toán tính toán góc quay kim đồng hồ đo chất lượng khí CO
  if (value < 10) {
    statusText = "Tốt"; statusColor = "#10b981";
    needleRotation = -90 + (value / 10) * 45; 
  } else if (value < 25) {
    statusText = "Trung bình"; statusColor = "#facc15";
    needleRotation = -45 + ((value - 10) / 15) * 45;
  } else if (value < 50) {
    statusText = "Kém"; statusColor = "#f97316";
    needleRotation = 0 + ((value - 25) / 25) * 45;
  } else {
    statusText = "Nguy hiểm"; statusColor = "#ef4444";
    let maxVal = Math.min(value, 100); 
    needleRotation = 45 + ((maxVal - 50) / 50) * 45;
  }

  return (
    <div className={`station-card glass-panel ${isWarning ? 'alert-active' : ''}`.trim()}>
      <div className="station-info-top">
        <div className="left-side">
          <h3 className="station-name">{name}</h3>
          <div className={`status-pill ${isOnline ? 'active' : 'offline'}`}>
            {isOnline ? 'ĐANG HOẠT ĐỘNG' : 'MẤT KẾT NỐI'}
          </div>
          <div className="co-display">
            <span className="value-num">{value}</span>
            <span className="unit">ppm</span>
          </div>
          <div className="update-time">
            <i className="fa-regular fa-clock"></i> Cập nhật: Vừa xong
          </div>
        </div>

        <div className="right-side-gauge">
          <div className="gauge-wrapper">
            <div className="gauge-bg-colors"
            style={{ 
                background: 'linear-gradient(to right, #10b981 0%, #facc15 33%, #f97316 66%, #ef4444 100%)' 
              }}
            ></div>
            <div className="gauge-inner-mask"></div>
            <div className="gauge-needle" style={{ transform: `rotate(${needleRotation}deg)`, transition: 'transform 0.5s ease' }}></div>
            <div className="gauge-center-dot" style={{ backgroundColor: statusColor }}></div>
          </div>
          <div className="gauge-label-text">
            <span>chất lượng không khí</span>
            <strong style={{ color: statusColor }}>{statusText}</strong>
          </div>
        </div>
      </div>

      <div className="station-footer-legend">
        <div className="leg-item"><span className="dot bg-green"></span> Tốt</div>
        <div className="leg-item"><span className="dot bg-yellow"></span> Trung bình</div>
        <div className="leg-item"><span className="dot bg-orange"></span> Kém</div>
        <div className="leg-item"><span className="dot bg-red"></span> Nguy hiểm</div>
      </div>
    </div>
  );
}