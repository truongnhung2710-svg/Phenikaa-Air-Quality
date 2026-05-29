import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const useRealtimeData = (CO_WARNING_LEVEL) => {
  const [chart, setChart] = useState({
    labels: [],
    st1: [],
    st2: []
  });
  
  const [liveTable, setLiveTable] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [alertToast, setAlertToast] = useState('');

  const updateStats = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/devices/device-status');
      if (res.ok) {
        const data = await res.json();
        setOnlineCount(Number(data.online) || 0);
        setOfflineCount(Number(data.offline) || 0);
      }
    } catch (err) {}
  };

  const fetchInitialData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/readings/history');
      if (!response.ok) return;
      const data = await response.json();
      const recentData = data.slice(0, 30).reverse();
      
      const timeMap = {};
      recentData.forEach(row => {
        const timeMatch = row.time.match(/\d{1,2}:\d{2}:\d{2}/);
        const timeStr = timeMatch ? timeMatch[0] : row.time;
        if (!timeMap[timeStr]) timeMap[timeStr] = { st1: null, st2: null };
        if (String(row.station) === "1" || String(row.station).includes('1')) timeMap[timeStr].st1 = row.value;
        else if (String(row.station) === "2" || String(row.station).includes('2')) timeMap[timeStr].st2 = row.value;
      });

      const newLabels = Object.keys(timeMap).slice(-10);
      
      setChart({
        labels: newLabels,
        st1: newLabels.map(t => timeMap[t].st1),
        st2: newLabels.map(t => timeMap[t].st2)
      });
      
      setLiveTable(recentData.map(row => ({
        station: row.station,
        time: row.time.match(/\d{1,2}:\d{2}:\d{2}/)?.[0] || row.time,
        value: row.value,
        status: row.isWarning ? 'warning' : 'normal'
      })).reverse().slice(0, 20));

    } catch (err) {}
  };

  useEffect(() => {
    fetchInitialData();
    updateStats();

    const socket = io('http://localhost:5001');

    socket.on('co_realtime_data', (newData) => {
      const timeStr = new Date(newData.time).toLocaleTimeString('vi-VN');
      const stationId = String(newData.station);

      setChart((prev) => {
        const nextLabels = [...prev.labels, timeStr].slice(-10);
        
        const nextSt1 = [...prev.st1, stationId.includes('1') ? newData.value : (prev.st1[prev.st1.length - 1] || 0)].slice(-10);
        const nextSt2 = [...prev.st2, stationId.includes('2') ? newData.value : (prev.st2[prev.st2.length - 1] || 0)].slice(-10);
        
        return {
          labels: nextLabels,
          st1: nextSt1,
          st2: nextSt2
        };
      });

      setLiveTable((prevTable) => {
        const formattedRow = {
          station: newData.station || "1",
          time: timeStr,
          value: newData.value,
          status: newData.isWarning ? 'warning' : 'normal'
        };
        return [formattedRow, ...prevTable].slice(0, 20);
      });

      // Hiển thị cảnh báo nguy hiểm
      if (newData.value > CO_WARNING_LEVEL) {
        setAlertToast(`⚠️ CẢNH BÁO NGUY HIỂM: Trạm ${newData.station} đo được nồng độ CO: ${newData.value} ppm!`);
        setTimeout(() => setAlertToast(''), 6000);
      }
      updateStats();
    });

    return () => socket.disconnect();
  }, [CO_WARNING_LEVEL]);

  return { 
    timeLabels: chart.labels, 
    st1Data: chart.st1, 
    st2Data: chart.st2, 
    liveTable, 
    onlineCount, 
    offlineCount, 
    alertToast 
  };
};