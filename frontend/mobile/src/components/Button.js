import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../theme/theme';

const VARIANTS = {
  primary: colors.primary,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  style,
  textStyle,
  icon,
}) {
  const bgColor = VARIANTS[variant] || colors.primary;
  const textColor = variant === 'warning' ? '#000' : '#fff';

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: borderRadius.sm,
    gap: 8,
    width: '100%',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
});
