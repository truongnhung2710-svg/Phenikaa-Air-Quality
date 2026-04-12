import api from './api';

export const getHistory = async () => {
  const response = await api.get('/api/readings/history');
  return response.data;
};
