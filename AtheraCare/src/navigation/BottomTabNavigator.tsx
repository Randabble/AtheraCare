import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Import screens (we'll create these next)
import HomeScreen from '../screens/tabs/HomeScreen';
import MedsScreen from '../screens/tabs/MedsScreen';
import WaterScreen from '../screens/tabs/WaterScreen';
import StepsScreen from '../screens/tabs/StepsScreen';
import SettingsScreen from '../screens/tabs/SettingsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🏠</Text>
          ),
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="Meds"
        component={MedsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💊</Text>
          ),
          title: 'Medications',
        }}
      />
      <Tab.Screen
        name="Water"
        component={WaterScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💧</Text>
          ),
          title: 'Hydration',
        }}
      />
      <Tab.Screen
        name="Steps"
        component={StepsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👟</Text>
          ),
          title: 'Activity',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>⚙️</Text>
          ),
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
