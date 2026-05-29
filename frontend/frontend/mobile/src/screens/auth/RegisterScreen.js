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
import { useAuth } from '../../hooks/useAuth';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { colors, borderRadius } from '../../theme/theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      Alert.alert('Thành công', 'Đăng ký thành công! Vui lòng đăng nhập.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại!';
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
              colors={[colors.success, '#059669']}
              style={styles.logoCircle}
            >
              <FontAwesome5 name="user-plus" size={24} color="#fff" />
            </LinearGradient>

            <Text style={styles.title}>Dang Ky Tai Khoan</Text>

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <InputField label="Họ và tên" value={name} onChangeText={setName} placeholder="Nguyen Van A" />
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              keyboardType="email-address"
            />
            <InputField
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <Button title="Đăng ký" onPress={handleRegister} variant="success" loading={loading} />

            <TouchableOpacity style={styles.backLink} onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.linkText, { color: colors.success }]}>Dang nhap</Text>
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
    fontSize: 14,
    fontWeight: '500',
  },
});
