import { useState, useEffect, useCallback } from 'react';
import { getHistory } from '../services/readingService';
import { CO_THRESHOLD } from '../utils/constants';
import { io } from 'socket.io-client';


const SOCKET_URL = 'http://192.168.1.8:5001'; 

export const useRealtimeData = (isActive) => {
  const [timeLabels, setTimeLabels] = useState([]);
  const [st1Data, setSt1Data] = useState([]);
  const [st2Data, setSt2Data] = useState([]);
  const [liveTable, setLiveTable] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const processChartData = useCallback((recentData) => {
    const timeMap = {};
    recentData.forEach((row) => {
      const timeMatch = row.time.match(/\d{1,2}:\d{2}/); 
      const timeStr = timeMatch ? timeMatch[0] : row.time;
      
      if (!timeMap[timeStr]) {
        timeMap[timeStr] = { st1: null, st2: null };
      }
      if (String(row.station).includes('1')) timeMap[timeStr].st1 = Number(row.value);
      else if (String(row.station).includes('2')) timeMap[timeStr].st2 = Number(row.value);
    });

    const sortedKeys = Object.keys(timeMap).sort();
    let lastSt1 = 0;
    let lastSt2 = 0;
    
    sortedKeys.forEach(t => {
      if (timeMap[t].st1 !== null) lastSt1 = timeMap[t].st1;
      else timeMap[t].st1 = lastSt1; 

      if (timeMap[t].st2 !== null) lastSt2 = timeMap[t].st2;
      else timeMap[t].st2 = lastSt2; 
    });

    const newLabels = sortedKeys.slice(-5);
    const newSt1 = newLabels.map(t => timeMap[t].st1);
    const newSt2 = newLabels.map(t => timeMap[t].st2);

    setTimeLabels(newLabels);
    setSt1Data(newSt1);
    setSt2Data(newSt2);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await getHistory();
      const recentData = data.slice(0, 300).reverse();

      const newTable = recentData.map((row) => ({
        station: row.station,
        time: row.time.match(/\d{1,2}:\d{2}:\d{2}/)?.[0] || row.time,
        value: row.value,
        status: row.isWarning ? 'warning' : 'normal',
      })).reverse();

      setLiveTable(newTable);
      processChartData(recentData); 
    } catch (err) {
      console.error('Lỗi khi kéo API lịch sử:', err);
    } finally {
      setIsLoading(false);
    }
  }, [processChartData]);


  useEffect(() => {
    if (!isActive) return;
    fetchData(); 
    
    const autoFetchTimer = setInterval(() => {
      fetchData();
    }, 5000); 

    return () => clearInterval(autoFetchTimer);
  }, [isActive, fetchData]);


  useEffect(() => {
    if (!isActive) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'], 
      forceNew: true,
      timeout: 10000
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('co_realtime_data', (newData) => {
      const d = new Date(newData.time || Date.now());
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
      
      const newRow = {
        station: newData.station,
        time: timeStr,
        value: newData.value,
        status: newData.value >= CO_THRESHOLD ? 'warning' : 'normal'
      };

      setLiveTable((prevTable) => {
        const updatedTable = [newRow, ...prevTable].slice(0, 300);
        
        const rawFormatData = [...updatedTable].reverse().map(item => ({
          station: item.station,
          time: item.time,
          value: item.value,
          isWarning: item.status === 'warning'
        }));
        processChartData(rawFormatData); 
        
        return updatedTable;
      });
    });

    return () => socket.disconnect();
  }, [isActive, processChartData]);

  const currentSt1 = st1Data[st1Data.length - 1] || 0;
  const currentSt2 = st2Data[st2Data.length - 1] || 0;
  const warningsCount = (currentSt1 >= CO_THRESHOLD ? 1 : 0) + (currentSt2 >= CO_THRESHOLD ? 1 : 0);

  return {
    timeLabels, st1Data, st2Data,
    liveTable: liveTable.slice(0, 20),
    currentSt1, currentSt2, warningsCount,
    isLoading, isConnected, refresh: fetchData,
  };
};