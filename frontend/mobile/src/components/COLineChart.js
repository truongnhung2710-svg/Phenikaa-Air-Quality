import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../theme/theme'; 

export default function COLineChart({ timeLabels, st1Data, st2Data }) {
  const { theme } = useTheme(); 

  if (!timeLabels || timeLabels.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
        <Text style={[styles.title, { color: theme.textMain }]}>Biểu đồ Realtime (2 Trạm)</Text>
        <Text style={[styles.noData, { color: theme.textMuted }]}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const MAX_POINTS = 5; 
  
  const recentLabels = timeLabels.slice(-MAX_POINTS);
  const recentSt1 = st1Data.slice(-MAX_POINTS);
  const recentSt2 = st2Data.slice(-MAX_POINTS);

  
  const safeData = (data, targetLength) => {
    if (!data || data.length === 0) return new Array(targetLength).fill(0);
    const mapped = data.map((v) => (v == null || isNaN(Number(v)) ? 0 : Number(v)));
    while (mapped.length < targetLength) {
      mapped.unshift(0); 
    }
    return mapped;
  };

  const st1Color = '#10b981'; 
  const st2Color = '#f59e0b'; 

  return (
    <View style={[styles.card, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textMain }]}>Biểu đồ Realtime (2 Trạm)</Text>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: st1Color }]} />
          <Text style={[styles.legendLabelTram, { color: theme.textMain }]}>Trạm 1</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: st2Color }]} />
          <Text style={[styles.legendLabelTram, { color: theme.textMain }]}>Trạm 2</Text>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <LineChart
          data={{
            labels: recentLabels,
            datasets: [
              { 
                data: safeData(recentSt1, recentLabels.length), 
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, 
                strokeWidth: 2, 
                strokeDashArray: [5, 5] 
              },
              { 
                data: safeData(recentSt2, recentLabels.length), 
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`, 
                strokeWidth: 2, 
                strokeDashArray: [5, 5] 
              },
              { 
              
                data: new Array(recentLabels.length).fill(30), 
                color: () => 'transparent', 
                strokeWidth: 0, 
                withDots: false 
              }
            ],
          }}
          width={Dimensions.get('window').width - 50} 
          height={220}
          yAxisLabel="" 
          yAxisSuffix="    "
          fromZero={true}
          segments={6} 
          withInnerLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          withOuterLines={false}
          withShadow={false}
          xAxisInnerPadding={0} 
        
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0, 
            color: () => theme.gridLine, 
            labelColor: () => theme.textMuted, 
            propsForLabels: {
              fontSize: 9,
              dx: 5, 
            },
            propsForDots: { 
              r: '4', 
              strokeWidth: '1.5', 
              stroke: theme.panelBg 
            },
          }}
          style={{
            marginLeft: 90, 
            paddingRight: 30,
            marginRight:5, 
            borderRadius: 12,
            marginTop: 10,
          }}
          bezier={false} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  header: { marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '600' },
  noData: { textAlign: 'center', paddingVertical: 40 },
  legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendLabelTram: { fontSize: 12, fontWeight: '600' },
  chartWrapper: {
    alignItems: 'center', 
    justifyContent: 'center',
    overflow: 'hidden'
  }
});