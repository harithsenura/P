import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles, Flame, Activity, Droplet } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ThemeContext } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { CEOBackground } from '../components/CEOBackground';

export const DashboardScreen = () => {
  const { theme, isDark } = useContext(ThemeContext);

  const getFormattedDate = () => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    return `${dayName}, ${date} ${monthName} ${year}`;
  };

  // Water level state
  const [water, setWater] = useState(1.25);

  // Shared Values for dynamic Spring Animations
  const habitProgressSV = useSharedValue(0);
  const taskProgressSV = useSharedValue(0);
  const waterProgressSV = useSharedValue(1.25 / 2.5); // Target is 2.5L

  // Spring animation on mount for Habits & Tasks, and update on Water change
  useEffect(() => {
    habitProgressSV.value = withSpring(0.85, { damping: 15 }); // Habits score: 85%
    taskProgressSV.value = withSpring(0.66, { damping: 15 });  // Tasks score: 66% (2/3 tasks done)
  }, []);

  useEffect(() => {
    waterProgressSV.value = withSpring(water / 2.5, { damping: 15 });
  }, [water]);

  // Dynamic Animated Style mappings
  const habitAnimatedStyle = useAnimatedStyle(() => ({
    width: `${habitProgressSV.value * 100}%`,
  }));

  const taskAnimatedStyle = useAnimatedStyle(() => ({
    width: `${taskProgressSV.value * 100}%`,
  }));

  const waterAnimatedStyle = useAnimatedStyle(() => ({
    width: `${waterProgressSV.value * 100}%`,
  }));

  // Water helper control triggers
  const increaseWater = () => {
    setWater(prev => Math.min(2.5, parseFloat((prev + 0.25).toFixed(2))));
  };

  const decreaseWater = () => {
    setWater(prev => Math.max(0.0, parseFloat((prev - 0.25).toFixed(2))));
  };

  return (
    <View style={styles.container}>
      <CEOBackground />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* GREETING SECTION */}
        <View style={styles.headerSection}>
          <Text style={[styles.greetingText, { color: theme.text }]}>
            Good Morning, <Text style={{ fontFamily: 'Syne_800ExtraBold' }}>Harith</Text>
          </Text>
          <Text style={[styles.headerDate, { color: theme.text2 }]}>{getFormattedDate()}</Text>
        </View>

        {/* FINANCE CARD */}
        <GlassCard style={styles.financeCard}>
          <Text style={[styles.cardSubtitle, { color: theme.text2 }]}>TOTAL BALANCE</Text>
          <Text style={[styles.financeAmount, { color: theme.text }]}>LKR 12,450.00</Text>
          <View style={[styles.financeSubRow, { borderTopColor: theme.border }]}>
            <Text style={styles.financeSubText}>
              <Text style={{ color: theme.text2 }}>IN: </Text>
              <Text style={{ color: isDark ? '#4ade80' : '#16a34a', fontFamily: 'IBMPlexMono_600SemiBold' }}>+LKR 120.00</Text>
              <Text style={{ color: theme.text2 }}>   |   </Text>
              <Text style={{ color: theme.text2 }}>OUT: </Text>
              <Text style={{ color: isDark ? '#f87171' : '#dc2626', fontFamily: 'IBMPlexMono_600SemiBold' }}>-LKR 45.50</Text>
            </Text>
          </View>
        </GlassCard>

        {/* COMPACT DAILY METRICS PANEL */}
        <GlassCard style={styles.metricsCard}>
          <Text style={[styles.metricsTitle, { color: theme.ice }]}>SYSTEM SYNERGY</Text>
          
          <View style={styles.metricsGrid}>
            
            {/* 1. HABITS PROGRESS */}
            <View style={[styles.metricItem, { borderColor: theme.border }]}>
              <View style={styles.metricHeader}>
                <Flame color={theme.text2} size={11} />
                <Text style={[styles.metricLabel, { color: theme.text2 }]}>HABITS</Text>
              </View>
              <Text style={[styles.metricValue, { color: theme.text }]}>85%</Text>
              <View style={[styles.progressBarBg, { backgroundColor: theme.surface2 }]}>
                <Animated.View style={[styles.progressBarFill, { backgroundColor: theme.ice }, habitAnimatedStyle]} />
              </View>
            </View>

            {/* 2. TASK PROGRESS */}
            <View style={[styles.metricItem, { borderColor: theme.border }]}>
              <View style={styles.metricHeader}>
                <Activity color={theme.text2} size={11} />
                <Text style={[styles.metricLabel, { color: theme.text2 }]}>TASKS</Text>
              </View>
              <Text style={[styles.metricValue, { color: theme.text }]}>66%</Text>
              <View style={[styles.progressBarBg, { backgroundColor: theme.surface2 }]}>
                <Animated.View style={[styles.progressBarFill, { backgroundColor: theme.ice }, taskAnimatedStyle]} />
              </View>
            </View>

            {/* 3. WATER LEVEL */}
            <View style={[styles.metricItem, { borderColor: theme.border }]}>
              <View style={styles.metricHeader}>
                <Droplet color={theme.text2} size={11} />
                <Text style={[styles.metricLabel, { color: theme.text2 }]}>WATER</Text>
              </View>
              <View style={styles.waterControls}>
                <TouchableOpacity onPress={decreaseWater} style={[styles.waterBtn, { borderColor: theme.border }]}>
                  <Text style={[styles.waterBtnText, { color: theme.text2 }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.metricValue, { color: theme.text, fontSize: 13 }]}>{water.toFixed(2)}L</Text>
                <TouchableOpacity onPress={increaseWater} style={[styles.waterBtn, { borderColor: theme.border }]}>
                  <Text style={[styles.waterBtnText, { color: theme.text2 }]}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: theme.surface2 }]}>
                <Animated.View style={[styles.progressBarFill, { backgroundColor: theme.ice }, waterAnimatedStyle]} />
              </View>
            </View>

          </View>
        </GlassCard>

        {/* NEXT TASK SECTION */}
        <Text style={[styles.sectionTitle, { color: theme.text2 }]}>NEXT TASK</Text>
        <GlassCard style={styles.taskCard}>
          <View style={styles.taskContent}>
            <View style={[styles.checkbox, { borderColor: theme.ice }]} />
            <View style={styles.taskDetails}>
              <Text style={[styles.taskTitle, { color: theme.text }]}>Call with design team</Text>
              <Text style={[styles.taskTime, { color: theme.text2 }]}>Today at 2:00 PM</Text>
            </View>
          </View>
        </GlassCard>

        {/* PROJECTS THIS WEEK SECTION */}
        <Text style={[styles.sectionTitle, { color: theme.text2 }]}>PROJECTS THIS WEEK</Text>
        
        {/* PROJECT CARD 1 */}
        <GlassCard style={styles.projectCard}>
          <View style={styles.pcHeader}>
            <View style={styles.pcTags}>
              <View style={[styles.pcTag, { borderColor: theme.border }]}>
                <Text style={[styles.pcTagText, { color: theme.text2 }]}>MOBILE</Text>
              </View>
              <View style={[styles.pcTag, { borderColor: theme.border }]}>
                <Text style={[styles.pcTagText, { color: theme.text2 }]}>DESIGN</Text>
              </View>
            </View>
            <View style={[styles.pcPlat, { borderColor: theme.ice, backgroundColor: theme.surface }]}>
              <Text style={[styles.pcPlatText, { color: theme.ice }]}>EXPO GO</Text>
            </View>
          </View>

          <Text style={[styles.pcName, { color: theme.text }]}>Portfolio Mobile App</Text>
          <Text style={[styles.pcDesc, { color: theme.text2 }]}>
            Premium Life OS companion app matching portfolio design language.
          </Text>

          <View style={styles.pcTech}>
            <View style={[styles.pcPill, { backgroundColor: theme.surface2 }]}>
              <Text style={[styles.pcPillText, { color: theme.text2 }]}>REACT NATIVE</Text>
            </View>
            <View style={[styles.pcPill, { backgroundColor: theme.surface2 }]}>
              <Text style={[styles.pcPillText, { color: theme.text2 }]}>EXPO</Text>
            </View>
            <View style={[styles.pcPill, { backgroundColor: theme.surface2 }]}>
              <Text style={[styles.pcPillText, { color: theme.text2 }]}>TS</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.pcViewBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
            <Text style={[styles.pcViewBtnText, { color: theme.text2 }]}>VIEW</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* PROJECT CARD 2 */}
        <GlassCard style={styles.projectCard}>
          <View style={styles.pcHeader}>
            <View style={styles.pcTags}>
              <View style={[styles.pcTag, { borderColor: theme.border }]}>
                <Text style={[styles.pcTagText, { color: theme.text2 }]}>BACKEND</Text>
              </View>
              <View style={[styles.pcTag, { borderColor: theme.border }]}>
                <Text style={[styles.pcTagText, { color: theme.text2 }]}>RAG</Text>
              </View>
            </View>
            <View style={[styles.pcPlat, { borderColor: theme.ice, backgroundColor: theme.surface }]}>
              <Text style={[styles.pcPlatText, { color: theme.ice }]}>PYTHON</Text>
            </View>
          </View>

          <Text style={[styles.pcName, { color: theme.text }]}>AI Memory Core</Text>
          <Text style={[styles.pcDesc, { color: theme.text2 }]}>
            Deep learning assistant server running semantic local memory sync.
          </Text>

          <View style={styles.pcTech}>
            <View style={[styles.pcPill, { backgroundColor: theme.surface2 }]}>
              <Text style={[styles.pcPillText, { color: theme.text2 }]}>FASTAPI</Text>
            </View>
            <View style={[styles.pcPill, { backgroundColor: theme.surface2 }]}>
              <Text style={[styles.pcPillText, { color: theme.text2 }]}>MONGODB</Text>
            </View>
            <View style={[styles.pcPill, { backgroundColor: theme.surface2 }]}>
              <Text style={[styles.pcPillText, { color: theme.text2 }]}>OLLAMA</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.pcViewBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
            <Text style={[styles.pcViewBtnText, { color: theme.text2 }]}>VIEW</Text>
          </TouchableOpacity>
        </GlassCard>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 64, paddingBottom: 100 },
  headerSection: { marginBottom: 16 },
  greetingText: { fontFamily: 'Syne_700Bold', fontSize: 26, letterSpacing: -0.5 },
  headerDate: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  cardSubtitle: { fontFamily: 'Syne_600SemiBold', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  financeCard: { marginBottom: 14, alignItems: 'center' },
  financeSubRow: {
    marginTop: 6,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    paddingTop: 6,
    width: '100%',
    alignItems: 'center',
  },
  financeSubText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  financeAmount: { fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 32, marginTop: 4 },
  
  // METRICS DASHBOARD STYLES
  metricsCard: {
    marginBottom: 16,
  },
  metricsTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricItem: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 88,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  metricLabel: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  metricValue: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 14,
    marginVertical: 4,
  },
  progressBarBg: {
    height: 3,
    width: '100%',
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginVertical: 2,
  },
  waterBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterBtnText: {
    fontSize: 9,
    fontFamily: 'IBMPlexMono_600SemiBold',
    lineHeight: 11,
  },

  sectionTitle: { fontFamily: 'Syne_700Bold', fontSize: 12, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' },
  taskCard: { marginBottom: 16 },
  taskContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 0 },
  taskDetails: { gap: 2 },
  taskTitle: { fontFamily: 'Syne_600SemiBold', fontSize: 14 },
  taskTime: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 11 },
  
  // 100% MATCHED WEB PROJECT CARD STYLES
  projectCard: {
    marginBottom: 14,
    position: 'relative',
  },
  pcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pcTags: {
    flexDirection: 'row',
    gap: 6,
  },
  pcTag: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  pcTagText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    letterSpacing: 1,
  },
  pcPlat: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pcPlatText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    letterSpacing: 1.2,
  },
  pcName: {
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 19,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  pcDesc: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11.5,
    lineHeight: 20,
    marginBottom: 10,
    paddingRight: 60, // Avoid overlapping the absolute view button
  },
  pcTech: {
    flexDirection: 'row',
    gap: 5,
    paddingRight: 65, // Avoid overlapping the absolute view button
  },
  pcPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  pcPillText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    letterSpacing: 1,
  },
  pcViewBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 100, // Capsule design
  },
  pcViewBtnText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    letterSpacing: 1,
  },
});
