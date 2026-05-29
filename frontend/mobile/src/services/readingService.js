import api from './api';

export const getHistory = async (startDate, endDate, vnStart, vnEnd) => {
  const response = await api.get('/api/readings/history', {
    params: {
      startDate: startDate,
      endDate: endDate,
      from: startDate,
      to: endDate,
      start: startDate,
      end: endDate,
      fromDate: vnStart,
      toDate: vnEnd
    }
  });
  return response.data;
};