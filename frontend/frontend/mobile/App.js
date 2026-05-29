import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/theme/theme'; // Đảm bảo đường dẫn này đúng
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* Dùng "auto" để StatusBar tự đổi màu đen/trắng theo hệ thống */}
        <StatusBar style="auto" /> 
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}