import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Chip, FAB, IconButton, Badge, useTheme } from 'react-native-paper';
import ModernCard from '../../components/ModernCard';
import MedicationModal from '../../components/MedicationModal';
import { useAuth } from '../../contexts/AuthContext';
import { getMedications, addMedication, deleteMedication, markMedicationTaken, Medication } from '../../utils/medications';
import { updateMedicationTracking } from '../../utils/activityTracker';
import CustomAlert from '../../components/CustomAlert';
import { Colors, Spacing, BorderRadius } from '../../theme/colors';
import { MedicationIcon, PlusIcon } from '../../components/icons/ModernIcons';

const MedsScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
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

  const handleAddMedication = () => {
    setEditingMedication(null);
    setShowMedicationModal(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setShowMedicationModal(true);
  };

  const handleSaveMedication = async (medicationData: any) => {
    if (!user) return;

    try {
      setLoading(true);
      if (editingMedication) {
        // Update existing medication
        await addMedication(user.uid, medicationData);
        showAlert('Success', 'Medication updated successfully!');
      } else {
        // Add new medication
        await addMedication(user.uid, medicationData);
        showAlert('Success', 'Medication added successfully!');
      }
      await loadMedications();
    } catch (error) {
      console.error('Error saving medication:', error);
      showAlert('Error', 'Failed to save medication');
    } finally {
      setLoading(false);
    }
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
      showAlert('Great job! 🎉', 'Medication marked as taken!');
    } catch (error) {
      console.error('Error marking medication taken:', error);
      showAlert('Error', 'Failed to mark medication as taken');
    } finally {
      setLoading(false);
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
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Medications
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Track your daily medications
          </Text>
        </View>

        {/* Today's Medications Summary */}
        {todaysMeds.length > 0 && (
          <ModernCard 
            title={`Today's Medications (${todaysMeds.length})`}
            style={styles.summaryCard}
          >
            <View style={styles.summaryIcon}>
              <MedicationIcon size={32} color={Colors.medsPrimary} />
            </View>
            
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
                    buttonColor={Colors.medsPrimary}
                    icon="check"
                  >
                    I Took It
                  </Button>
                )}
              </View>
            ))}
          </ModernCard>
        )}

        {/* All Medications List */}
        <ModernCard 
          title={`All Medications (${medications.length})`}
          style={styles.medsCard}
        >
          {medications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MedicationIcon size={48} color={Colors.textSecondary} />
              </View>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No medications added yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtext}>
                Tap the + button to add your first medication
              </Text>
            </View>
          ) : (
            medications.map((med) => (
              <View key={med.id} style={styles.medItem}>
                <View style={styles.medContent}>
                  <View style={styles.medIcon}>
                    <MedicationIcon size={24} color={Colors.medsPrimary} />
                  </View>
                  <View style={styles.medDetails}>
                    <Text variant="bodyLarge" style={styles.medName}>
                      {med.name}
                    </Text>
                    <Text variant="bodyMedium" style={styles.medDosage}>
                      {med.dosage || 'No dosage specified'}
                    </Text>
                    <View style={styles.medDays}>
                      {med.days?.map((day, index) => (
                        <Chip key={index} style={styles.dayChip} textStyle={styles.dayChipText}>
                          {day.slice(0, 3)}
                        </Chip>
                      ))}
                    </View>
                  </View>
                </View>
                <View style={styles.medActions}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => handleEditMedication(med)}
                    iconColor={Colors.primary}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => med.id && handleDeleteMedication(med.id)}
                    iconColor={Colors.error}
                  />
                </View>
              </View>
            ))
          )}
        </ModernCard>

        {/* Medication Modal */}
        <MedicationModal
          visible={showMedicationModal}
          onClose={() => setShowMedicationModal(false)}
          onSave={handleSaveMedication}
          medication={editingMedication}
        />
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: Colors.medsPrimary }]}
        onPress={handleAddMedication}
        label="Add Med"
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
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textSecondary,
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
  medItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  medContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  medIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.medsPrimary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medDetails: {
    flex: 1,
  },
  medDosage: {
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  medDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  dayChip: {
    backgroundColor: Colors.primary + '20',
  },
  dayChipText: {
    color: Colors.primary,
    fontSize: 12,
  },
  medActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.medsPrimary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.textSecondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default MedsScreen;
