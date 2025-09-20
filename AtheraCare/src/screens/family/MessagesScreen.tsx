import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Card, Button, TextInput, Avatar, FAB, List, Divider } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for now - will be replaced with real Firestore data
const mockMessages = [
  {
    id: '1',
    fromUserId: 'mom',
    fromUserName: 'Mom',
    toUserId: 'dad',
    toUserName: 'Dad',
    text: 'How are you feeling today? Remember to take your meds! 💊',
    timestamp: '2 hours ago',
    isEncouragement: true
  },
  {
    id: '2',
    fromUserId: 'dad',
    fromUserName: 'Dad',
    toUserId: 'mom',
    toUserName: 'Mom',
    text: 'Feeling good! Just took my morning pills. Thanks for checking in! 😊',
    timestamp: '1 hour ago',
    isEncouragement: false
  },
  {
    id: '3',
    fromUserId: 'daughter',
    fromUserName: 'Sarah',
    toUserId: 'dad',
    toUserName: 'Dad',
    text: 'Great job hitting your water goal yesterday! Keep it up! 💧',
    timestamp: '30 minutes ago',
    isEncouragement: true
  }
];

const encouragementPrompts = [
  "How are you feeling today?",
  "Remember to take your medications!",
  "Great job on your progress!",
  "You're doing amazing!",
  "Keep up the good work!",
  "How was your day?",
  "Need any help with anything?",
  "You've got this! 💪"
];

const MessagesScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Mock family members - will come from Firestore
  const familyMembers = [
    { id: 'dad', name: 'Dad', role: 'senior' },
    { id: 'mom', name: 'Mom', role: 'senior' },
    { id: 'daughter', name: 'Sarah', role: 'family' }
  ];

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim() || !selectedRecipient) {
      Alert.alert('Error', 'Please enter a message and select a recipient');
      return;
    }

    try {
      // TODO: Send message to Firestore
      const messageData = {
        id: Date.now().toString(),
        fromUserId: user.uid,
        fromUserName: 'You',
        toUserId: selectedRecipient,
        toUserName: familyMembers.find(m => m.id === selectedRecipient)?.name || 'Unknown',
        text: newMessage.trim(),
        timestamp: 'Just now',
        isEncouragement: false
      };

      setMessages(prev => [messageData, ...prev]);
      setNewMessage('');
      setSelectedRecipient(null);
      setShowNewMessage(false);

      Alert.alert('Message Sent!', 'Your message has been sent successfully.');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleQuickEncouragement = (prompt: string) => {
    setNewMessage(prompt);
    setShowNewMessage(true);
  };

  const getMessagesForUser = (userId: string) => {
    return messages.filter(msg => 
      msg.fromUserId === userId || msg.toUserId === userId
    );
  };

  const getConversationPartner = (message: any) => {
    if (message.fromUserId === user?.uid) {
      return message.toUserName;
    }
    return message.fromUserName;
  };

  const isFromCurrentUser = (message: any) => {
    return message.fromUserId === user?.uid;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
      >
        <Text variant="headlineMedium" style={styles.title}>
          💬 Family Messages
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Send encouragement and check in with family
        </Text>

        {/* Quick Encouragement */}
        <Card style={styles.encouragementCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Encouragement
            </Text>
            <Text variant="bodyMedium" style={styles.sectionSubtitle}>
              Tap to send a quick message
            </Text>
            
            <View style={styles.promptsContainer}>
              {encouragementPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  mode="outlined"
                  onPress={() => handleQuickEncouragement(prompt)}
                  style={styles.promptButton}
                  contentStyle={styles.promptButtonContent}
                >
                  {prompt}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Recent Messages */}
        <Card style={styles.messagesCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Messages
            </Text>
            
            {messages.length === 0 ? (
              <Text variant="bodyMedium" style={styles.emptyText}>
                No messages yet. Start a conversation with your family!
              </Text>
            ) : (
              messages.slice(0, 5).map((message) => (
                <View key={message.id}>
                  <List.Item
                    title={getConversationPartner(message)}
                    description={message.text}
                    left={(props) => (
                      <Avatar.Text 
                        size={40} 
                        label={getConversationPartner(message).charAt(0)}
                        style={{ 
                          backgroundColor: isFromCurrentUser(message) 
                            ? '#007AFF' 
                            : '#8E8E93' 
                        }}
                      />
                    )}
                    right={(props) => (
                      <View style={styles.messageMeta}>
                        <Text variant="bodySmall" style={styles.timestamp}>
                          {message.timestamp}
                        </Text>
                        {message.isEncouragement && (
                          <Text style={styles.encouragementBadge}>💝</Text>
                        )}
                      </View>
                    )}
                    style={styles.messageItem}
                  />
                  <Divider />
                </View>
              ))
            )}
            
            {messages.length > 5 && (
              <Button
                mode="outlined"
                onPress={() => Alert.alert('Coming Soon', 'Full message history will be available in the next update. You\'ll be able to view all past conversations, search messages, and see detailed message history.')}
                style={styles.viewAllButton}
                icon="history"
              >
                View All Messages
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* New Message Form */}
        {showNewMessage && (
          <Card style={styles.newMessageCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                New Message
              </Text>
              
              {/* Recipient Selection */}
              <Text variant="bodyMedium" style={styles.inputLabel}>
                Send to:
              </Text>
              <View style={styles.recipientButtons}>
                {familyMembers
                  .filter(member => member.id !== user?.uid)
                  .map((member) => (
                    <Button
                      key={member.id}
                      mode={selectedRecipient === member.id ? 'contained' : 'outlined'}
                      onPress={() => setSelectedRecipient(member.id)}
                      style={styles.recipientButton}
                      icon={() => (
                        <Avatar.Text 
                          size={20} 
                          label={member.name.charAt(0)}
                          style={{ 
                            backgroundColor: selectedRecipient === member.id ? 'white' : '#007AFF' 
                          }}
                        />
                      )}
                    >
                      {member.name}
                    </Button>
                  ))}
              </View>
              
              {/* Message Input */}
              <TextInput
                label="Your message"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                numberOfLines={3}
                style={styles.messageInput}
                mode="outlined"
                placeholder="Type your message here..."
              />
              
              {/* Action Buttons */}
              <View style={styles.formButtons}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setShowNewMessage(false);
                    setNewMessage('');
                    setSelectedRecipient(null);
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSendMessage}
                  disabled={!newMessage.trim() || !selectedRecipient}
                  style={styles.sendButton}
                  icon="send"
                >
                  Send
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowNewMessage(!showNewMessage)}
        label={showNewMessage ? 'Close' : 'New Message'}
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
  encouragementCard: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  sectionSubtitle: {
    color: '#666',
    marginBottom: 15,
  },
  promptsContainer: {
    gap: 8,
  },
  promptButton: {
    marginBottom: 5,
  },
  promptButtonContent: {
    paddingVertical: 8,
  },
  messagesCard: {
    marginBottom: 20,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  messageItem: {
    paddingVertical: 8,
  },
  messageMeta: {
    alignItems: 'flex-end',
    gap: 5,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  encouragementBadge: {
    fontSize: 16,
  },
  viewAllButton: {
    marginTop: 15,
    alignSelf: 'center',
  },
  newMessageCard: {
    elevation: 2,
  },
  inputLabel: {
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  recipientButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  recipientButton: {
    flex: 1,
  },
  messageInput: {
    marginBottom: 15,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
  },
  sendButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default MessagesScreen;
