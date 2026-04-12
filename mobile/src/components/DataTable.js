import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import GlassPanel from './GlassPanel';
import StatusBadge from './StatusBadge';
import { colors } from '../theme/theme';

export default function DataTable({ data, emptyMessage = 'Khong tim thay du lieu' }) {
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, { flex: 1.2 }]}>Tram</Text>
      <Text style={[styles.headerCell, { flex: 1.5 }]}>Thoi Gian</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>CO (ppm)</Text>
      <Text style={[styles.headerCell, { flex: 1.3 }]}>Trang Thai</Text>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 && styles.rowEven]}>
      <Text style={[styles.cell, { flex: 1.2, fontWeight: '700' }]}>Tram {item.station}</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>{item.time}</Text>
      <Text
        style={[
          styles.cell,
          { flex: 1, fontWeight: '700' },
          item.status === 'warning' && { color: colors.warning },
        ]}
      >
        {item.value}
      </Text>
      <View style={{ flex: 1.3 }}>
        <StatusBadge status={item.status} />
      </View>
    </View>
  );

  return (
    <GlassPanel style={{ padding: 0, overflow: 'hidden' }}>
      {renderHeader()}
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.empty}>{emptyMessage}</Text>
      )}
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderBottomWidth: 1,
    borderBottomColor: colors.panelBorder,
  },
  headerCell: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  rowEven: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cell: {
    color: colors.textMain,
    fontSize: 13,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
    fontSize: 14,
  },
});
