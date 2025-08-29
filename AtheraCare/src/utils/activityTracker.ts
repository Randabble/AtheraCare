import { db } from '../firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';

export interface DailyActivity {
  date: string; // YYYY-MM-DD format
  userId: string;
  medications: {
    total: number;
    taken: number;
    missed: number;
    streak: number;
  };
  water: {
    totalOz: number;
    goalOz: number;
    percentage: number;
    streak: number;
  };
  steps: {
    count: number;
    goal: number;
    percentage: number;
    streak: number;
  };
  mood?: number; // 1-5 scale
  energy?: number; // 1-5 scale
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalDays: number;
  medications: {
    totalTaken: number;
    totalMissed: number;
    averageStreak: number;
    completionRate: number;
  };
  water: {
    totalOz: number;
    averageOz: number;
    averagePercentage: number;
    averageStreak: number;
  };
  steps: {
    totalSteps: number;
    averageSteps: number;
    averagePercentage: number;
    averageStreak: number;
  };
  mood: {
    average: number;
    daysTracked: number;
  };
  energy: {
    average: number;
    daysTracked: number;
  };
}

// Save daily activity data
export const saveDailyActivity = async (
  userId: string, 
  date: string, 
  activityData: Partial<DailyActivity>
): Promise<void> => {
  try {
    const docRef = doc(db, 'dailyActivities', `${userId}_${date}`);
    const now = Timestamp.now();
    
    // Create a clean activity object with only valid Firestore values
    const activity: any = {
      date,
      userId,
      medications: {
        total: 0,
        taken: 0,
        missed: 0,
        streak: 0,
        ...(activityData.medications || {})
      },
      water: {
        totalOz: 0,
        goalOz: 64,
        percentage: 0,
        streak: 0,
        ...(activityData.water || {})
      },
      steps: {
        count: 0,
        goal: 10000,
        percentage: 0,
        streak: 0,
        ...(activityData.steps || {})
      },
      createdAt: now,
      updatedAt: now
    };

    // Only add mood and energy if they are valid numbers
    if (activityData.mood !== undefined && activityData.mood !== null) {
      activity.mood = activityData.mood;
    }
    if (activityData.energy !== undefined && activityData.energy !== null) {
      activity.energy = activityData.energy;
    }

    await setDoc(docRef, activity);
    console.log('Daily activity saved for:', date);
  } catch (error) {
    console.error('Error saving daily activity:', error);
    // Log the error but don't throw to prevent app crashes
    // This allows the app to continue working even if activity tracking fails
    console.warn('Activity tracking failed, but app will continue to function');
  }
};

