import React, { createContext, useState, useEffect } from 'react';
import { setToken, getToken, removeToken, setUserEmail, getUserEmail, clearAll } from '../utils/storage';
import * as authService from '../services/authService';
import * as userService from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        const profile = await userService.getProfile();
        setUser(profile);
        setIsAuthenticated(true);
      }
    } catch (err) {
      await clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data.token) {
      await setToken(data.token);
      await setUserEmail(email);
      const profile = await userService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    }
    return data;
  };

  const register = async (name, email, password) => {
    return await authService.register(name, email, password);
  };

  const logout = async () => {
    await clearAll();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
