import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { resetPassword } from '../../services/authService';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { colors, borderRadius } from '../../theme/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Vui lòng nhập email!');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert('Thành công', 'Vui lòng kiểm tra email để nhận mật khẩu mới.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể gửi yêu câu!';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[colors.bgDarker, colors.bgDark]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <LinearGradient
              colors={[colors.warning, '#d97706']}
              style={styles.logoCircle}
            >
              <FontAwesome5 name="key" size={24} color="#fff" />
            </LinearGradient>

            <Text style={styles.title}>Khoi Phuc Mat Khau</Text>
            <Text style={styles.description}>
              Nhap email cua ban, he thong se gui mat khau moi.
            </Text>

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              keyboardType="email-address"
            />

            <Button title="Gửi yêu cầu" onPress={handleReset} variant="warning" loading={loading} />

            <TouchableOpacity style={styles.backLink} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Quay lai dang nhap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.panelBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 28,
    alignItems: 'center',
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.textMain,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  backLink: {
    marginTop: 20,
  },
  linkText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
