import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, Card, Button, Avatar, Chip, useTheme, FAB } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for now - will be replaced with real Firestore data
const mockShares = [
  {
    id: '1',
    type: 'water',
    ownerName: 'Dad',
    message: 'Hit my water goal today! 💧',
    timestamp: '2 hours ago',
    reactions: [
      { id: '1', userId: 'mom', userName: 'Mom', type: 'emoji', text: '🎉' },
      { id: '2', userId: 'daughter', userName: 'Sarah', type: 'text', text: 'Great job, Dad!' }
    ]
  },
  {
    id: '2',
    type: 'steps',
    ownerName: 'Mom',
    message: 'Reached my step goal! 👟',
    timestamp: '4 hours ago',
    reactions: [
      { id: '3', userId: 'dad', userName: 'Dad', type: 'emoji', text: '👏' }
    ]
  },
  {
    id: '3',
    type: 'med',
    ownerName: 'Dad',
    message: 'Took all my medications on time today',
    timestamp: '6 hours ago',
    reactions: [
      { id: '4', userId: 'mom', userName: 'Mom', type: 'text', text: 'Proud of you!' }
    ]
  }
];

const FeedScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [shares, setShares] = useState(mockShares);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Load real data from Firestore
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleReaction = (shareId: string, reactionType: 'emoji' | 'text') => {
    if (reactionType === 'emoji') {
      // Show emoji picker
      Alert.alert(
        'React with Emoji',
        'Choose an emoji to react with:',
        [
          { text: '🎉', onPress: () => addReaction(shareId, 'emoji', '🎉') },
          { text: '👏', onPress: () => addReaction(shareId, 'emoji', '👏') },
          { text: '❤️', onPress: () => addReaction(shareId, 'emoji', '❤️') },
          { text: '👍', onPress: () => addReaction(shareId, 'emoji', '👍') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      // Show text input
      Alert.prompt(
        'React with Message',
        'Type a short message:',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send', 
            onPress: (text) => {
              if (text && text.trim()) {
                addReaction(shareId, 'text', text.trim());
              }
            }
          }
        ]
      );
    }
  };

  const addReaction = (shareId: string, type: 'emoji' | 'text', text: string) => {
    // TODO: Add reaction to Firestore
    const newReaction = {
      id: Date.now().toString(),
      userId: user?.uid || 'unknown',
      userName: 'You',
      type,
      text
    };

    setShares(prevShares => 
      prevShares.map(share => 
        share.id === shareId 
          ? { ...share, reactions: [...share.reactions, newReaction] }
          : share
      )
    );

    Alert.alert('Reaction Added!', 'Your reaction has been shared with the family.');
  };

  const getShareIcon = (type: string) => {
    switch (type) {
      case 'water': return '💧';
      case 'steps': return '👟';
      case 'med': return '💊';
      case 'photo': return '📷';
      case 'voice': return '🎤';
      default: return '🎉';
    }
  };

  const getShareColor = (type: string) => {
    switch (type) {
      case 'water': return '#007AFF';
      case 'steps': return '#4CAF50';
      case 'med': return '#FF9500';
      case 'photo': return '#FF2D55';
      case 'voice': return '#AF52DE';
      default: return '#8E8E93';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text variant="headlineMedium" style={styles.title}>
          📱 Family Feed
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          See what your family is up to
        </Text>

        {shares.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No updates yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                When family members share their wins, they'll appear here.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          shares.map((share) => (
            <Card key={share.id} style={styles.shareCard}>
              <Card.Content>
                <View style={styles.shareHeader}>
                  <View style={styles.ownerInfo}>
                    <Avatar.Text 
                      size={40} 
                      label={share.ownerName.charAt(0)}
                      style={{ backgroundColor: getShareColor(share.type) }}
                    />
                    <View style={styles.ownerDetails}>
                      <Text variant="titleMedium" style={styles.ownerName}>
                        {share.ownerName}
                      </Text>
                      <Text variant="bodySmall" style={styles.timestamp}>
                        {share.timestamp}
                      </Text>
                    </View>
                  </View>
                  <Chip 
                    icon={() => <Text>{getShareIcon(share.type)}</Text>}
                    style={[styles.typeChip, { backgroundColor: getShareColor(share.type) + '20' }]}
                  >
                    {share.type.charAt(0).toUpperCase() + share.type.slice(1)}
                  </Chip>
                </View>

                <Text variant="bodyLarge" style={styles.shareMessage}>
                  {share.message}
                </Text>

                {share.reactions.length > 0 && (
                  <View style={styles.reactionsContainer}>
                    <Text variant="bodySmall" style={styles.reactionsLabel}>
                      Reactions:
                    </Text>
                    <View style={styles.reactions}>
                      {share.reactions.map((reaction) => (
                        <View key={reaction.id} style={styles.reaction}>
                          {reaction.type === 'emoji' ? (
                            <Text style={styles.emojiReaction}>{reaction.text}</Text>
                          ) : (
                            <Text style={styles.textReaction}>"{reaction.text}"</Text>
                          )}
                          <Text style={styles.reactionOwner}>- {reaction.userName}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.actionButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => handleReaction(share.id, 'emoji')}
                    style={styles.reactionButton}
                    icon="emoticon"
                  >
                    React
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleReaction(share.id, 'text')}
                    style={styles.reactionButton}
                    icon="message"
                  >
                    Message
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Coming Soon', 'Creating new posts will be available in the next update.')}
        label="New Post"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
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
  emptyCard: {
    marginBottom: 20,
    elevation: 2,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  shareCard: {
    marginBottom: 20,
    elevation: 2,
  },
  shareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ownerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  ownerName: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  typeChip: {
    marginLeft: 10,
  },
  shareMessage: {
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  reactionsContainer: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  reactionsLabel: {
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  reactions: {
    gap: 8,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emojiReaction: {
    fontSize: 16,
  },
  textReaction: {
    color: '#333',
    fontStyle: 'italic',
  },
  reactionOwner: {
    color: '#666',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  reactionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default FeedScreen;
