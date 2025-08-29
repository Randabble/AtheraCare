import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { DailyActivity } from '../utils/activityTracker';

interface ActivityChartProps {
  title: string;
  data: DailyActivity[];
  type: 'medications' | 'water' | 'steps' | 'mood' | 'energy';
  height?: number;
}

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 200;
const BAR_WIDTH = (width - 80) / 7; // 7 days, with padding

const ActivityChart: React.FC<ActivityChartProps> = ({
  title,
  data,
  type,
  height = CHART_HEIGHT
}) => {
  const theme = useTheme();

  const getDayLabel = (date: string) => {
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    return day;
  };

  const getValue = (activity: DailyActivity) => {
    switch (type) {
      case 'medications':
        return activity.medications.total > 0 
          ? (activity.medications.taken / activity.medications.total) * 100 
          : 0;
      case 'water':
        return activity.water.percentage;
      case 'steps':
        return activity.steps.percentage;
      case 'mood':
        return activity.mood || 0;
      case 'energy':
        return activity.energy || 0;
      default:
        return 0;
    }
  };

  const getDisplayValue = (activity: DailyActivity) => {
    switch (type) {
      case 'medications':
        return `${activity.medications.taken}/${activity.medications.total}`;
      case 'water':
        return `${activity.water.totalOz}oz`;
      case 'steps':
        return activity.steps.count.toLocaleString();
      case 'mood':
        return activity.mood ? `${activity.mood}/5` : 'N/A';
      case 'energy':
        return activity.energy ? `${activity.energy}/5` : 'N/A';
      default:
        return '0';
    }
  };

  const getBarColor = (value: number, activity: DailyActivity) => {
    switch (type) {
      case 'medications':
        return value >= 100 ? '#4CAF50' : value >= 80 ? '#FF9800' : '#F44336';
      case 'water':
        return value >= 100 ? '#2196F3' : value >= 80 ? '#FF9800' : '#F44336';
      case 'steps':
        return value >= 100 ? '#4CAF50' : value >= 80 ? '#FF9800' : '#F44336';
      case 'mood':
        return value >= 4 ? '#4CAF50' : value >= 3 ? '#FF9800' : '#F44336';
      case 'energy':
        return value >= 4 ? '#4CAF50' : value >= 3 ? '#FF9800' : '#F44336';
      default:
        return theme.colors.primary;
    }
  };

  const getMaxValue = () => {
    switch (type) {
      case 'medications':
      case 'water':
      case 'steps':
        return 100; // Percentage
      case 'mood':
      case 'energy':
        return 5; // 1-5 scale
      default:
        return 100;
    }
  };

  const maxValue = getMaxValue();

  // Fill in missing days with zero values
  const getFullWeekData = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const fullWeek: DailyActivity[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const existingData = data.find(d => d.date === dateString);
      if (existingData) {
        fullWeek.push(existingData);
      } else {
        // Create empty activity for missing day
        fullWeek.push({
          date: dateString,
          userId: '',
          medications: { total: 0, taken: 0, missed: 0, streak: 0 },
          water: { totalOz: 0, goalOz: 64, percentage: 0, streak: 0 },
          steps: { count: 0, goal: 10000, percentage: 0, streak: 0 },
          createdAt: {} as any,
          updatedAt: {} as any
        });
      }
    }
    
    return fullWeek;
  };

  const fullWeekData = getFullWeekData();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        
        <View style={[styles.chartContainer, { height }]}>
          {fullWeekData.map((activity, index) => {
            const value = getValue(activity);
            const barHeight = (value / maxValue) * (height - 60); // Leave space for labels
            const displayValue = getDisplayValue(activity);
            const barColor = getBarColor(value, activity);
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(barHeight, 4), // Minimum height for visibility
                        backgroundColor: barColor,
                        width: BAR_WIDTH
                      }
                    ]}
                  />
                </View>
                
                <Text style={styles.valueText}>
                  {displayValue}
                </Text>
                
                <Text style={styles.dayLabel}>
                  {getDayLabel(activity.date)}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* Legend */}
        <View style={styles.legend}>
                     {type === 'medications' && (
             <View style={styles.legendItem}>
               <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
               <Text style={styles.legendText}>All Taken</Text>
             </View>
           )}
           {type === 'water' && (
             <View style={styles.legendItem}>
               <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
               <Text style={styles.legendText}>Goal Met</Text>
             </View>
           )}
           {type === 'steps' && (
             <View style={styles.legendItem}>
               <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
               <Text style={styles.legendText}>Goal Met</Text>
             </View>
           )}
           {(type === 'mood' || type === 'energy') && (
             <View style={styles.legendItem}>
               <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
               <Text style={styles.legendText}>Good</Text>
             </View>
           )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    borderRadius: 4,
    minHeight: 4,
  },
  valueText: {
    marginTop: 4,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
  },
  dayLabel: {
    marginTop: 2,
    textAlign: 'center',
    color: '#999',
    fontSize: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default ActivityChart;
