import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, borderRadius } from '../theme/theme';

export default function StationCard({ name, value, isWarning }) {
  const borderColor = isWarning ? colors.warning : colors.success;

  return (
    <View style={[styles.card, { borderLeftColor: borderColor, borderLeftWidth: 3 }]}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <View style={[styles.badge, { backgroundColor: isWarning ? colors.warning + '20' : colors.success + '20' }]}>
          <Text style={[styles.badgeText, { color: isWarning ? colors.warning : colors.success }]}>
            {isWarning ? 'Canh bao muc CO' : 'Dang hoat dong'}
          </Text>
        </View>
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: isWarning ? colors.warning : colors.textMain }]}>
          {value}
        </Text>
        <Text style={styles.unit}>ppm</Text>
      </View>
      <View style={styles.footer}>
        <FontAwesome5 name="clock" size={12} color={colors.textMuted} />
        <Text style={styles.footerText}> Cap nhat: Vua xong</Text>
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
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    color: colors.textMain,
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 8,
  },
  value: {
    fontSize: 36,
    fontWeight: '700',
  },
  unit: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
