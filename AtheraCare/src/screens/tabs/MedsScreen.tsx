import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, Chip, FAB, List, IconButton, Badge } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { getMedications, addMedication, deleteMedication, markMedicationTaken, Medication } from '../../utils/medications';

const MedsScreen: React.FC = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    if (user) {
      loadMedications();
    }
  }, [user]);

  const loadMedications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userMeds = await getMedications(user.uid);
      setMedications(userMeds);
    } catch (error) {
      console.error('Error loading medications:', error);
      Alert.alert('Error', 'Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async () => {
    if (!newMedName.trim() || selectedDays.length === 0) {
      Alert.alert('Error', 'Please enter a medication name and select at least one day');
      return;
    }

    if (!user) return;

    try {
      setLoading(true);
      await addMedication(user.uid, newMedName.trim(), selectedDays);
      
      // Reset form
      setNewMedName('');
      setSelectedDays([]);
      setShowAddForm(false);
      
      // Reload medications
      await loadMedications();
      
      Alert.alert('Success', 'Medication added successfully!');
    } catch (error) {
      console.error('Error adding medication:', error);
      Alert.alert('Error', 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedication = async (medId: string) => {
    if (!user) return;

    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedication(user.uid, medId);
              await loadMedications();
              Alert.alert('Success', 'Medication deleted successfully!');
            } catch (error) {
              console.error('Error deleting medication:', error);
              Alert.alert('Error', 'Failed to delete medication');
            }
          },
        },
      ]
    );
  };

  const handleMarkTaken = async (medId: string) => {
    if (!user) return;

    try {
      await markMedicationTaken(user.uid, medId);
      await loadMedications();
      Alert.alert('Success', 'Medication marked as taken! 💊');
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      Alert.alert('Error', 'Failed to mark medication as taken');
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const formatDays = (days: string[]) => {
    return days.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ');
  };

  const getTodaysMeds = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return medications.filter(med => med.days.includes(today));
  };

  const todaysMeds = getTodaysMeds();
  const takenToday = todaysMeds.filter(med => med.takenToday).length;
  const remainingToday = todaysMeds.length - takenToday;

  if (loading && medications.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading medications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          💊 My Medications
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your daily medications and schedules
        </Text>

        {/* Today's Summary */}
        {todaysMeds.length > 0 && (
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.summaryTitle}>
                Today's Medications
              </Text>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statNumber}>
                    {takenToday}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Taken
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statNumber}>
                    {remainingToday}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Remaining
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statNumber}>
                    {todaysMeds.length}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Total
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Add Medication Form */}
        {showAddForm && (
          <Card style={styles.addFormCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.formTitle}>
                Add New Medication
              </Text>
              
              <TextInput
                label="Medication Name"
                value={newMedName}
                onChangeText={setNewMedName}
                style={styles.input}
                mode="outlined"
              />
              
              <Text variant="bodyMedium" style={styles.daysLabel}>
                Take on these days:
              </Text>
              
              <View style={styles.daysContainer}>
                {days.map((day) => (
                  <Chip
                    key={day}
                    selected={selectedDays.includes(day)}
                    onPress={() => toggleDay(day)}
                    style={styles.dayChip}
                    mode="outlined"
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                  </Chip>
                ))}
              </View>
              
              <View style={styles.formButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setShowAddForm(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAddMedication}
                  disabled={loading || !newMedName.trim() || selectedDays.length === 0}
                  style={styles.addButton}
                >
                  Add Medication
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Medications List */}
        {medications.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No medications added yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtext}>
                Tap the + button to add your first medication
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.medicationsList}>
            {medications.map((med) => {
              const isToday = med.days.includes(
                new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
              );
              const isTaken = med.takenToday;
              
              return (
                <Card key={med.id} style={styles.medicationCard}>
                  <Card.Content>
                    <View style={styles.medicationHeader}>
                      <View style={styles.medicationInfo}>
                        <View style={styles.medicationTitleRow}>
                          <Text variant="titleMedium" style={styles.medicationName}>
                            {med.name}
                          </Text>
                          {isToday && (
                            <Badge 
                              style={[
                                styles.todayBadge,
                                isTaken ? styles.takenBadge : styles.pendingBadge
                              ]}
                            >
                              {isTaken ? 'Taken' : 'Today'}
                            </Badge>
                          )}
                        </View>
                        <Text variant="bodyMedium" style={styles.medicationDays}>
                          {formatDays(med.days)}
                        </Text>
                      </View>
                      <View style={styles.medicationActions}>
                        {isToday && !isTaken && (
                          <Button
                            mode="contained"
                            onPress={() => med.id && handleMarkTaken(med.id)}
                            style={styles.takeButton}
                            icon="check"
                          >
                            I Took It
                          </Button>
                        )}
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => med.id && handleDeleteMedication(med.id)}
                          iconColor="#FF3B30"
                        />
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon={showAddForm ? "close" : "plus"}
        style={styles.fab}
        onPress={() => setShowAddForm(!showAddForm)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  addFormCard: {
    marginBottom: 20,
    elevation: 2,
  },
  formTitle: {
    marginBottom: 15,
    color: '#333',
  },
  input: {
    marginBottom: 15,
  },
  daysLabel: {
    marginBottom: 10,
    color: '#333',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  dayChip: {
    marginBottom: 5,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
  emptyCard: {
    marginTop: 20,
    elevation: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
  },
  medicationsList: {
    gap: 15,
  },
  medicationCard: {
    elevation: 1,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    color: '#333',
    marginBottom: 5,
  },
  medicationDays: {
    color: '#666',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  summaryCard: {
    marginBottom: 20,
    elevation: 2,
  },
  summaryTitle: {
    marginBottom: 15,
    color: '#333',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#333',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#eee',
  },
  todayBadge: {
    backgroundColor: '#4CAF50', // Green for taken
    marginLeft: 10,
  },
  takenBadge: {
    backgroundColor: '#4CAF50', // Green for taken
  },
  pendingBadge: {
    backgroundColor: '#FFC107', // Yellow for pending
  },
  medicationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  medicationActions: {
    flexDirection: 'row',
    gap: 10,
  },
  takeButton: {
    flex: 1,
  },
});

export default MedsScreen;

