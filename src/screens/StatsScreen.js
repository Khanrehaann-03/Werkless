// src/screens/StatsScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const StatsScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [selectedDay, setSelectedDay] = useState('W');
  
  const stats = {
    score: 67,
    completedJobs: 16,
    hoursSpent: 41,
    schedule: [
      { time: '07:00', activity: 'How to start...' },
      { time: '08:00', activity: null },
      { time: '09:00', activity: 'Learn environment' },
      { time: '10:00', activity: 'Code "Hello World"' },
    ]
  };
  
  const renderChart = () => {
    // This would be a proper chart component in a real app
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartBars}>
          {Array(15).fill(0).map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.chartBar, 
                { 
                  height: Math.random() * 60 + 20,
                  backgroundColor: i % 3 === 0 ? '#F59E0B' : '#10B981'
                }
              ]} 
            />
          ))}
        </View>
        <View style={styles.timeLabels}>
          <Text style={styles.timeLabel}>12:00</Text>
          <Text style={styles.timeLabel}>12:30</Text>
          <Text style={styles.timeLabel}>13:00</Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Stats</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        {/* Today Label */}
        <View style={styles.todayContainer}>
          <Ionicons name="today-outline" size={18} color={COLORS.textSecondary} />
          <Text style={styles.todayText}>Today</Text>
        </View>
        
        {/* Main Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{stats.score}</Text>
        </View>
        
        {/* Chart */}
        {renderChart()}
        
        {/* Stats Cards */}
        <View style={styles.statsCardsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{stats.completedJobs}</Text>
            <Text style={styles.statsLabel}>JOBS COMPLETE</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{stats.hoursSpent}</Text>
            <Text style={styles.statsLabel}>HOURS SPENT</Text>
          </View>
        </View>
        
        {/* Period Toggle */}
        <View style={styles.periodToggleContainer}>
          {['Week', 'Month', '6 Month'].map(period => (
            <TouchableOpacity 
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.selectedPeriodButtonText
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Day Selection */}
        <View style={styles.daySelectionContainer}>
          {['M', 'T', 'W', 'T', 'F'].map((day, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.dayButton,
                selectedDay === day && styles.selectedDayButton
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dayButtonText,
                selectedDay === day && styles.selectedDayButtonText
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Schedule */}
        <View style={styles.scheduleContainer}>
          {stats.schedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              {item.activity ? (
                <View style={styles.activityContainer}>
                  <Ionicons name="time-outline" size={16} color={COLORS.text} />
                  <Text style={styles.activityText}>{item.activity}</Text>
                </View>
              ) : (
                <View style={styles.emptyScheduleSlot} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  todayText: {
    marginLeft: 8,
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  chartContainer: {
    marginBottom: 32,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 8,
  },
  chartBar: {
    width: 6,
    borderRadius: 3,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xSmall,
  },
  statsCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statsCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: SIZES.xxLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: SIZES.xSmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  periodToggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPeriodButton: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  selectedPeriodButtonText: {
    color: COLORS.white,
  },
  daySelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: SIZES.small,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  selectedDayButtonText: {
    color: COLORS.white,
  },
  scheduleContainer: {
    marginBottom: 32,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleTime: {
    width: 60,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
  },
  activityText: {
    marginLeft: 8,
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  emptyScheduleSlot: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginLeft: 8,
  },
});

export default StatsScreen;