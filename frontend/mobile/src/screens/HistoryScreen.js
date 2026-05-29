import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import { useTheme } from '../theme/theme'; 
import { getHistory } from '../services/readingService';
import { computeStats } from '../utils/helpers'; 

export default function HistoryScreen() {
  const { theme } = useTheme(); 
  
  const [filterStation, setFilterStation] = useState('all');
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());

  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState({ min: 0, max: 0, avg: 0 });

  const handleSearch = async () => {
    try {
      
      const formatLocal = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; 
      };

      const fromStr = formatLocal(dateFrom);
      const toStr = formatLocal(dateTo);


      const vnFromStr = `${String(dateFrom.getDate()).padStart(2, '0')}/${String(dateFrom.getMonth() + 1).padStart(2, '0')}/${dateFrom.getFullYear()}`;
      const vnToStr = `${String(dateTo.getDate()).padStart(2, '0')}/${String(dateTo.getMonth() + 1).padStart(2, '0')}/${dateTo.getFullYear()}`;


      const data = await getHistory(fromStr, toStr, vnFromStr, vnToStr);

      const startOfDay = new Date(dateFrom);
      startOfDay.setHours(0, 0, 0, 0); 

      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);

      const filtered = data
        .filter((row) => {
          if (filterStation !== 'all' && String(row.station) !== String(filterStation)) return false;

          let rowDate = new Date();
          let isValidDate = false;

          if (typeof row.time === 'string' && row.time.includes('/')) {
            const parts = row.time.split(' '); 
            const dateStr = parts.find(p => p.includes('/')); 
            const timeStr = parts.find(p => p.includes(':')); 

            if (dateStr) {
              const [d, m, y] = dateStr.split('/');
              let h = 0, min = 0, s = 0;
              
              if (timeStr) {
                const tParts = timeStr.split(':');
                h = parseInt(tParts[0], 10) || 0;
                min = parseInt(tParts[1], 10) || 0;
                s = parseInt(tParts[2], 10) || 0;
              }
              
              rowDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), h, min, s);
              isValidDate = true;
            }
          }

          if (!isValidDate) {
            rowDate = new Date(row.time);
          }

          if (isNaN(rowDate.getTime())) return false;

          if (rowDate >= startOfDay && rowDate <= endOfDay) {
             return true; 
          }
          return false; 
        })
        .map((row) => {
          let displayTime = row.time;
          let displayDate = "";

          if (typeof row.time === 'string' && row.time.includes(' ')) {
            const parts = row.time.split(' ');
            displayTime = parts.find(p => p.includes(':')) || parts[0]; 
            displayDate = parts.find(p => p.includes('/')) || parts[1]; 
          } else if (!isNaN(new Date(row.time).getTime())) {
            const d = new Date(row.time);
            displayTime = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            displayDate = d.toLocaleDateString('vi-VN');
          }

          return {
            station: row.station,
            time: displayTime,
            date: displayDate, 
            value: row.value,
            status: row.isWarning ? 'warning' : 'normal',
            isWarning: row.isWarning,
          };
        });

      setHistoryData(filtered);
      setStats(computeStats(filtered));
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu lịch sử!');
    }
  };

  // 2. HÀM XUẤT CSV
  const handleExport = async () => {
    if (historyData.length === 0) {
      Alert.alert('Thông báo', 'Không có dữ liệu để xuất!');
      return;
    }
    try {
      const header = 'TRAM,THOI GIAN,CO (PPM),TRANG THAI\n';
      const rows = historyData.map(row => {
        const statusText = row.isWarning ? 'Canh bao' : 'Binh thuong';
        return `Tram ${row.station},${row.time} ${row.date},${row.value},${statusText}`;
      }).join('\n');

      const csvContent = header + rows;
      const fileName = `LichSu_Tram_${filterStation}_${new Date().getTime()}.csv`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: 'utf8' });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Xuất dữ liệu CSV',
          UTI: 'public.comma-separated-values-text' 
        });
      } else {
        Alert.alert('Lỗi', 'Tính năng chia sẻ không khả dụng trên thiết bị này!');
      }
    } catch (err) {
      console.error('Lỗi xuất CSV:', err);
      Alert.alert('Lỗi', 'Đã xảy ra sự cố khi xuất file CSV! Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.bgDark }]} edges={['top']}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <Text style={[styles.pageTitle, { color: theme.textMain }]}>Lịch Sử Dữ Liệu & Cảnh Báo</Text>

        <FilterBar
          filters={[
            {
              label: 'Chọn Trạm',
              type: 'picker',
              value: filterStation,
              onChange: setFilterStation,
              options: [
                { label: 'Tất cả', value: 'all' },
                { label: 'Trạm 1', value: '1' },
                { label: 'Trạm 2', value: '2' },
              ],
            },
            {
              label: 'Từ Ngày',
              type: 'date',
              value: dateFrom,
              onChange: setDateFrom,
            },
            {
              label: 'Đến Ngày',
              type: 'date',
              value: dateTo,
              onChange: setDateTo,
            }
          ]}
          buttons={[
            { label: 'Tìm kiếm', icon: 'search', onPress: handleSearch },
            { label: 'Xuất CSV', icon: 'file-csv', color: theme.success, onPress: handleExport },
          ]}
        />

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Nhỏ Nhất (MIN)</Text>
            <Text style={[styles.summaryValue, { color: theme.primary }]}>{stats.min} ppm</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Trung Bình (TB)</Text>
            <Text style={[styles.summaryValue, { color: theme.success }]}>{stats.avg} ppm</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Lớn Nhất (MAX)</Text>
            <Text style={[styles.summaryValue, { color: theme.danger }]}>{stats.max} ppm</Text>
          </View>
        </View>

        <DataTable data={historyData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  pageTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  summaryCard: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  summaryLabel: { fontSize: 11, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '700' },
});