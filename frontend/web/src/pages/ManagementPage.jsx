import React, { useState } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';

export default function ManagementPage({ CO_WARNING_LEVEL }) {
  
  const { liveTable } = useRealtimeData(CO_WARNING_LEVEL);

  const [filterStation, setFilterStation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [appliedFilters, setAppliedFilters] = useState({ station: 'all', status: 'all' });

  const handleSearchLive = () => {
    setAppliedFilters({ station: filterStation, status: filterStatus });
  };

  const filteredLiveTable = liveTable.filter(row => {
    const matchStation = appliedFilters.station === 'all' || row.station.toString() === appliedFilters.station;
    const matchStatus = appliedFilters.status === 'all' || row.status === appliedFilters.status;
    return matchStation && matchStatus;
  });

  return (
    <div className="page active">
      <div className="filter-bar glass-panel">
        <div className="filter-group">
          <label>Chọn Trạm</label>
          <select value={filterStation} onChange={e => setFilterStation(e.target.value)}>
            <option value="all">Tất cả các trạm</option>
            <option value="1">Trạm 1</option>
            <option value="2">Trạm 2</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Trạng Thái</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="normal">Bình thường</option>
            <option value="warning">Cảnh báo</option>
          </select>
        </div>
        <button className="btn" onClick={handleSearchLive}>Tìm kiếm</button>
      </div>
      
      <div className="table-container glass-panel">
        <table>
          <thead>
            <tr>
              <th>Trạm</th>
              <th>Thời Gian</th>
              <th>CO (ppm)</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredLiveTable.length > 0 ? filteredLiveTable.map((row, idx) => (
              <tr key={idx}>
                <td><strong>Trạm {row.station}</strong></td>
                <td>{row.time}</td>
                <td style={{ fontWeight: 'bold', color: row.status === 'warning' ? '#ef4444' : 'inherit' }}>{row.value}</td>
                <td>{row.status === 'warning' ? 'Cảnh báo' : 'Bình thường'}</td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không có dữ liệu trực tuyến</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}