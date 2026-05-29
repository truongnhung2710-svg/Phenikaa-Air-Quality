import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/theme'; 

export default function StationCard({ name, value, isOnline = true, isWarning = false }) {
  const { theme } = useTheme(); // Lấy biến đổi màu

  let statusText = "Tốt";
  let statusColor = "#10b981"; 
  let needleRotation = -90; 

  if (value < 10) {
    statusText = "Tốt"; statusColor = "#10b981";
    needleRotation = -90 + (value / 10) * 45; 
  } else if (value < 25) {
    statusText = "Trung bình"; statusColor = "#facc15";
    needleRotation = -45 + ((value - 10) / 15) * 45;
  } else if (value < 50) {
    statusText = "Kém"; statusColor = "#f97316";
    needleRotation = 0 + ((value - 25) / 25) * 45;
  } else {
    statusText = "Nguy hiểm"; statusColor = "#ef4444";
    let maxVal = Math.min(value, 100); 
    needleRotation = 45 + ((maxVal - 50) / 50) * 45;
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.panelBg, borderColor: isWarning ? '#ef4444' : theme.panelBorder }]}>
      <View style={styles.topSection}>
        
        <View style={styles.leftInfo}>
          <Text style={[styles.stationName, { color: theme.textMain }]}>{name}</Text>
          <View style={[styles.pill, { backgroundColor: isOnline ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }]}>
            <Text style={[styles.pillText, { color: isOnline ? '#10b981' : '#ef4444' }]}>
              {isOnline ? 'ĐANG HOẠT ĐỘNG' : 'MẤT KẾT NỐI'}
            </Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={[styles.valueText, { color: theme.textMain }]}>{value}</Text>
            <Text style={[styles.unitText, { color: theme.textMuted }]}>ppm</Text>
          </View>
          <Text style={[styles.timeText, { color: theme.textMuted }]}>
            <FontAwesome5 name="clock" size={10} color={theme.textMuted} /> Cập nhật: Vừa xong
          </Text>
        </View>

        <View style={styles.rightGauge}>
          <View style={styles.gaugeContainer}>
            <View style={styles.halfCircleMask}>
              <LinearGradient
                colors={['#10b981', '#facc15', '#f97316', '#ef4444']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientCircle}
              />
              {/* LÕI ĐƯỢC TÔ MÀU TRÙNG VỚI NỀN THẺ THEO THEME ĐỂ TÀNG HÌNH */}
              <View style={[styles.innerMask, { backgroundColor: theme.panelBg }]} />
            </View>

            <View style={[styles.needleWrapper, { transform: [{ rotate: `${needleRotation}deg` }] }]}>
              {/* KIM CHỈ NAM CHUYỂN MÀU THEO CHỮ (Đen/Trắng) */}
              <View style={[styles.needle, { backgroundColor: theme.textMain }]} />
            </View>
            <View style={[styles.centerDot, { backgroundColor: statusColor }]} />
          </View>
          
          <Text style={[styles.gaugeSubText, { color: theme.textMuted }]}>Chất lượng KK</Text>
          <Text style={[styles.gaugeMainText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.panelBorder }]}>
        <LegendItem color="#10b981" label="Tốt" theme={theme} />
        <LegendItem color="#facc15" label="Trung bình" theme={theme} />
        <LegendItem color="#f97316" label="Kém" theme={theme} />
        <LegendItem color="#ef4444" label="Nguy hiểm" theme={theme} />
      </View>
    </View>
  );
}

// Sub component cần nhận biến theme để đổi màu chữ tương ứng
const LegendItem = ({ color, label, theme }) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={[styles.legendText, { color: theme.textMuted }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  topSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  leftInfo: { flex: 1 },
  stationName: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 10 },
  pillText: { fontSize: 10, fontWeight: 'bold' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 6 },
  valueText: { fontSize: 36, fontWeight: 'bold' },
  unitText: { fontSize: 14 },
  timeText: { fontSize: 11 },
  
  rightGauge: { alignItems: 'center', justifyContent: 'flex-start', width: 120, paddingTop: 10 },
  gaugeContainer: { width: 110, height: 55, position: 'relative', alignItems: 'center' },
  halfCircleMask: { width: 110, height: 55, overflow: 'hidden', position: 'relative' },
  gradientCircle: { width: 110, height: 110, borderRadius: 55 },
  innerMask: { width: 84, height: 84, borderRadius: 42, position: 'absolute', top: 13, left: 13 },
  
  needleWrapper: { width: 110, height: 110, position: 'absolute', top: 0, alignItems: 'center' },
  needle: { width: 4, height: 40, borderRadius: 2, marginTop: 9 },
  centerDot: { width: 16, height: 16, borderRadius: 8, position: 'absolute', bottom: -8 },
  
  gaugeSubText: { fontSize: 10, marginTop: 12, textTransform: 'uppercase' },
  gaugeMainText: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10 },
});