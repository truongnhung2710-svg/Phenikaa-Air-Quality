import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { FontAwesome5 } from '@expo/vector-icons';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import GlassPanel from '../components/GlassPanel';
import { colors, borderRadius } from '../theme/theme';
import { CO_THRESHOLD } from '../utils/constants';
import { getHistory } from '../services/readingService';
import { computeStats, generateCSV } from '../utils/helpers';

export default function HistoryScreen() {
  const today = new Date().toISOString().split('T')[0];
  const [filterStation, setFilterStation] = useState('all');
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState({ min: 0, max: 0, avg: 0 });

  const handleSearch = async () => {
    try {
      const data = await getHistory();
      const filtered = data
        .filter((row) => {
          if (filterStation !== 'all' && row.station.toString() !== filterStation) return false;
          return true;
        })
        .map((row) => ({
          station: row.station,
          time: row.time,
          value: row.value,
          status: row.isWarning ? 'warning' : 'normal',
          isWarning: row.isWarning,
        }));

      setHistoryData(filtered);
      setStats(computeStats(filtered));
    } catch (err) {
      Alert.alert('Loi', 'Khong the tai du lieu lich su!');
    }
  };

  const handleExport = async () => {
    if (historyData.length === 0) {
      Alert.alert('Thong bao', 'Khong co du lieu de xuat!');
      return;
    }
    const result = generateCSV(historyData, filterStation, dateFrom);
    if (!result) return;

    const fileUri = FileSystem.cacheDirectory + result.fileName;
    await FileSystem.writeAsStringAsync(fileUri, result.csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert('Loi', 'Chia se khong kha dung tren thiet bi nay!');
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <LinearGradient colors={[colors.bgDarker, colors.bgDark]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
          <Text style={styles.pageTitle}>Lich Su Du Lieu & Canh Bao</Text>

          <FilterBar
            filters={[
              {
                label: 'Chon Tram',
                type: 'picker',
                value: filterStation,
                onChange: setFilterStation,
                options: [
                  { label: 'Tat ca', value: 'all' },
                  { label: 'Tram 1', value: '1' },
                  { label: 'Tram 2', value: '2' },
                ],
              },
            ]}
            buttons={[
              { label: 'Tim kiem', icon: 'search', onPress: handleSearch },
              { label: 'Xuat CSV', icon: 'file-csv', color: colors.success, onPress: handleExport },
            ]}
          />

          <View style={styles.summaryRow}>
            <GlassPanel style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Nho Nhat (MIN)</Text>
              <Text style={[styles.summaryValue, { color: colors.primary }]}>{stats.min} ppm</Text>
            </GlassPanel>
            <GlassPanel style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Trung Binh (TB)</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>{stats.avg} ppm</Text>
            </GlassPanel>
            <GlassPanel style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Lon Nhat (MAX)</Text>
              <Text style={[styles.summaryValue, { color: colors.danger }]}>{stats.max} ppm</Text>
            </GlassPanel>
          </View>

          <DataTable data={historyData} />
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
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
});
