import React, { useState } from 'react';
import { 
  View, Text, ScrollView, RefreshControl, StyleSheet, TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// Hooks & Context
import { useRealtimeData } from '../hooks/useRealtimeData';
import { useTheme } from '../theme/theme';

// Components
import StatCard from '../components/StatCard';
import StationCard from '../components/StationCard';
import COLineChart from '../components/COLineChart';
import LoadingOverlay from '../components/LoadingOverlay';

// Utils
import { CO_THRESHOLD } from '../utils/constants';

export default function DashboardScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

 
  const {
    timeLabels,
    st1Data,
    st2Data,
    currentSt1,
    currentSt2,
    warningsCount,
    isLoading,
    isConnected, 
    refresh,
  } = useRealtimeData(true);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (isLoading) return <LoadingOverlay />;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.bgDark }]} edges={['top']}>
      
      {/* HEADER KÈM TRẠNG THÁI WEBSOCKET */}
      <View style={[styles.headerContainer, { borderBottomColor: theme.panelBorder, backgroundColor: theme.panelBg }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textMain }]}>Tổng Quan Hệ Thống</Text>
        </View>
        
        <TouchableOpacity onPress={toggleTheme} style={[styles.iconBtn, { backgroundColor: theme.bgDark }]}>
          <FontAwesome5 name={isDarkMode ? "sun" : "moon"} size={16} color={theme.textMain} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        <View style={styles.statsGrid}>
          <StatCard icon="broadcast-tower" colorKey="blue" title="Tổng trạm" value="2" />
          <StatCard icon="check" colorKey="green" title="Online" value={isConnected ? "2" : "0"} />
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon="power-off" colorKey="gray" title="Offline" value={isConnected ? "0" : "2"} />
          <StatCard icon="exclamation-triangle" colorKey="yellow" title="Cảnh báo" value={warningsCount.toString()} />
        </View>

        <COLineChart timeLabels={timeLabels} st1Data={st1Data} st2Data={st2Data} />

        <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Trạng Thái Các Trạm</Text>
        <StationCard 
          name="TRẠM 1" 
          value={currentSt1} 
          isOnline={isConnected}
          isWarning={currentSt1 >= CO_THRESHOLD} 
        />
        <StationCard 
          name="TRẠM 2" 
          value={currentSt2} 
          isOnline={isConnected}
          isWarning={currentSt2 >= CO_THRESHOLD} 
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  iconBtn: { 
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' 
  },
  content: { padding: 16, paddingBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
});