import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/theme';

export default function StatusBadge({ status }) {
  const isWarning = status === 'warning';

  return (
    <View style={styles.row}>
      <FontAwesome5
        name={isWarning ? 'exclamation-triangle' : 'check-circle'}
        size={13}
        color={isWarning ? colors.warning : colors.success}
      />
      <Text style={[styles.text, { color: isWarning ? colors.warning : colors.success }]}>
        {isWarning ? ' Canh bao' : ' Binh thuong'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});
