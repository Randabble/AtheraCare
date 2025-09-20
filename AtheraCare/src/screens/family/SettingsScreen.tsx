import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, List, Switch, Divider, Avatar, Chip } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

const FamilySettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [familySharing, setFamilySharing] = useState(true);
  const [alertPreferences, setAlertPreferences] = useState({
    missedMeds: true,
    lowActivity: true,
    lowHydration: false,
    lowSupply: true
  });

  // Mock family data - will come from Firestore
  const familyInfo = {
    name: 'Smith Family',
    inviteCode: 'SMITH2024',
    members: [
      { id: 'dad', name: 'Dad', role: 'senior', avatar: 'D' },
      { id: 'mom', name: 'Mom', role: 'senior', avatar: 'M' },
      { id: 'daughter', name: 'Sarah', role: 'family', avatar: 'S' },
      { id: 'son', name: 'Mike', role: 'family', avatar: 'M' }
    ]
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleLeaveFamily = () => {
    Alert.alert(
      'Leave Family',
      'Are you sure you want to leave this family? You will lose access to all family data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave Family',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Coming Soon', 'Family management features will be available in the next update.');
          },
        },
      ]
    );
  };

  const handleInviteFamily = () => {
    Alert.alert(
      'Invite Family Member',
      `Share this invite code with family members:\n\n${familyInfo.inviteCode}\n\nThey can use this code to join your family.`,
      [
        { text: 'Copy Code', onPress: () => Alert.alert('Copied!', 'Invite code copied to clipboard.') },
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const handleManageMember = (member: any) => {
    Alert.alert(
      `Manage ${member.name}`,
      `What would you like to do with ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Change Role', onPress: () => Alert.alert('Coming Soon', 'Role management will be available in the next update.') },
        { text: 'Remove Member', style: 'destructive', onPress: () => Alert.alert('Coming Soon', 'Member removal will be available in the next update.') }
      ]
    );
  };

  const toggleAlertPreference = (key: keyof typeof alertPreferences) => {
    setAlertPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        ⚙️ Family Settings
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Manage your family and preferences
      </Text>

      {/* Family Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Family Information
          </Text>
          
          <View style={styles.familyHeader}>
            <Avatar.Text 
              size={60} 
              label={familyInfo.name.charAt(0)}
              style={{ backgroundColor: '#007AFF' }}
            />
            <View style={styles.familyDetails}>
              <Text variant="headlineSmall" style={styles.familyName}>
                {familyInfo.name}
              </Text>
              <Text variant="bodyMedium" style={styles.memberCount}>
                {familyInfo.members.length} members
              </Text>
            </View>
          </View>

          <View style={styles.familyActions}>
            <Button
              mode="contained"
              onPress={handleInviteFamily}
              style={styles.actionButton}
              buttonColor="#007AFF"
              textColor="white"
              icon="account-plus"
            >
              Invite Member
            </Button>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Coming Soon', 'Family settings editing will be available in the next update. You\'ll be able to change family name, manage member roles, and update family preferences.')}
              style={styles.actionButton}
              buttonColor="#007AFF"
              textColor="#007AFF"
              icon="cog"
            >
              Edit Family
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Family Members */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Family Members
          </Text>
          
          {familyInfo.members.map((member) => (
            <View key={member.id}>
              <List.Item
                title={member.name}
                description={`Role: ${member.role === 'senior' ? 'Senior Member' : 'Family Member'}`}
                left={(props) => (
                  <Avatar.Text 
                    size={40} 
                    label={member.avatar}
                     style={{ backgroundColor: member.role === 'senior' ? '#FF9500' : '#007AFF' }}  
                  />
                )}
                right={(props) => (
                  <View style={styles.memberActions}>
                    <Chip 
                      style={[styles.roleChip, { 
                        backgroundColor: member.role === 'senior' ? '#FF9500' + '20' : '#007AFF' + '20' 
                      }]}
                      textStyle={{ 
                        color: member.role === 'senior' ? '#FF9500' : '#007AFF' 
                      }}
                    >
                      {member.role === 'senior' ? 'Senior' : 'Family'}
                    </Chip>
                    <Button
                      mode="text"
                      onPress={() => handleManageMember(member)}
                      style={styles.manageButton}
                      textColor="#007AFF"
                      icon="dots-vertical"
                    >
                      Manage
                    </Button>
                  </View>
                )}
                style={styles.memberItem}
              />
              <Divider />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Notifications
          </Text>
          
          <List.Item
            title="Push Notifications"
            description="Receive alerts about family updates"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Family Sharing"
            description="Share your progress with family"
            left={(props) => <List.Icon {...props} icon="share" />}
            right={() => (
              <Switch
                value={familySharing}
                onValueChange={setFamilySharing}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Alert Preferences */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Alert Preferences
          </Text>
          <Text variant="bodySmall" style={styles.sectionSubtitle}>
            Choose which alerts you want to receive
          </Text>
          
          <List.Item
            title="Missed Medications"
            description="When family members miss their meds"
            left={(props) => <List.Icon {...props} icon="pill" />}
            right={() => (
              <Switch
                value={alertPreferences.missedMeds}
                onValueChange={() => toggleAlertPreference('missedMeds')}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Low Activity"
            description="When family members are inactive"
            left={(props) => <List.Icon {...props} icon="walk" />}
            right={() => (
              <Switch
                value={alertPreferences.lowActivity}
                onValueChange={() => toggleAlertPreference('lowActivity')}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Low Hydration"
            description="When family members don't drink enough water"
            left={(props) => <List.Icon {...props} icon="water" />}
            right={() => (
              <Switch
                value={alertPreferences.lowHydration}
                onValueChange={() => toggleAlertPreference('lowHydration')}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Low Medication Supply"
            description="When medications are running low"
            left={(props) => <List.Icon {...props} icon="alert" />}
            right={() => (
              <Switch
                value={alertPreferences.lowSupply}
                onValueChange={() => toggleAlertPreference('lowSupply')}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Privacy & Data */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Privacy & Data
          </Text>
          
          <List.Item
            title="Data Export"
            description="Export your family's health data"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Data export will be available in the next update.')}
          />
          
          <Divider />
          
          <List.Item
            title="Privacy Settings"
            description="Control what information is shared"
            left={(props) => <List.Icon {...props} icon="shield" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available in the next update.')}
          />
        </Card.Content>
      </Card>

      {/* Account Actions */}
      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={handleLeaveFamily}
          style={styles.actionButton}
          buttonColor="#FF3B30"
          textColor="#FF3B30"
          icon="account-remove"
        >
          Leave Family
        </Button>
        
        <Button
          mode="contained"
          onPress={handleSignOut}
          style={[styles.actionButton, styles.signOutButton]}
          buttonColor="#FF3B30"
          textColor="white"
          icon="logout"
        >
          Sign Out
        </Button>
      </View>

      {/* App Info */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="bodySmall" style={styles.infoText}>
            AtheraCare v1.0.0
          </Text>
          <Text variant="bodySmall" style={styles.infoText}>
            Built with ❤️ for better family health
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
    fontWeight: '500',
  },
  sectionSubtitle: {
    color: '#666',
    marginBottom: 15,
    fontSize: 12,
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  familyDetails: {
    marginLeft: 15,
    flex: 1,
  },
  familyName: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  memberCount: {
    color: '#666',
  },
  familyActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  memberItem: {
    paddingVertical: 8,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleChip: {
    marginRight: 5,
  },
  manageButton: {
    minWidth: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
  infoCard: {
    marginBottom: 20,
    elevation: 1,
  },
  infoText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
  },
});

export default FamilySettingsScreen;
