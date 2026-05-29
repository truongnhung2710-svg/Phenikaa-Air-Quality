import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../theme/theme'; 
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme(); //  LẤY BIẾN THEME

  if (isLoading) {
    return (
      // Dùng theme.bgDarker thay vì colors.bgDarker
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bgDarker }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}