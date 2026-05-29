import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealtimeData } from '../hooks/useRealtimeData';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import LoadingOverlay from '../components/LoadingOverlay';
import { useTheme } from '../theme/theme'; 

export default function ManagementScreen() {
  const { theme } = useTheme(); 
  const { liveTable, isLoading, refresh } = useRealtimeData(true);
  const [filterStation, setFilterStation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [appliedFilters, setAppliedFilters] = useState({ station: 'all', status: 'all' });
  const [refreshing, setRefreshing] = useState(false);

  const filteredData = useMemo(() => {
    return liveTable.filter((row) => {
      const matchStation = appliedFilters.station === 'all' || row.station.toString() === appliedFilters.station;
      const matchStatus = appliedFilters.status === 'all' || row.status === appliedFilters.status;
      return matchStation && matchStatus;
    });
  }, [liveTable, appliedFilters]);

  const handleSearch = () => { setAppliedFilters({ station: filterStation, status: filterStatus }); };

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (isLoading) return <LoadingOverlay />;

  return (
   
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.bgDark }]} edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        <Text style={[styles.pageTitle, { color: theme.textMain }]}>Quản Lý Trạm / Giám Sát</Text>

        <FilterBar
          filters={[
            { label: 'Chọn Trạm', type: 'picker', value: filterStation, onChange: setFilterStation, options: [{ label: 'Tất cả các trạm', value: 'all' }, { label: 'Trạm 1', value: '1' }, { label: 'Trạm 2', value: '2' }] },
            { label: 'Trạng Thái', type: 'picker', value: filterStatus, onChange: setFilterStatus, options: [{ label: 'Tất cả', value: 'all' }, { label: 'Bình thường', value: 'normal' }, { label: 'Cảnh báo', value: 'warning' }] },
          ]}
          buttons={[{ label: 'Tìm kiếm', icon: 'search', onPress: handleSearch }]}
        />
        <DataTable data={filteredData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  pageTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
});