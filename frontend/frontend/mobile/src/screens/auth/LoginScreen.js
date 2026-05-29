import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { colors, borderRadius } from '../../theme/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Vui lòng nhập email và mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể kết nối đến máy chủ!';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../../assets/app.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Box đăng nhập */}
            <View style={styles.card}>
              
              {errorMsg ? (
                <View style={styles.errorBox}>
                  <FontAwesome5 name="exclamation-circle" size={13} color={colors.danger} />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              <View style={styles.formSection}>
                <InputField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="admin@phenikaa.edu.vn"
                  keyboardType="email-address"
                />

                <InputField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                />

                <TouchableOpacity
                  style={styles.forgotLink}
                  onPress={() => {
                    setErrorMsg('');
                    navigation.navigate('ForgotPassword');
                  }}
                >
                  <Text style={styles.linkText}>Quên mật khẩu?</Text>
                </TouchableOpacity>

                <Button
                  title="Đăng nhập"
                  onPress={handleLogin}
                  loading={loading}
                  icon={<FontAwesome5 name="sign-in-alt" size={14} color="#ffffff" />}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.registerRow}>
                <Text style={styles.mutedText}>Chưa có tài khoản? </Text>
                <TouchableOpacity
                  onPress={() => {
                    setErrorMsg('');
                    navigation.navigate('Register');
                  }}
                >
                  <Text style={styles.linkText}>Đăng ký ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', 
    paddingTop: 250, 
    paddingHorizontal: 30, 
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(241, 253, 255, 0.1)',
    paddingHorizontal: 20, 
    paddingTop: 30, 
    paddingBottom: 20,   
    width: '100%',
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(110, 189, 245, 0.1)',
    borderRadius: borderRadius.sm,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    flex: 1,
  },
  formSection: {
    width: '100%',
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    marginTop: -5,
  },
  linkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 15,
    width: '100%',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mutedText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});