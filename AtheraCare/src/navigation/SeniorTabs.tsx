import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import senior screens
import HomeScreen from '../screens/senior/HomeScreen';
import MedsScreen from '../screens/senior/MedsScreen';
import WaterScreen from '../screens/senior/WaterScreen';
import ActivityTrackerScreen from '../screens/senior/ActivityTrackerScreen';
import SettingsScreen from '../screens/senior/SettingsScreen';

const Tab = createBottomTabNavigator();

const SeniorTabs: React.FC = () => {
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
        name="Activity"
        component={ActivityTrackerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📊</Text>
          ),
          title: 'Activity',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color }}>⚙️</Text>
          ),
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default SeniorTabs;
