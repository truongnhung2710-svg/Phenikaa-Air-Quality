import React from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealtimeData } from '../hooks/useRealtimeData';
import StatCard from '../components/StatCard';
import StationCard from '../components/StationCard';
import COLineChart from '../components/COLineChart';
import LoadingOverlay from '../components/LoadingOverlay';
import { colors } from '../theme/theme';
import { CO_THRESHOLD } from '../utils/constants';

export default function DashboardScreen() {
  const {
    timeLabels,
    st1Data,
    st2Data,
    currentSt1,
    currentSt2,
    warningsCount,
    isLoading,
    refresh,
  } = useRealtimeData(true);

  const [refreshing, setRefreshing] = React.useState(false);

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
          <Text style={styles.pageTitle}>Tong Quan He Thong</Text>

          <View style={styles.statsGrid}>
            <StatCard icon="broadcast-tower" colorKey="blue" title="Tong tram" value="2" />
            <StatCard icon="check" colorKey="green" title="Online" value="2" />
          </View>
          <View style={styles.statsGrid}>
            <StatCard icon="power-off" colorKey="gray" title="Offline" value="0" />
            <StatCard icon="exclamation-triangle" colorKey="yellow" title="Canh bao" value={warningsCount.toString()} />
          </View>

          <COLineChart timeLabels={timeLabels} st1Data={st1Data} st2Data={st2Data} />

          <Text style={styles.sectionTitle}>Trang Thai Cac Tram</Text>
          <StationCard name="TRAM 1" value={currentSt1} isWarning={currentSt1 >= CO_THRESHOLD} />
          <StationCard name="TRAM 2" value={currentSt2} isWarning={currentSt2 >= CO_THRESHOLD} />
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
  sectionTitle: {
    color: colors.textMain,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
});
