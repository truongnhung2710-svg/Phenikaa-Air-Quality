import React, { useState, useEffect } from 'react';


export default function HistoryPage({ THRESHOLD }) {
  const today = new Date().toISOString().split('T')[0];
  const [filterStation, setFilterStation] = useState('all');
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState({ min: 0, max: 0, avg: 0 });

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/readings/history?start=${dateFrom}&end=${dateTo}`);
      if (!response.ok) throw new Error("Lỗi gọi API lịch sử");
      const data = await response.json();
      let filteredData = filterStation !== 'all' ? data.filter(row => String(row.station) === filterStation) : data;

      if (filteredData.length === 0) {
        setHistoryData([]); setStats({ min: 0, max: 0, avg: 0 }); return;
      }

      let min = filteredData[0].value, max = filteredData[0].value, sum = 0;
      filteredData.forEach(row => {
        if (row.value < min) min = row.value;
        if (row.value > max) max = row.value;
        sum += row.value;
      });

      setHistoryData(filteredData);
      setStats({ min, max, avg: Math.round(sum / filteredData.length) });
    } catch (err) { console.error("Lỗi hành vi tải lịch sử:", err); }
  };

  const exportToExcel = () => {
    if (historyData.length === 0) return alert("Không có dữ liệu để xuất!");
    const headers = ['Trạm', 'Thời Gian', 'CO (ppm)', 'Trạng Thái'];
    const rows = historyData.map(row => [`Trạm ${row.station}`, row.time, row.value, row.isWarning ? 'Cảnh báo' : 'Bình thường']);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Du_Lieu_CO_${dateFrom}.csv`;
    link.click();
  };

  useEffect(() => { handleSearch(); }, []);

  return (
    <div className="page active">
      <div className="filter-bar glass-panel">
        <div className="filter-group"><label>Chọn Trạm</label><select value={filterStation} onChange={e => setFilterStation(e.target.value)}><option value="all">Tất cả</option><option value="1">Trạm 1</option><option value="2">Trạm 2</option></select></div>
        <div className="filter-group"><label>Từ Ngày</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
        <div className="filter-group"><label>Đến Ngày</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
        <button className="btn" onClick={handleSearch}>Tìm kiếm</button>
        <button className="btn" style={{ background: '#10b981' }} onClick={exportToExcel}>Xuất Excel</button>
      </div>
      <div className="summary-cards">
        <div className="summary-card glass-panel"><h4>MIN</h4><div className="val">{stats.min} ppm</div></div>
        <div className="summary-card glass-panel"><h4>AVG</h4><div className="val" style={{color: '#10b981'}}>{stats.avg} ppm</div></div>
        <div className="summary-card glass-panel"><h4>MAX</h4><div className="val" style={{color: '#ef4444'}}>{stats.max} ppm</div></div>
      </div>
      <div className="table-container glass-panel">
        <table>
          <thead><tr><th>Trạm</th><th>Thời Gian</th><th>CO (ppm)</th><th>Trạng Thái</th></tr></thead>
          <tbody>
            {historyData.map((row, idx) => (
              <tr key={idx}><td>Trạm {row.station}</td><td>{row.time}</td><td>{row.value}</td><td>{row.isWarning ? 'Cảnh báo' : 'Bình thường'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}