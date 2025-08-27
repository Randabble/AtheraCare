import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import family screens
import FeedScreen from '../screens/family/FeedScreen';
import MemberScreen from '../screens/family/MemberScreen';
import MessagesScreen from '../screens/family/MessagesScreen';
import AlertsScreen from '../screens/family/AlertsScreen';
import SettingsScreen from '../screens/family/SettingsScreen';

const Tab = createBottomTabNavigator();

const FamilyTabs: React.FC = () => {
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
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📱</Text>
          ),
          title: 'Feed',
        }}
      />
      <Tab.Screen
        name="Member"
        component={MemberScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👥</Text>
          ),
          title: 'Members',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💬</Text>
          ),
          title: 'Messages',
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🔔</Text>
          ),
          title: 'Alerts',
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

export default FamilyTabs;
