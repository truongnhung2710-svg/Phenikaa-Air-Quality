import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../theme/theme';

export default function DataTable({ data, emptyMessage = 'Không tìm thấy dữ liệu' }) {
  const { theme } = useTheme();

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
        <Text style={{ color: theme.textMuted, textAlign: 'center', padding: 20 }}>Không có dữ liệu</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={[styles.headerRow, { borderBottomColor: theme.panelBorder, backgroundColor: theme.gridLine }]}>
      <Text style={[styles.headerCell, { flex: 1.2, color: theme.textMuted }]}>Trạm</Text>
      <Text style={[styles.headerCell, { flex: 2.5, color: theme.textMuted }]}>Thời Gian</Text>
      <Text style={[styles.headerCell, { flex: 1.5, color: theme.textMuted }]}>CO (ppm)</Text>
      <Text style={[styles.headerCell, { flex: 2, color: theme.textMuted }]}>Trạng Thái</Text>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const isNormal = item.status === 'normal' || item.status === 'Bình thường';
    const statusColor = isNormal ? theme.success : theme.danger;
    const statusText = isNormal ? 'Bình thường' : 'Cảnh báo';
    const iconName = isNormal ? 'check-circle' : 'exclamation-circle';

    return (
      <View style={[styles.row, { borderBottomColor: theme.panelBorder }, index % 2 === 0 && { backgroundColor: theme.gridLine }]}>
        <Text style={[styles.cell, { flex: 1.2, fontWeight: 'bold', color: theme.textMain }]}>Trạm {item.station}</Text>
        
        <View style={{ flex: 2.5 }}>
          <Text style={[styles.cell, { color: theme.textMain }]}>{item.time}</Text>
          
          {item.date ? (
            <Text style={[styles.cell, { color: theme.textMuted, fontSize: 11 }]}>{item.date}</Text>
          ) : null}
        </View>

        <Text style={[styles.cell, { flex: 1.5, fontWeight: 'bold', color: theme.textMain }]}>{item.value || item.co}</Text>
        
        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome5 name={iconName} size={12} color={statusColor} style={{ marginRight: 4 }} />
          <Text style={[styles.cell, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
      {renderHeader()}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', paddingBottom: 10 },
  headerRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1 },
  headerCell: { fontSize: 10, fontWeight: 'bold' },
  row: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, alignItems: 'center' },
  cell: { fontSize: 13 }
});