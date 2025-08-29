import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, Chip, FAB, List, IconButton, Badge, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { getMedications, addMedication, deleteMedication, markMedicationTaken, Medication } from '../../utils/medications';
import { updateMedicationTracking } from '../../utils/activityTracker';
import CustomAlert from '../../components/CustomAlert';

const MedsScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    setPendingDeleteId(null);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (user) {
      loadMedications();
    }
  }, [user]);

  const loadMedications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const meds = await getMedications(user.uid);
      setMedications(meds);
    } catch (error) {
      console.error('Error loading medications:', error);
      showAlert('Error', 'Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async () => {
    if (!user || !newMedName.trim() || selectedDays.length === 0) {
      showAlert('Error', 'Please enter a medication name and select days');
      return;
    }

    try {
      setLoading(true);
      await addMedication(user.uid, newMedName.trim(), selectedDays);
      setNewMedName('');
      setSelectedDays([]);
      setShowAddForm(false);
      await loadMedications();
      showAlert('Success', 'Medication added successfully! 💊');
    } catch (error) {
      console.error('Error adding medication:', error);
      showAlert('Error', 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedication = async (medicationId: string) => {
    setPendingDeleteId(medicationId);
    showAlert('Delete Medication', 'Are you sure you want to delete this medication?');
  };

  const confirmDeleteMedication = async () => {
    if (!pendingDeleteId) return;
    
    try {
      setLoading(true);
      await deleteMedication(pendingDeleteId);
      await loadMedications();
      showAlert('Success', 'Medication deleted');
    } catch (error) {
      console.error('Error deleting medication:', error);
      showAlert('Error', 'Failed to delete medication');
    } finally {
      setLoading(false);
    }
    hideAlert();
  };

  const handleMarkTaken = async (medicationId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      await markMedicationTaken(user.uid, medicationId);
      
      // Update activity tracker
      const today = new Date().toISOString().split('T')[0];
      const todaysMeds = getTodaysMeds();
      const totalMeds = todaysMeds.length;
      const takenMeds = todaysMeds.filter(med => med.takenToday).length + 1; // +1 for the one we just marked
      
      await updateMedicationTracking(user.uid, today, totalMeds, takenMeds, 0); // TODO: Calculate actual streak
      
      await loadMedications();
      Alert.alert('Great job! 🎉', 'Medication marked as taken!');
    } catch (error) {
      console.error('Error marking medication taken:', error);
      Alert.alert('Error', 'Failed to mark medication as taken');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const getTodaysMeds = () => {
    if (!medications.length) return [];
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return medications.filter(med => 
      med.days && med.days.includes(today)
    );
  };

  const todaysMeds = getTodaysMeds();

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
          💊 Medications
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your daily medications
        </Text>

        {/* Today's Medications Summary */}
        {todaysMeds.length > 0 && (
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.summaryTitle}>
                Today's Medications ({todaysMeds.length})
              </Text>
              {todaysMeds.map((med, index) => (
                <View key={index} style={styles.todayMedItem}>
                  <View style={styles.medInfo}>
                    <Text variant="bodyLarge" style={styles.medName}>
                      {med.name}
                    </Text>
                    {med.takenToday && (
                      <Badge style={styles.takenBadge}>Taken ✓</Badge>
                    )}
                  </View>
                  {!med.takenToday && (
                    <Button
                      mode="contained"
                                              onPress={() => med.id && handleMarkTaken(med.id)}
                      disabled={loading}
                      style={styles.takeButton}
                      icon="check"
                    >
                      I Took It
                    </Button>
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* All Medications List */}
        <Card style={styles.medsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              All Medications ({medications.length})
            </Text>
            
            {medications.length === 0 ? (
              <Text variant="bodyMedium" style={styles.noMeds}>
                No medications added yet. Tap the + button to add your first medication.
              </Text>
            ) : (
              medications.map((med) => (
                <List.Item
                  key={med.id}
                  title={med.name}
                  description={`Days: ${med.days ? med.days.join(', ') : 'Not set'}`}
                  left={(props) => (
                    <List.Icon {...props} icon="pill" color={theme.colors.primary} />
                  )}
                  right={(props) => (
                    <View style={styles.medActions}>
                      {med.takenToday && (
                        <Badge style={styles.takenBadge}>Taken ✓</Badge>
                      )}
                      <IconButton
                        {...props}
                        icon="delete"
                        size={20}
                        onPress={() => med.id && handleDeleteMedication(med.id)}
                        disabled={loading}
                      />
                    </View>
                  )}
                  style={styles.medItem}
                />
              ))
            )}
          </Card.Content>
        </Card>

        {/* Add Medication Form */}
        {showAddForm && (
          <Card style={styles.addFormCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Add New Medication
              </Text>
              
              <TextInput
                label="Medication Name"
                value={newMedName}
                onChangeText={setNewMedName}
                style={styles.input}
                mode="outlined"
                placeholder="e.g., Aspirin, Vitamin D"
              />
              
              <Text variant="bodyMedium" style={styles.daysLabel}>
                Take on these days:
              </Text>
              
              <View style={styles.daysContainer}>
                {daysOfWeek.map((day) => (
                  <Chip
                    key={day}
                    selected={selectedDays.includes(day)}
                    onPress={() => toggleDay(day)}
                    style={styles.dayChip}
                    mode="outlined"
                  >
                    {day.slice(0, 3)}
                  </Chip>
                ))}
              </View>
              
              <View style={styles.formButtons}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setShowAddForm(false);
                    setNewMedName('');
                    setSelectedDays([]);
                  }}
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
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddForm(!showAddForm)}
        label={showAddForm ? 'Close' : 'Add Med'}
      />
      
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertTitle === 'Delete Medication' ? confirmDeleteMedication : hideAlert}
        onCancel={hideAlert}
        showCancel={alertTitle === 'Delete Medication'}
        confirmText={alertTitle === 'Delete Medication' ? 'Delete' : 'OK'}
        cancelText="Cancel"
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
  summaryCard: {
    marginBottom: 20,
    elevation: 2,
  },
  summaryTitle: {
    marginBottom: 15,
    color: '#333',
    fontWeight: '500',
  },
  todayMedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  medInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  medName: {
    color: '#333',
    fontWeight: '500',
  },
  takenBadge: {
    backgroundColor: '#4CAF50',
  },
  takeButton: {
    minWidth: 100,
  },
  medsCard: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
    fontWeight: '500',
  },
  noMeds: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  medItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  medActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addFormCard: {
    marginBottom: 20,
    elevation: 2,
  },
  input: {
    marginBottom: 15,
  },
  daysLabel: {
    marginBottom: 10,
    color: '#333',
    fontWeight: '500',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default MedsScreen;
