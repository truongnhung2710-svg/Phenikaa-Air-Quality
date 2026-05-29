import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { borderRadius } from '../theme/theme';
import { useTheme } from '../theme/theme'; // Chỉ dùng useTheme

export default function StatCard({ icon, colorKey, title, value }) {
  const { theme } = useTheme(); // Lấy biến theme động

  let iconColor = theme.primary;
  if (colorKey === 'green') iconColor = theme.success;
  if (colorKey === 'yellow') iconColor = theme.warning;
  if (colorKey === 'gray') iconColor = theme.gray;

  return (
    // Đưa màu nền và viền vào inline style để nhận theme mới
    <View style={[styles.card, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
      <View style={[styles.iconBox, { backgroundColor: iconColor + '20' }]}>
        <FontAwesome5 name={icon} size={18} color={iconColor} />
      </View>
      <View>
        {/* Đổi màu chữ động theo theme */}
        <Text style={[styles.title, { color: theme.textMuted }]}>{title}</Text>
        <Text style={[styles.value, { color: theme.textMain }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
});