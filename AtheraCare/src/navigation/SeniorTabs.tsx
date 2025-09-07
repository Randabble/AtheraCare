import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import senior screens
import HomeScreen from '../screens/senior/HomeScreen';
import MedsScreen from '../screens/senior/MedsScreen';
import WaterScreen from '../screens/senior/WaterScreen';
import ActivityTrackerScreen from '../screens/senior/ActivityTrackerScreen';
import ProfileScreen from '../screens/senior/ProfileScreen';
import SettingsScreen from '../screens/senior/SettingsScreen';
import { HomeIcon, MedicationIcon, WaterIcon, ActivityIcon, ProfileIcon, SettingsIcon } from '../components/icons/ModernIcons';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const SeniorTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.cardBorder,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="Meds"
        component={MedsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MedicationIcon size={size} color={color} />
          ),
          title: 'Medications',
        }}
      />
      <Tab.Screen
        name="Water"
        component={WaterScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <WaterIcon size={size} color={color} />
          ),
          title: 'Hydration',
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityTrackerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ActivityIcon size={size} color={color} />
          ),
          title: 'Activity',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon size={size} color={color} />
          ),
          title: 'Profile',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon size={size} color={color} />
          ),
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default SeniorTabs;
