import { useState, useEffect, useCallback } from 'react';
import { getHistory } from '../services/readingService';
import { CO_THRESHOLD, POLL_INTERVAL_MS } from '../utils/constants';

export const useRealtimeData = (isActive) => {
  const [timeLabels, setTimeLabels] = useState([]);
  const [st1Data, setSt1Data] = useState([]);
  const [st2Data, setSt2Data] = useState([]);
  const [liveTable, setLiveTable] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await getHistory();
      const recentData = data.slice(0, 30).reverse();

      const timeMap = {};
      recentData.forEach((row) => {
        const timeMatch = row.time.match(/\d{1,2}:\d{2}:\d{2}/);
        const timeStr = timeMatch ? timeMatch[0] : row.time;
        if (!timeMap[timeStr]) {
          timeMap[timeStr] = { st1: null, st2: null };
        }
        if (row.station == '1') {
          timeMap[timeStr].st1 = row.value;
        } else if (row.station == '2') {
          timeMap[timeStr].st2 = row.value;
        }
      });

      const newLabels = Object.keys(timeMap).slice(-15);
      const newSt1 = newLabels.map((t) => timeMap[t].st1);
      const newSt2 = newLabels.map((t) => timeMap[t].st2);

      const newTable = recentData
        .map((row) => ({
          station: row.station,
          time: row.time.match(/\d{1,2}:\d{2}:\d{2}/)?.[0] || row.time,
          value: row.value,
          status: row.isWarning ? 'warning' : 'normal',
        }))
        .reverse();

      setTimeLabels(newLabels);
      setSt1Data(newSt1);
      setSt2Data(newSt2);
      setLiveTable(newTable.slice(0, 20));
    } catch (err) {
      console.error('Error fetching realtime data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;
    setIsLoading(true);
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isActive, fetchData]);

  const currentSt1 = st1Data[st1Data.length - 1] || 0;
  const currentSt2 = st2Data[st2Data.length - 1] || 0;
  const warningsCount =
    (currentSt1 >= CO_THRESHOLD ? 1 : 0) + (currentSt2 >= CO_THRESHOLD ? 1 : 0);

  return {
    timeLabels,
    st1Data,
    st2Data,
    liveTable,
    currentSt1,
    currentSt2,
    warningsCount,
    isLoading,
    refresh: fetchData,
  };
};
