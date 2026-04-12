import { CO_THRESHOLD } from './constants';

export const formatTime = (timeStr) => {
  const match = timeStr.match(/\d{1,2}:\d{2}:\d{2}/);
  return match ? match[0] : timeStr;
};

export const computeStats = (data) => {
  if (!data || data.length === 0) return { min: 0, max: 0, avg: 0 };
  const values = data.map((r) => r.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  return { min, max, avg };
};

export const generateCSV = (data, filterStation, dateFrom) => {
  if (!data || data.length === 0) return null;
  const headers = ['Trạm', 'Thời Gian', 'CO (ppm)', 'Trạng Thái'];
  const rows = data.map((row) => [
    `Trạm ${row.station}`,
    row.time,
    row.value,
    row.isWarning ? 'Cảnh báo' : 'Bình thường',
  ]);
  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const stationName =
    filterStation === 'all' ? 'Tat_Ca_Tram' : `Tram_${filterStation}`;
  const fileName = `Du_Lieu_CO_${stationName}_${dateFrom}.csv`;
  return { csvContent, fileName };
};
