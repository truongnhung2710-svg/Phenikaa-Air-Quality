import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';
import GlassPanel from './GlassPanel';
import { colors, borderRadius } from '../theme/theme';

export default function FilterBar({
  filters = [],
  buttons = [],
}) {
  return (
    <GlassPanel>
      <View style={styles.filtersRow}>
        {filters.map((filter, idx) => (
          <View key={idx} style={styles.filterGroup}>
            <Text style={styles.label}>{filter.label}</Text>
            {filter.type === 'picker' ? (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={filter.value}
                  onValueChange={filter.onChange}
                  style={styles.picker}
                  dropdownIconColor={colors.textMuted}
                >
                  {filter.options.map((opt) => (
                    <Picker.Item
                      key={opt.value}
                      label={opt.label}
                      value={opt.value}
                      color={Platform.OS === 'ios' ? colors.textMain : undefined}
                    />
                  ))}
                </Picker>
              </View>
            ) : filter.type === 'date' ? (
              <TouchableOpacity style={styles.dateInput} onPress={filter.onPress}>
                <Text style={styles.dateText}>{filter.value || 'Chon ngay'}</Text>
                <FontAwesome5 name="calendar-alt" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
      {buttons.length > 0 && (
        <View style={styles.buttonsRow}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.btn, { backgroundColor: btn.color || colors.primary }]}
              onPress={btn.onPress}
            >
              {btn.icon && <FontAwesome5 name={btn.icon} size={13} color="#fff" />}
              <Text style={styles.btnText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  filtersRow: {
    gap: 12,
  },
  filterGroup: {
    marginBottom: 4,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  picker: {
    color: colors.textMain,
    height: 44,
  },
  dateInput: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateText: {
    color: colors.textMain,
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.sm,
    flex: 1,
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
