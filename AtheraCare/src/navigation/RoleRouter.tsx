import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../utils/users';
import SeniorTabs from './SeniorTabs';
import FamilyTabs from './FamilyTabs';

export type UserRole = 'senior' | 'family';

const RoleRouter: React.FC = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserRole();
    }
  }, [user]);

  const loadUserRole = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userProfile = await getUserProfile(user.uid);
      
      if (userProfile?.preferences?.role) {
        setUserRole(userProfile.preferences.role as UserRole);
      } else {
        // Default to senior if no role is set
        setUserRole('senior');
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      // Default to senior on error
      setUserRole('senior');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Loading your experience...</Text>
      </View>
    );
  }

  if (userRole === 'family') {
    return <FamilyTabs />;
  }

  // Default to senior
  return <SeniorTabs />;
};

export default RoleRouter;
