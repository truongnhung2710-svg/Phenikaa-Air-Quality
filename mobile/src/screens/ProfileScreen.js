import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { getUserEmail } from '../utils/storage';
import * as userService from '../services/userService';
import GlassPanel from '../components/GlassPanel';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors } from '../theme/theme';

export default function ProfileScreen() {
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

  const handleUpdateInfo = async () => {
    setInfoMessage({ text: '', type: '' });
    setInfoLoading(true);
    try {
      const email = await getUserEmail();
      await userService.updateProfile({ email, name: editName, phone: editPhone });
      setInfoMessage({ text: 'Cap nhat thong tin thanh cong!', type: 'success' });
      updateUser({ name: editName, phone: editPhone });
    } catch (err) {
      const msg = err.response?.data?.message || 'Cap nhat that bai!';
      setInfoMessage({ text: msg, type: 'error' });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPassMessage({ text: '', type: '' });
    if (newPassword !== confirmPassword) {
      setPassMessage({ text: 'Mat khau xac nhan khong khop!', type: 'error' });
      return;
    }
    setPassLoading(true);
    try {
      const email = await getUserEmail();
      await userService.changePassword(email, oldPassword, newPassword);
      setPassMessage({ text: 'Doi mat khau thanh cong!', type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Doi mat khau that bai!';
      setPassMessage({ text: msg, type: 'error' });
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Dang xuat', 'Ban co chac chan muon dang xuat?', [
      { text: 'Huy', style: 'cancel' },
      { text: 'Dang xuat', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <LinearGradient colors={[colors.bgDarker, colors.bgDark]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.pageTitle}>Ho So Ca Nhan & Bao Mat</Text>

            {/* Personal Info */}
            <GlassPanel style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="id-card" size={16} color={colors.textMain} />
                <Text style={styles.sectionTitle}> Thong Tin Ca Nhan</Text>
              </View>

              {infoMessage.text ? (
                <View
                  style={[
                    styles.message,
                    {
                      borderColor:
                        infoMessage.type === 'success' ? colors.success : colors.danger,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        infoMessage.type === 'success' ? colors.success : colors.danger,
                      fontSize: 13,
                    }}
                  >
                    {infoMessage.text}
                  </Text>
                </View>
              ) : null}

              <InputField
                label="Tai khoan Email"
                value={user?.email || ''}
                editable={false}
              />
              <InputField
                label="Ho va Ten"
                value={editName}
                onChangeText={setEditName}
              />
              <InputField
                label="So dien thoai"
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Nhap so dien thoai..."
                keyboardType="phone-pad"
              />

              <Button
                title="Luu thay doi"
                onPress={handleUpdateInfo}
                loading={infoLoading}
                icon={<FontAwesome5 name="save" size={14} color="#fff" />}
              />
            </GlassPanel>

            {/* Change Password */}
            <GlassPanel style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="lock" size={16} color={colors.textMain} />
                <Text style={styles.sectionTitle}> Doi Mat Khau</Text>
              </View>

              {passMessage.text ? (
                <View
                  style={[
                    styles.message,
                    {
                      borderColor:
                        passMessage.type === 'success' ? colors.success : colors.danger,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        passMessage.type === 'success' ? colors.success : colors.danger,
                      fontSize: 13,
                    }}
                  >
                    {passMessage.text}
                  </Text>
                </View>
              ) : null}

              <InputField
                label="Mat khau hien tai"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
                placeholder="••••••••"
              />
              <InputField
                label="Mat khau moi"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="••••••••"
              />
              <InputField
                label="Xac nhan mat khau"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="••••••••"
              />

              <Button
                title="Doi mat khau"
                onPress={handleChangePassword}
                variant="warning"
                loading={passLoading}
                icon={<FontAwesome5 name="key" size={14} color="#000" />}
              />
            </GlassPanel>

            {/* Logout */}
            <Button
              title="Dang xuat"
              onPress={handleLogout}
              variant="danger"
              icon={<FontAwesome5 name="sign-out-alt" size={14} color="#fff" />}
              style={{ marginTop: 8 }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    color: colors.textMain,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.panelBorder,
  },
  sectionTitle: {
    color: colors.textMain,
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    padding: 10,
    marginBottom: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
});
