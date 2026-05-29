import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../theme/theme';

export default function GlassPanel({ children, style }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panelBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 16,
    marginBottom: 16,
  },
});
