import React, { createContext, useState, useContext } from 'react';

// 1. BẢNG MÀU TỐI (Giữ nguyên 100% code cũ của bạn)
export const darkColors = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  bgDark: '#0f172a',
  bgDarker: '#020617',
  panelBg: '#1e293b',
  panelBorder: 'rgba(255, 255, 255, 0.08)',
  textMain: '#f8fafc',
  textMuted: '#94a3b8',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  gray: '#64748b',
  inputBg: '#0f172a',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  // Bổ sung thêm biến shadow cho chế độ tối
  shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  gridLine: 'rgba(255, 255, 255, 0.05)',
};

// 2. BẢNG MÀU SÁNG (Được đo chuẩn mã màu từ giao diện Web Phenikaa của bạn)
export const lightColors = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  bgDark: '#eef2f6',       // Nền tổng thể màu xám/xanh nhạt
  bgDarker: '#e2e8f0',     
  panelBg: '#ffffff',      // Nền thẻ card màu trắng
  panelBorder: '#e2e8f0',  // Viền mỏng màu xám nhạt
  textMain: '#1e293b',     // Chữ chính màu đen/xám đậm
  textMuted: '#64748b',    // Chữ phụ màu xám
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  gray: '#94a3b8',
  inputBg: '#f8fafc',
  inputBorder: '#cbd5e1',
  // Bổ sung thêm biến shadow cho chế độ sáng
  shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  gridLine: 'rgba(0, 0, 0, 0.05)',
};

// Tạm thời export `colors` mặc định là darkColors để các file cũ trong app CHƯA KỊP sửa không bị lỗi màn hình trắng
export const colors = darkColors; 

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const fonts = {
  regular: { fontSize: 14, color: colors.textMain },
  muted: { fontSize: 13, color: colors.textMuted },
  heading: { fontSize: 20, fontWeight: '700', color: colors.textMain },
  subheading: { fontSize: 16, fontWeight: '600', color: colors.textMain },
};

// ============================================================================
// 3. TÍCH HỢP THEME CONTEXT ĐỂ QUẢN LÝ CHUYỂN ĐỔI GIAO DIỆN SÁNG/TỐI
// ============================================================================

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Đặt mặc định là chế độ Sáng (false), nếu muốn mở app lên là Tối thì đổi thành true
  const [isDarkMode, setIsDarkMode] = useState(false); 
  
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Biến `theme` sẽ tự động chuyển đổi toàn bộ mã màu tùy thuộc vào isDarkMode
  const theme = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook rút gọn để gọi ở các màn hình/component khác
export const useTheme = () => useContext(ThemeContext);