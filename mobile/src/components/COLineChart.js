import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import GlassPanel from './GlassPanel';
import { colors } from '../theme/theme';

const screenWidth = Dimensions.get('window').width - 48;

export default function COLineChart({ timeLabels, st1Data, st2Data }) {
  if (!timeLabels || timeLabels.length === 0) {
    return (
      <GlassPanel>
        <Text style={styles.title}>Bieu do Realtime (2 Tram)</Text>
        <Text style={styles.noData}>Dang tai du lieu...</Text>
      </GlassPanel>
    );
  }

  const labels = timeLabels.map((t) => {
    const parts = t.split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : t;
  });

  const safeData = (data) => data.map((v) => (v == null ? 0 : v));

  return (
    <GlassPanel>
      <Text style={styles.title}>Bieu do Realtime (2 Tram)</Text>
      <LineChart
        data={{
          labels: labels.filter((_, i) => i % 3 === 0),
          datasets: [
            {
              data: safeData(st1Data),
              color: () => colors.primary,
              strokeWidth: 2,
            },
            {
              data: safeData(st2Data),
              color: () => colors.warning,
              strokeWidth: 2,
            },
          ],
          legend: ['Tram 1 (ppm)', 'Tram 2 (ppm)'],
        }}
        width={screenWidth}
        height={220}
        yAxisSuffix=""
        fromZero
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: 'rgba(30, 41, 59, 0.0)',
          backgroundGradientTo: 'rgba(30, 41, 59, 0.0)',
          decimalCount: 1,
          color: (opacity = 1) => `rgba(248, 250, 252, ${opacity})`,
          labelColor: () => colors.textMuted,
          propsForDots: { r: '3', strokeWidth: '1' },
          propsForBackgroundLines: {
            stroke: 'rgba(255,255,255,0.05)',
          },
        }}
        bezier
        style={styles.chart}
      />
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textMain,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  noData: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 40,
  },
  chart: {
    borderRadius: 12,
    marginLeft: -16,
  },
});
