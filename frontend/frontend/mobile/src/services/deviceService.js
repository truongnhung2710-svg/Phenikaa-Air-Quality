import api from './api';

export const getDevices = async () => {
  const response = await api.get('/api/devices');
  return response.data;
};
