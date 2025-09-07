import React, { useState } from 'react';
import { View, StyleSheet, Modal, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, TextInput, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { MedicationIcon, PlusIcon } from './icons/ModernIcons';

interface MedicationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (medication: any) => void;
  medication?: any;
}

const MedicationModal: React.FC<MedicationModalProps> = ({
  visible,
  onClose,
  onSave,
  medication
}) => {
  const theme = useTheme();
  const [name, setName] = useState(medication?.name || '');
  const [dosage, setDosage] = useState(medication?.dosage || '');
  const [frequency, setFrequency] = useState(medication?.frequency || '');
  const [instructions, setInstructions] = useState(medication?.instructions || '');
  const [selectedDays, setSelectedDays] = useState<string[]>(medication?.days || []);
  const [imageUri, setImageUri] = useState(medication?.imageUri || '');
  const [loading, setLoading] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter medication name');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    setLoading(true);
    try {
      const medicationData = {
        id: medication?.id || Date.now().toString(),
        name: name.trim(),
        dosage: dosage.trim(),
        frequency: frequency.trim(),
        instructions: instructions.trim(),
        days: selectedDays,
        imageUri,
        takenToday: false,
        createdAt: medication?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(medicationData);
      onClose();
    } catch (error) {
      console.error('Error saving medication:', error);
      Alert.alert('Error', 'Failed to save medication');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDosage('');
    setFrequency('');
    setInstructions('');
    setSelectedDays([]);
    setImageUri('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {medication ? 'Edit Medication' : 'Add Medication'}
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Medication Image */}
          <View style={styles.imageSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Medication Photo
            </Text>
            
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.medicationImage} />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={() => {
                    Alert.alert(
                      'Change Photo',
                      'Choose an option',
                      [
                        { text: 'Camera', onPress: takePhoto },
                        { text: 'Gallery', onPress: pickImage },
                        { text: 'Cancel', style: 'cancel' }
                      ]
                    );
                  }}
                >
                  <Text style={styles.changeImageText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={() => {
                  Alert.alert(
                    'Add Photo',
                    'Choose an option',
                    [
                      { text: 'Camera', onPress: takePhoto },
                      { text: 'Gallery', onPress: pickImage },
                      { text: 'Cancel', style: 'cancel' }
                    ]
                  );
                }}
              >
                <View style={styles.addImageIcon}>
                  <PlusIcon size={32} color={Colors.primary} />
                </View>
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Medication Details */}
          <View style={styles.detailsSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Medication Details
            </Text>
            
            <TextInput
              label="Medication Name *"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              placeholder="e.g., Metformin, Aspirin"
            />
            
            <TextInput
              label="Dosage"
              value={dosage}
              onChangeText={setDosage}
              style={styles.input}
              mode="outlined"
              placeholder="e.g., 500mg, 2 tablets"
            />
            
            <TextInput
              label="Frequency"
              value={frequency}
              onChangeText={setFrequency}
              style={styles.input}
              mode="outlined"
              placeholder="e.g., Twice daily, Once a week"
            />
            
            <TextInput
              label="Instructions"
              value={instructions}
              onChangeText={setInstructions}
              style={styles.input}
              mode="outlined"
              placeholder="e.g., Take with food, Before bedtime"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Days Selection */}
          <View style={styles.daysSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Days to Take *
            </Text>
            <Text variant="bodySmall" style={styles.daysSubtitle}>
              Select all days when you need to take this medication
            </Text>
            
            <View style={styles.daysGrid}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonSelected
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    selectedDays.includes(day) && styles.dayButtonTextSelected
                  ]}>
                    {day.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleClose}
            style={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            buttonColor={Colors.medsPrimary}
            loading={loading}
            disabled={loading}
          >
            {medication ? 'Update' : 'Save'} Medication
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  closeButton: {
    padding: Spacing.sm,
  },
  closeText: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  imageSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  imageContainer: {
    alignItems: 'center',
  },
  medicationImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: Spacing.sm,
  },
  changeImageButton: {
    padding: Spacing.sm,
  },
  changeImageText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  addImageButton: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
  },
  addImageIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addImageText: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailsSection: {
    marginBottom: Spacing.lg,
  },
  input: {
    marginBottom: Spacing.md,
  },
  daysSection: {
    marginBottom: Spacing.lg,
  },
  daysSubtitle: {
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  dayButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.surface,
  },
  dayButtonSelected: {
    backgroundColor: Colors.medsPrimary,
    borderColor: Colors.medsPrimary,
  },
  dayButtonText: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  cancelButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
  },
  saveButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
  },
});

export default MedicationModal;
