import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../theme/theme'; 

import DashboardScreen from '../screens/DashboardScreen';
import ManagementScreen from '../screens/ManagementScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
       
        tabBarStyle: {
          backgroundColor: theme.bgDark,     
          borderTopColor: theme.panelBorder,  
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Trang Chủ',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size - 4} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Management"
        component={ManagementScreen}
        options={{
          tabBarLabel: 'Quản Lý',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="server" size={size - 4} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Lịch Sử',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="history" size={size - 4} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Hồ Sơ',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size - 4} color={color} /> 
          ),
        }}
      />
    </Tab.Navigator>
  );
}