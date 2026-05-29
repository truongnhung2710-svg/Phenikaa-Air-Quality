import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
const EMAIL_KEY = 'userEmail';

export const setToken = async (token) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const setUserEmail = async (email) => {
  await AsyncStorage.setItem(EMAIL_KEY, email);
};

export const getUserEmail = async () => {
  return await AsyncStorage.getItem(EMAIL_KEY);
};

export const clearAll = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, EMAIL_KEY]);
};
