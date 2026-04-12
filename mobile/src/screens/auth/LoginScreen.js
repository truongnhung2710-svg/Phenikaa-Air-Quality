import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Vui long nhap email va mat khau!');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const msg = err.response?.data?.message || 'Khong the ket noi den may chu!';
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
            {/* Header centered */}
            <View style={styles.headerSection}>
              <LinearGradient
                colors={[colors.primary, '#2563eb']}
                style={styles.logoCircle}
              >
                <FontAwesome5 name="wind" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.title}>Phenikaa CO System</Text>
              <Text style={styles.subtitle}>He thong giam sat khi CO</Text>
            </View>

            {errorMsg ? (
              <View style={styles.errorBox}>
                <FontAwesome5 name="exclamation-circle" size={13} color={colors.danger} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Form full width */}
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
                <Text style={styles.linkText}>Quen mat khau?</Text>
              </TouchableOpacity>

              <Button
                title="Dang nhap"
                onPress={handleLogin}
                loading={loading}
                icon={<FontAwesome5 name="sign-in-alt" size={14} color="#fff" />}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.registerRow}>
              <Text style={styles.mutedText}>Chua co tai khoan? </Text>
              <TouchableOpacity
                onPress={() => {
                  setErrorMsg('');
                  navigation.navigate('Register');
                }}
              >
                <Text style={styles.linkText}>Dang ky ngay</Text>
              </TouchableOpacity>
            </View>
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
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    color: colors.textMain,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: borderRadius.sm,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    flex: 1,
  },
  formSection: {
    width: '100%',
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.panelBorder,
    marginVertical: 20,
    width: '100%',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mutedText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
