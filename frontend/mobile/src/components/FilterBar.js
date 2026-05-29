import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { useTheme } from '../theme/theme'; 


const PlatformAwarePicker = ({ filter, theme }) => {
  const [modalVisible, setModalVisible] = useState(false);

  if (Platform.OS === 'ios') {
    const selectedLabel = filter.options.find(opt => opt.value === filter.value)?.label;
    return (
      <>
        <TouchableOpacity
          style={[styles.iosPickerTrigger, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: theme.textMain, fontSize: 14 }}>{selectedLabel || 'Chọn...'}</Text>
          <FontAwesome5 name="chevron-down" size={12} color={theme.textMuted} />
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.panelBg }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.inputBorder }]}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={{ color: theme.primary, fontSize: 16, fontWeight: 'bold' }}>Xong</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={filter.value}
                onValueChange={(val) => filter.onChange(val)}
                itemStyle={{ color: theme.textMain }}
              >
                {filter.options.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <View style={[styles.pickerWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
      <Picker
        selectedValue={filter.value}
        onValueChange={filter.onChange}
        style={{ color: theme.textMain, height: 44 }}
        dropdownIconColor={theme.textMuted}
      >
        {filter.options.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} color={Platform.OS === 'android' ? '#000' : undefined} />
        ))}
      </Picker>
    </View>
  );
};


const PlatformAwareDatePicker = ({ filter, theme }) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShow(false); 
    if (selectedDate) filter.onChange(selectedDate);
  };


  const formatDate = (date) => {
    if (!date) return 'Chọn ngày';
    const d = new Date(date);
    return `${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear()}`;
  };

  return (
    <View>
      <TouchableOpacity 
        style={[styles.dateInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]} 
        onPress={() => setShow(true)}
      >
        <Text style={{ color: theme.textMain, fontSize: 14 }}>{formatDate(filter.value)}</Text>
        <FontAwesome5 name="calendar-alt" size={14} color={theme.textMuted} />
      </TouchableOpacity>

      
      {Platform.OS === 'ios' && show ? (
        <Modal transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.panelBg }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.inputBorder }]}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={{ color: theme.primary, fontSize: 16, fontWeight: 'bold' }}>Xong</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={filter.value || new Date()}
                mode="date"
                display="spinner"
                onChange={onChange}
                textColor={theme.textMain}
              />
            </View>
          </View>
        </Modal>
      ) : show ? (
        
        <DateTimePicker
          value={filter.value || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      ) : null}
    </View>
  );
};


export default function FilterBar({ filters = [], buttons = [] }) {
  const { theme } = useTheme(); 

  return (
    <View style={[styles.card, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
      
     
      <View style={styles.filtersRow}>
        {filters.map((filter, idx) => (
          <View 
            key={idx} 
            style={[
              styles.filterGroup, 
              
              filter.type === 'picker' ? { width: '100%' } : { width: '48%' } 
            ]}
          >
            <Text style={[styles.label, { color: theme.textMuted }]}>{filter.label}</Text>
            
            {filter.type === 'picker' ? (
              <PlatformAwarePicker filter={filter} theme={theme} />
            ) : filter.type === 'date' ? (
              <PlatformAwareDatePicker filter={filter} theme={theme} />
            ) : null}
          </View>
        ))}
      </View>

      {buttons.length > 0 && (
        <View style={styles.buttonsRow}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.btn, { backgroundColor: btn.color || theme.primary }]}
              onPress={btn.onPress}
            >
              {btn.icon && <FontAwesome5 name={btn.icon} size={13} color="#fff" />}
              <Text style={styles.btnText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  filtersRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  filterGroup: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  pickerWrapper: { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  iosPickerTrigger: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, borderWidth: 1, borderRadius: 8 },
  dateInput: { height: 44, borderWidth: 1, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14 },
  buttonsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, flex: 1, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { paddingBottom: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16, borderBottomWidth: 1 }
});