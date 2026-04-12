import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealtimeData } from '../hooks/useRealtimeData';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import LoadingOverlay from '../components/LoadingOverlay';
import { colors } from '../theme/theme';

export default function ManagementScreen() {
  const { liveTable, isLoading, refresh } = useRealtimeData(true);
  const [filterStation, setFilterStation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [appliedFilters, setAppliedFilters] = useState({ station: 'all', status: 'all' });
  const [refreshing, setRefreshing] = useState(false);

  const filteredData = useMemo(() => {
    return liveTable.filter((row) => {
      const matchStation =
        appliedFilters.station === 'all' || row.station.toString() === appliedFilters.station;
      const matchStatus = appliedFilters.status === 'all' || row.status === appliedFilters.status;
      return matchStation && matchStatus;
    });
  }, [liveTable, appliedFilters]);

  const handleSearch = () => {
    setAppliedFilters({ station: filterStation, status: filterStatus });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (isLoading) return <LoadingOverlay />;

  return (
    <LinearGradient colors={[colors.bgDarker, colors.bgDark]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <Text style={styles.pageTitle}>Quan Ly Tram / Giam Sat Truc Tuyen</Text>

          <FilterBar
            filters={[
              {
                label: 'Chon Tram',
                type: 'picker',
                value: filterStation,
                onChange: setFilterStation,
                options: [
                  { label: 'Tat ca cac tram', value: 'all' },
                  { label: 'Tram 1', value: '1' },
                  { label: 'Tram 2', value: '2' },
                ],
              },
              {
                label: 'Trang Thai',
                type: 'picker',
                value: filterStatus,
                onChange: setFilterStatus,
                options: [
                  { label: 'Tat ca', value: 'all' },
                  { label: 'Binh thuong', value: 'normal' },
                  { label: 'Canh bao', value: 'warning' },
                ],
              },
            ]}
            buttons={[{ label: 'Tim kiem', icon: 'search', onPress: handleSearch }]}
          />

          <DataTable data={filteredData} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  pageTitle: {
    color: colors.textMain,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
});
