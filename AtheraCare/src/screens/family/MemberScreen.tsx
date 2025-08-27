import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Avatar, Chip, useTheme, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for now
const mockFamilyMembers = [
  {
    id: '1',
    name: 'Dad',
    role: 'senior',
    avatar: 'D',
    recentWins: [
      { type: 'water', message: 'Hit water goal', date: 'Today' },
      { type: 'med', message: 'Took all meds', date: 'Yesterday' },
      { type: 'steps', message: 'Reached step goal', date: '2 days ago' }
    ],
    streaks: {
      meds: 7,
      water: 5,
      steps: 3
    }
  },
  {
    id: '2',
    name: 'Mom',
    role: 'senior',
    avatar: 'M',
    recentWins: [
      { type: 'steps', message: 'Reached step goal', date: 'Today' },
      { type: 'water', message: 'Hit water goal', date: 'Yesterday' }
    ],
    streaks: {
      meds: 3,
      water: 4,
      steps: 6
    }
  }
];

const MemberScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [selectedMember, setSelectedMember] = useState(mockFamilyMembers[0]);
  const [viewMode, setViewMode] = useState('wins');

  const handleMemberSelect = (member: any) => {
    setSelectedMember(member);
  };

  const getWinIcon = (type: string) => {
    switch (type) {
      case 'water': return '💧';
      case 'steps': return '👟';
      case 'med': return '💊';
      default: return '🎉';
    }
  };

  const getWinColor = (type: string) => {
    switch (type) {
      case 'water': return '#007AFF';
      case 'steps': return '#4CAF50';
      case 'med': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const sendMessage = () => {
    Alert.alert(
      'Send Message',
      `Send a message to ${selectedMember.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => Alert.alert('Message Sent!', 'Your message has been sent.') 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        👥 Family Members
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Check in on your family's progress
      </Text>

      {/* Member Selection */}
      <Card style={styles.selectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Select Family Member
          </Text>
          <View style={styles.memberButtons}>
            {mockFamilyMembers.map((member) => (
              <Button
                key={member.id}
                mode={selectedMember.id === member.id ? 'contained' : 'outlined'}
                onPress={() => handleMemberSelect(member)}
                style={styles.memberButton}
                icon={() => (
                  <Avatar.Text 
                    size={24} 
                    label={member.avatar}
                    style={{ backgroundColor: selectedMember.id === member.id ? 'white' : theme.colors.primary }}
                  />
                )}
              >
                {member.name}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Selected Member Profile */}
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={60} 
              label={selectedMember.avatar}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.memberName}>
                {selectedMember.name}
              </Text>
              <Text variant="bodyMedium" style={styles.memberRole}>
                {selectedMember.role === 'senior' ? 'Senior Member' : 'Family Member'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* View Mode Toggle */}
      <Card style={styles.toggleCard}>
        <Card.Content>
          <SegmentedButtons
            value={viewMode}
            onValueChange={setViewMode}
            buttons={[
              { value: 'wins', label: 'Recent Wins' },
              { value: 'streaks', label: 'Streaks' }
            ]}
          />
        </Card.Content>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'wins' ? (
        <Card style={styles.contentCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Wins
            </Text>
            {selectedMember.recentWins.length === 0 ? (
              <Text variant="bodyMedium" style={styles.emptyText}>
                No recent wins to show.
              </Text>
            ) : (
              selectedMember.recentWins.map((win, index) => (
                <View key={index} style={styles.winItem}>
                  <View style={styles.winIcon}>
                    <Text style={styles.winEmoji}>{getWinIcon(win.type)}</Text>
                  </View>
                  <View style={styles.winDetails}>
                    <Text variant="bodyLarge" style={styles.winMessage}>
                      {win.message}
                    </Text>
                    <Text variant="bodySmall" style={styles.winDate}>
                      {win.date}
                    </Text>
                  </View>
                  <Chip 
                    style={[styles.winType, { backgroundColor: getWinColor(win.type) + '20' }]}
                    textStyle={{ color: getWinColor(win.type) }}
                  >
                    {win.type.charAt(0).toUpperCase() + win.type.slice(1)}
                  </Chip>
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.contentCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Current Streaks
            </Text>
            <View style={styles.streaksContainer}>
              <View style={styles.streakItem}>
                <Text variant="headlineLarge" style={styles.streakNumber}>
                  {selectedMember.streaks.meds}
                </Text>
                <Text variant="bodyMedium" style={styles.streakLabel}>
                  Days taking meds
                </Text>
              </View>
              <View style={styles.streakItem}>
                <Text variant="headlineLarge" style={styles.streakNumber}>
                  {selectedMember.streaks.water}
                </Text>
                <Text variant="bodyMedium" style={styles.streakLabel}>
                  Days hitting water goal
                </Text>
              </View>
              <View style={styles.streakItem}>
                <Text variant="headlineLarge" style={styles.streakNumber}>
                  {selectedMember.streaks.steps}
                </Text>
                <Text variant="bodyMedium" style={styles.streakLabel}>
                  Days hitting step goal
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={sendMessage}
          style={styles.actionButton}
          icon="message"
        >
          Send Message
        </Button>
        <Button
          mode="outlined"
          onPress={() => Alert.alert('Coming Soon', 'More member management features coming soon!')}
          style={styles.actionButton}
          icon="cog"
        >
          Manage Member
        </Button>
      </View>
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
  selectionCard: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
    fontWeight: '500',
  },
  memberButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  memberButton: {
    flex: 1,
  },
  profileCard: {
    marginBottom: 20,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  profileInfo: {
    flex: 1,
  },
  memberName: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  memberRole: {
    color: '#666',
  },
  toggleCard: {
    marginBottom: 20,
    elevation: 2,
  },
  contentCard: {
    marginBottom: 20,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  winItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  winIcon: {
    marginRight: 15,
  },
  winEmoji: {
    fontSize: 24,
  },
  winDetails: {
    flex: 1,
  },
  winMessage: {
    color: '#333',
    marginBottom: 2,
  },
  winDate: {
    color: '#666',
    fontSize: 12,
  },
  winType: {
    marginLeft: 10,
  },
  streaksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakNumber: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  streakLabel: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});

export default MemberScreen;
