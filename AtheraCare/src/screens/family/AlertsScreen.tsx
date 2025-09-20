import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip, useTheme, FAB, List, IconButton, Badge } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for now - will be replaced with real Firestore data
const mockAlerts = [
  {
    id: '1',
    familyId: 'family1',
    ownerId: 'dad',
    ownerName: 'Dad',
    kind: 'missed_meds',
    title: 'Missed Medication',
    message: 'Dad missed his morning blood pressure medication',
    severity: 'medium',
    createdAt: '2 hours ago',
    status: 'open',
    actionRequired: true
  },
  {
    id: '2',
    familyId: 'family1',
    ownerId: 'mom',
    ownerName: 'Mom',
    kind: 'low_activity',
    title: 'Low Activity Alert',
    message: 'Mom has been inactive for 3 days',
    severity: 'low',
    createdAt: '1 day ago',
    status: 'open',
    actionRequired: false
  },
  {
    id: '3',
    familyId: 'family1',
    ownerId: 'dad',
    ownerName: 'Dad',
    kind: 'low_hydration',
    title: 'Low Hydration',
    message: 'Dad only drank 16 oz of water today',
    severity: 'medium',
    createdAt: '4 hours ago',
    status: 'ack',
    actionRequired: false
  },
  {
    id: '4',
    familyId: 'family1',
    ownerId: 'mom',
    ownerName: 'Mom',
    kind: 'low_supply',
    title: 'Medication Supply Low',
    message: 'Mom\'s diabetes medication is running low (3 days left)',
    severity: 'high',
    createdAt: '6 hours ago',
    status: 'open',
    actionRequired: true
  }
];

const AlertsScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [alerts, setAlerts] = useState(mockAlerts);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'ack'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Load real data from Firestore
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      // TODO: Update alert status in Firestore
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'ack' as const }
            : alert
        )
      );
      
      Alert.alert('Alert Acknowledged', 'The alert has been marked as acknowledged.');
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      Alert.alert('Error', 'Failed to acknowledge alert');
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    Alert.alert(
      'Dismiss Alert',
      'Are you sure you want to dismiss this alert? It will be hidden from view.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dismiss',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Remove alert from Firestore or mark as dismissed
              setAlerts(prev => prev.filter(alert => alert.id !== alertId));
              Alert.alert('Alert Dismissed', 'The alert has been removed.');
            } catch (error) {
              console.error('Error dismissing alert:', error);
              Alert.alert('Error', 'Failed to dismiss alert');
            }
          },
        },
      ]
    );
  };

  const getAlertIcon = (kind: string) => {
    switch (kind) {
      case 'missed_meds': return '💊';
      case 'low_activity': return '👟';
      case 'low_hydration': return '💧';
      case 'low_supply': return '⚠️';
      default: return '🔔';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#007AFF';
      default: return '#8E8E93';
    }
  };

  const getAlertKindLabel = (kind: string) => {
    switch (kind) {
      case 'missed_meds': return 'Missed Meds';
      case 'low_activity': return 'Low Activity';
      case 'low_hydration': return 'Low Hydration';
      case 'low_supply': return 'Low Supply';
      default: return 'Alert';
    }
  };

  const getFilteredAlerts = () => {
    if (filterStatus === 'all') return alerts;
    return alerts.filter(alert => alert.status === filterStatus);
  };

  const openAlerts = alerts.filter(alert => alert.status === 'open').length;
  const totalAlerts = alerts.length;

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
          🔔 Family Alerts
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Stay informed about your family's health
        </Text>

        {/* Alert Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text variant="headlineLarge" style={[styles.summaryNumber, { color: '#FF3B30' }]}>
                  {openAlerts}
                </Text>
                <Text variant="bodyMedium">Open Alerts</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="headlineLarge" style={[styles.summaryNumber, { color: '#007AFF' }]}>
                  {totalAlerts}
                </Text>
                <Text variant="bodyMedium">Total Alerts</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Filter Tabs */}
        <Card style={styles.filterCard}>
          <Card.Content>
            <View style={styles.filterButtons}>
              <Button
                mode={filterStatus === 'all' ? 'contained' : 'outlined'}
                onPress={() => setFilterStatus('all')}
                style={styles.filterButton}
              >
                All ({totalAlerts})
              </Button>
              <Button
                mode={filterStatus === 'open' ? 'contained' : 'outlined'}
                onPress={() => setFilterStatus('open')}
                style={styles.filterButton}
              >
                Open ({openAlerts})
              </Button>
              <Button
                mode={filterStatus === 'ack' ? 'contained' : 'outlined'}
                onPress={() => setFilterStatus('ack')}
                style={styles.filterButton}
              >
                Acknowledged ({totalAlerts - openAlerts})
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Alerts List */}
        {getFilteredAlerts().length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No alerts to show
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {filterStatus === 'all' 
                  ? 'All clear! No alerts at the moment.'
                  : filterStatus === 'open'
                  ? 'No open alerts. Great job staying on top of things!'
                  : 'No acknowledged alerts to show.'
                }
              </Text>
            </Card.Content>
          </Card>
        ) : (
          getFilteredAlerts().map((alert) => (
            <Card key={alert.id} style={styles.alertCard}>
              <Card.Content>
                <View style={styles.alertHeader}>
                  <View style={styles.alertInfo}>
                    <View style={styles.alertIconContainer}>
                      <Text style={styles.alertIcon}>{getAlertIcon(alert.kind)}</Text>
                    </View>
                    <View style={styles.alertDetails}>
                      <Text variant="titleMedium" style={styles.alertTitle}>
                        {alert.title}
                      </Text>
                      <Text variant="bodySmall" style={styles.alertOwner}>
                        {alert.ownerName} • {alert.createdAt}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.alertBadges}>
                    <Chip 
                      style={[styles.severityChip, { backgroundColor: getAlertColor(alert.severity) + '20' }]}
                      textStyle={{ color: getAlertColor(alert.severity) }}
                    >
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Chip>
                    <Chip 
                      style={[styles.kindChip, { backgroundColor: '#8E8E93' + '20' }]}
                      textStyle={{ color: '#8E8E93' }}
                    >
                      {getAlertKindLabel(alert.kind)}
                    </Chip>
                  </View>
                </View>

                <Text variant="bodyMedium" style={styles.alertMessage}>
                  {alert.message}
                </Text>

                <View style={styles.alertActions}>
                  {alert.status === 'open' && (
                    <>
                      {alert.actionRequired && (
                        <Button
                          mode="contained"
                          onPress={() => handleAcknowledgeAlert(alert.id)}
                          style={[styles.actionButton, { backgroundColor: getAlertColor(alert.severity) }]}
                          icon="check"
                        >
                          Acknowledge
                        </Button>
                      )}
                      <Button
                        mode="outlined"
                        onPress={() => Alert.alert('Contact', `Would you like to contact ${alert.ownerName} about this alert? This will open a message to discuss the alert.`)}
                        style={styles.actionButton}
                        icon="message"
                      >
                        Contact {alert.ownerName}
                      </Button>
                    </>
                  )}
                  
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => handleDismissAlert(alert.id)}
                    style={styles.dismissButton}
                  />
                </View>

                {alert.status === 'ack' && (
                  <View style={styles.acknowledgedBadge}>
                    <Badge style={styles.ackBadge}>✓ Acknowledged</Badge>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Coming Soon', 'Creating custom alerts will be available in the next update.')}
        label="New Alert"
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
  summaryCard: {
    marginBottom: 20,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterCard: {
    marginBottom: 20,
    elevation: 2,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
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
  alertCard: {
    marginBottom: 20,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  alertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIconContainer: {
    marginRight: 12,
  },
  alertIcon: {
    fontSize: 24,
  },
  alertDetails: {
    flex: 1,
  },
  alertTitle: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  alertOwner: {
    color: '#666',
    fontSize: 12,
  },
  alertBadges: {
    alignItems: 'flex-end',
    gap: 5,
  },
  severityChip: {
    marginBottom: 2,
  },
  kindChip: {
    marginBottom: 2,
  },
  alertMessage: {
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  alertActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  dismissButton: {
    marginLeft: 'auto',
  },
  acknowledgedBadge: {
    marginTop: 10,
    alignItems: 'center',
  },
  ackBadge: {
    backgroundColor: '#4CAF50',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AlertsScreen;
