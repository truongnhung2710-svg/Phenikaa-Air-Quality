import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, borderRadius } from '../theme/theme';

const COLOR_MAP = {
  blue: colors.primary,
  green: colors.success,
  gray: colors.gray,
  yellow: colors.warning,
};

export default function StatCard({ icon, colorKey, title, value }) {
  const iconColor = COLOR_MAP[colorKey] || colors.primary;

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: iconColor + '20' }]}>
        <FontAwesome5 name={icon} size={18} color={iconColor} />
      </View>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panelBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.panelBorder,
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
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    color: colors.textMain,
    fontSize: 22,
    fontWeight: '700',
  },
});