// Get daily activity for a specific date
export const getDailyActivity = async (
  userId: string, 
  date: string
): Promise<DailyActivity | null> => {
  try {
    const docRef = doc(db, 'dailyActivities', `${userId}_${date}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as DailyActivity;
    }
    return null;
  } catch (error) {
    console.error('Error getting daily activity:', error);
    
    // Check if it's a permissions error
    if (error instanceof Error) {
      if (error.message.includes('permission') || error.message.includes('insufficient')) {
        console.error('Firebase permissions error - check security rules for dailyActivities collection');
        console.error('User ID:', userId, 'Date:', date);
      } else if (error.message.includes('network') || error.message.includes('unavailable')) {
        console.error('Firebase network error - check internet connection');
      } else {
        console.error('Unknown Firebase error:', error.message);
      }
    }
    
    // Return null instead of throwing to prevent app crashes
    // This allows the app to continue working even if there are permission issues
    return null;
  }
};

// Get weekly activity data for charts
export const getWeeklyActivity = async (
  userId: string, 
  startDate: string, 
  endDate: string
): Promise<DailyActivity[]> => {
  if (!userId) return [];
  
  try {
    const activitiesRef = collection(db, 'dailyActivities');
    
    // Use a simple query without orderBy to avoid index requirements
    const simpleQuery = query(
      activitiesRef,
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(simpleQuery);
    const activities: DailyActivity[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DailyActivity;
      // Filter by date range in memory to avoid complex Firestore queries
      if (data.date >= startDate && data.date <= endDate) {
        activities.push(data);
      }
    });
    
    // Sort manually since we're not using orderBy
    return activities.sort((a, b) => a.date.localeCompare(b.date));
    
  } catch (error) {
    console.error('Error getting weekly activity:', error);
    
    // Check if it's a permissions error
    if (error instanceof Error) {
      if (error.message.includes('permission') || error.message.includes('insufficient')) {
        console.error('Firebase permissions error - check security rules for dailyActivities collection');
        console.error('Please update your Firebase security rules to allow access to dailyActivities collection');
      } else if (error.message.includes('network') || error.message.includes('unavailable')) {
        console.error('Firebase network error - check internet connection');
      } else {
        console.error('Unknown Firebase error:', error.message);
      }
    }
    
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

// Calculate weekly statistics
export const calculateWeeklyStats = (activities: DailyActivity[]): WeeklyStats => {
  if (activities.length === 0) {
    return {
      weekStart: '',
      weekEnd: '',
      totalDays: 0,
      medications: { totalTaken: 0, totalMissed: 0, averageStreak: 0, completionRate: 0 },
      water: { totalOz: 0, averageOz: 0, averagePercentage: 0, averageStreak: 0 },
      steps: { totalSteps: 0, averageSteps: 0, averagePercentage: 0, averageStreak: 0 },
      mood: { average: 0, daysTracked: 0 },
      energy: { average: 0, daysTracked: 0 }
    };
  }

  const sortedActivities = activities.sort((a, b) => a.date.localeCompare(b.date));
  const weekStart = sortedActivities[0].date;
  const weekEnd = sortedActivities[sortedActivities.length - 1].date;

  // Calculate medication stats
  const totalTaken = sortedActivities.reduce((sum, activity) => sum + activity.medications.taken, 0);
  const totalMissed = sortedActivities.reduce((sum, activity) => sum + activity.medications.missed, 0);
  const averageStreak = sortedActivities.reduce((sum, activity) => sum + activity.medications.streak, 0) / sortedActivities.length;
  const completionRate = totalTaken + totalMissed > 0 ? (totalTaken / (totalTaken + totalMissed)) * 100 : 0;

  // Calculate water stats
  const totalOz = sortedActivities.reduce((sum, activity) => sum + activity.water.totalOz, 0);
  const averageOz = totalOz / sortedActivities.length;
  const averagePercentage = sortedActivities.reduce((sum, activity) => sum + activity.water.percentage, 0) / sortedActivities.length;
  const waterAverageStreak = sortedActivities.reduce((sum, activity) => sum + activity.water.streak, 0) / sortedActivities.length;

  // Calculate steps stats
  const totalSteps = sortedActivities.reduce((sum, activity) => sum + activity.steps.count, 0);
  const averageSteps = totalSteps / sortedActivities.length;
  const stepsAveragePercentage = sortedActivities.reduce((sum, activity) => sum + activity.steps.percentage, 0) / sortedActivities.length;
  const stepsAverageStreak = sortedActivities.reduce((sum, activity) => sum + activity.steps.streak, 0) / sortedActivities.length;

  // Calculate mood and energy stats
  const moodActivities = sortedActivities.filter(activity => activity.mood !== undefined);
  const energyActivities = sortedActivities.filter(activity => activity.energy !== undefined);
  
  const moodAverage = moodActivities.length > 0 
    ? moodActivities.reduce((sum, activity) => sum + (activity.mood || 0), 0) / moodActivities.length 
    : 0;
  
  const energyAverage = energyActivities.length > 0 
    ? energyActivities.reduce((sum, activity) => sum + (activity.energy || 0), 0) / energyActivities.length 
    : 0;

  return {
    weekStart,
    weekEnd,
    totalDays: sortedActivities.length,
    medications: {
      totalTaken,
      totalMissed,
      averageStreak,
      completionRate
    },
    water: {
      totalOz,
      averageOz,
      averagePercentage,
      averageStreak: waterAverageStreak
    },
    steps: {
      totalSteps,
      averageSteps,
      averagePercentage: stepsAveragePercentage,
      averageStreak: stepsAverageStreak
    },
    mood: {
      average: moodAverage,
      daysTracked: moodActivities.length
    },
    energy: {
      average: energyAverage,
      daysTracked: energyActivities.length
    }
  };
};

// Update medication tracking
export const updateMedicationTracking = async (
  userId: string,
  date: string,
  totalMeds: number,
  takenMeds: number,
  currentStreak: number
): Promise<void> => {
  const existingActivity = await getDailyActivity(userId, date);
  const missedMeds = totalMeds - takenMeds;
  
  const medicationData = {
    total: totalMeds,
    taken: takenMeds,
    missed: missedMeds,
    streak: currentStreak
  };

  if (existingActivity) {
    // Create a clean object without undefined values
    const cleanActivity: any = {
      date: existingActivity.date,
      userId: existingActivity.userId,
      medications: medicationData,
      water: existingActivity.water,
      steps: existingActivity.steps,
      createdAt: existingActivity.createdAt,
      updatedAt: existingActivity.updatedAt
    };

    // Only add mood and energy if they are valid numbers
    if (existingActivity.mood !== undefined && existingActivity.mood !== null) {
      cleanActivity.mood = existingActivity.mood;
    }
    if (existingActivity.energy !== undefined && existingActivity.energy !== null) {
      cleanActivity.energy = existingActivity.energy;
    }

    await saveDailyActivity(userId, date, cleanActivity);
  } else {
    await saveDailyActivity(userId, date, { medications: medicationData });
  }
};

// Update water tracking
export const updateWaterTracking = async (
  userId: string,
  date: string,
  totalOz: number,
  goalOz: number,
  currentStreak: number
): Promise<void> => {
  const existingActivity = await getDailyActivity(userId, date);
  const percentage = goalOz > 0 ? (totalOz / goalOz) * 100 : 0;
  
  const waterData = {
    totalOz,
    goalOz,
    percentage,
    streak: currentStreak
  };

  if (existingActivity) {
    // Create a clean object without undefined values
    const cleanActivity: any = {
      date: existingActivity.date,
      userId: existingActivity.userId,
      medications: existingActivity.medications,
      water: waterData,
      steps: existingActivity.steps,
      createdAt: existingActivity.createdAt,
      updatedAt: existingActivity.updatedAt
    };

    // Only add mood and energy if they are valid numbers
    if (existingActivity.mood !== undefined && existingActivity.mood !== null) {
      cleanActivity.mood = existingActivity.mood;
    }
    if (existingActivity.energy !== undefined && existingActivity.energy !== null) {
      cleanActivity.energy = existingActivity.energy;
    }

    await saveDailyActivity(userId, date, cleanActivity);
  } else {
    await saveDailyActivity(userId, date, { water: waterData });
  }
};

// Update steps tracking
export const updateStepsTracking = async (
  userId: string,
  date: string,
  steps: number,
  goal: number,
  currentStreak: number
): Promise<void> => {
  const existingActivity = await getDailyActivity(userId, date);
  const percentage = goal > 0 ? (steps / goal) * 100 : 0;
  
  const stepsData = {
    count: steps,
    goal,
    percentage,
    streak: currentStreak
  };

  if (existingActivity) {
    // Create a clean object without undefined values
    const cleanActivity: any = {
      date: existingActivity.date,
      userId: existingActivity.userId,
      medications: existingActivity.medications,
      water: existingActivity.water,
      steps: stepsData,
      createdAt: existingActivity.createdAt,
      updatedAt: existingActivity.updatedAt
    };

    // Only add mood and energy if they are valid numbers
    if (existingActivity.mood !== undefined && existingActivity.mood !== null) {
      cleanActivity.mood = existingActivity.mood;
    }
    if (existingActivity.energy !== undefined && existingActivity.energy !== null) {
      cleanActivity.energy = existingActivity.energy;
    }

    await saveDailyActivity(userId, date, cleanActivity);
  } else {
    await saveDailyActivity(userId, date, { steps: stepsData });
  }
};

// Update mood and energy
export const updateMoodEnergy = async (
  userId: string,
  date: string,
  mood?: number,
  energy?: number
): Promise<void> => {
  const existingActivity = await getDailyActivity(userId, date);
  
  if (existingActivity) {
    // Create a clean object without undefined values
    const cleanActivity: any = {
      date: existingActivity.date,
      userId: existingActivity.userId,
      medications: existingActivity.medications,
      water: existingActivity.water,
      steps: existingActivity.steps,
      createdAt: existingActivity.createdAt,
      updatedAt: existingActivity.updatedAt
    };

    // Only add mood and energy if they are valid numbers
    if (mood !== undefined && mood !== null) {
      cleanActivity.mood = mood;
    }
    if (energy !== undefined && energy !== null) {
      cleanActivity.energy = energy;
    }

    await saveDailyActivity(userId, date, cleanActivity);
  } else {
    // Only add mood and energy if they are valid numbers
    const newActivity: any = {};
    if (mood !== undefined && mood !== null) {
      newActivity.mood = mood;
    }
    if (energy !== undefined && energy !== null) {
      newActivity.energy = energy;
    }
    await saveDailyActivity(userId, date, newActivity);
  }
};

// Get date range for current week
export const getCurrentWeekRange = (): { startDate: string; endDate: string } => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);
  
  return {
    startDate: startOfWeek.toISOString().split('T')[0],
    endDate: endOfWeek.toISOString().split('T')[0]
  };
};

// Get date range for previous week
export const getPreviousWeekRange = (): { startDate: string; endDate: string } => {
  const today = new Date();
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - today.getDay());
  
  const startOfPreviousWeek = new Date(startOfCurrentWeek);
  startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);
  startOfPreviousWeek.setHours(0, 0, 0, 0);
  
  const endOfPreviousWeek = new Date(startOfPreviousWeek);
  endOfPreviousWeek.setDate(startOfPreviousWeek.getDate() + 6);
  endOfPreviousWeek.setHours(23, 59, 59, 999);
  
  return {
    startDate: startOfPreviousWeek.toISOString().split('T')[0],
    endDate: endOfPreviousWeek.toISOString().split('T')[0]
  };
};
