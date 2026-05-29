import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { getUserEmail } from '../utils/storage';
import * as userService from '../services/userService';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useTheme } from '../theme/theme'; 

export default function ProfileScreen() {
  const { theme } = useTheme(); 
  const { user, logout, updateUser } = useAuth();

  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [infoMessage, setInfoMessage] = useState({ text: '', type: '' });
  const [infoLoading, setInfoLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState({ text: '', type: '' });
  const [passLoading, setPassLoading] = useState(false);

  const handleUpdateInfo = async () => { /* Giữ nguyên logic */ };
  const handleChangePassword = async () => { /* Giữ nguyên logic */ };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.bgDark }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.pageTitle, { color: theme.textMain }]}>Hồ Sơ Cá Nhân & Bảo Mật</Text>

          
          <View style={[styles.section, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
            <View style={[styles.sectionHeader, { borderBottomColor: theme.panelBorder }]}>
              <FontAwesome5 name="id-card" size={16} color={theme.textMain} />
              <Text style={[styles.sectionTitle, { color: theme.textMain }]}> Thông Tin Cá Nhân</Text>
            </View>

            {infoMessage.text ? (
              <View style={[styles.message, { borderColor: infoMessage.type === 'success' ? theme.success : theme.danger }]}>
                <Text style={{ color: infoMessage.type === 'success' ? theme.success : theme.danger, fontSize: 13 }}>{infoMessage.text}</Text>
              </View>
            ) : null}

            <InputField label="Tài khoản Email" value={user?.email || ''} editable={false} />
            <InputField label="Họ và Tên" value={editName} onChangeText={setEditName} />
            <InputField label="Số điện thoại" value={editPhone} onChangeText={setEditPhone} placeholder="Nhập số điện thoại..." keyboardType="phone-pad" />

            <Button title="Lưu thay đổi" onPress={handleUpdateInfo} loading={infoLoading} icon={<FontAwesome5 name="save" size={14} color="#fff" />} />
          </View>

          {/* Change Password */}
          <View style={[styles.section, { backgroundColor: theme.panelBg, borderColor: theme.panelBorder }]}>
            <View style={[styles.sectionHeader, { borderBottomColor: theme.panelBorder }]}>
              <FontAwesome5 name="lock" size={16} color={theme.textMain} />
              <Text style={[styles.sectionTitle, { color: theme.textMain }]}> Đổi Mật Khẩu</Text>
            </View>

            {passMessage.text ? (
              <View style={[styles.message, { borderColor: passMessage.type === 'success' ? theme.success : theme.danger }]}>
                <Text style={{ color: passMessage.type === 'success' ? theme.success : theme.danger, fontSize: 13 }}>{passMessage.text}</Text>
              </View>
            ) : null}

            <InputField label="Mật khẩu hiện tại" value={oldPassword} onChangeText={setOldPassword} secureTextEntry placeholder="••••••••" />
            <InputField label="Mật khẩu mới" value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="••••••••" />
            <InputField label="Xác nhận mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="••••••••" />

            <Button title="Đổi mật khẩu" onPress={handleChangePassword} variant="warning" loading={passLoading} icon={<FontAwesome5 name="key" size={14} color="#000" />} />
          </View>

          <Button title="Đăng xuất" onPress={handleLogout} variant="danger" icon={<FontAwesome5 name="sign-out-alt" size={14} color="#fff" />} style={{ marginTop: 8 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  section: { padding: 20, borderRadius: 12, borderWidth: 1, marginBottom: 16 }, 
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 10, borderBottomWidth: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  message: { padding: 10, marginBottom: 14, borderRadius: 6, borderWidth: 1 },
});