import api from './api';

export const getProfile = async () => {
  const response = await api.get('/api/user/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/api/user/update', data);
  return response.data;
};

export const changePassword = async (email, oldPassword, newPassword) => {
  const response = await api.put('/api/user/change-password', {
    email,
    oldPassword,
    newPassword,
  });
  return response.data;
};
