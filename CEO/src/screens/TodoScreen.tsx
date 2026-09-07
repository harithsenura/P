import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Dimensions, PanResponder } from 'react-native';
import { Clock, Flame, Calendar, Activity } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, withTiming, Easing } from 'react-native-reanimated';
import { ThemeContext } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { CEOBackground } from '../components/CEOBackground';
import * as ExpoCalendar from 'expo-calendar';

export const TodoScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Habits' | 'Calendar'>('Tasks');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [realEvents, setRealEvents] = useState<any[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status === 'granted') {
          await loadRealEvents(currentDate);
        }
      } catch (err) {
        console.warn('ExpoCalendar permission error:', err);
      }
    })();
  }, [currentDate]);

  const loadRealEvents = async (date: Date) => {
    try {
      const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
      const calendarIds = calendars.map(c => c.id);
      
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      
      const events = await ExpoCalendar.getEventsAsync(calendarIds, start, end);
      
      if (events && events.length > 0) {
        const formatted = events.map(e => {
          const startTime = new Date(e.startDate);
          const endTime = new Date(e.endDate);
          const timeStr = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          const durationHrs = Math.max(0.5, Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) * 10) / 10);
          
          return {
            title: e.title || 'Untitled Event',
            time: timeStr,
            category: 'CALENDAR',
            duration: `${durationHrs}h`,
            location: e.location || 'No Location Scheduled',
            isReal: true
          };
        });
        setRealEvents(formatted);
      } else {
        setRealEvents([]);
      }
    } catch (err) {
      console.warn('Error loading real Apple Calendar events:', err);
      setRealEvents([]);
    }
  };

  const handlePrevMonth = () => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const maxDays = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(currentDate.getDate(), maxDays);
    setCurrentDate(new Date(d.getFullYear(), d.getMonth(), targetDay));
  };

  const handleNextMonth = () => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const maxDays = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(currentDate.getDate(), maxDays);
    setCurrentDate(new Date(d.getFullYear(), d.getMonth(), targetDay));
  };

  const handlePrevYear = () => {
    const d = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
    const maxDays = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(currentDate.getDate(), maxDays);
    setCurrentDate(new Date(d.getFullYear(), d.getMonth(), targetDay));
  };

  const handleNextYear = () => {
    const d = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1);
    const maxDays = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(currentDate.getDate(), maxDays);
    setCurrentDate(new Date(d.getFullYear(), d.getMonth(), targetDay));
  };

  const handleSelectDay = (day: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const getEventsForDate = (date: Date) => {
    if (realEvents && realEvents.length > 0) {
      return realEvents;
    }

    const day = date.getDate();
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [
        { title: 'Executive Weekend Reflection', time: '10:00 AM - 11:30 AM', category: 'RECOVERY', duration: '1.5h', location: 'Home Library' },
        { title: 'Family Deep Connection Time', time: '04:00 PM - 06:00 PM', category: 'PERSONAL', duration: '2.0h', location: 'Outdoors' }
      ];
    }

    const events = [
      { title: 'Core Operations Review', time: '10:00 AM - 11:00 AM', category: 'OPS', duration: '1.0h', location: 'Office HQ' },
      { title: 'Deep Work Block: Strategic Growth', time: '01:00 PM - 03:00 PM', category: 'FOCUS', duration: '2.0h', location: 'Private Study' }
    ];

    if (day % 2 === 0) {
      events.push({ title: 'AI Engine Integration Sprint', time: '04:00 PM - 05:30 PM', category: 'TECH', duration: '1.5h', location: 'Dev Bay B' });
    } else {
      events.push({ title: 'Product & UX Evolution Audit', time: '03:30 PM - 04:30 PM', category: 'DESIGN', duration: '1.0h', location: 'Design Studio' });
    }

    return events;
  };

  const getDaySegment = () => {
    const now = new Date();
    const hrs = now.getHours();
    const mins = now.getMinutes();
    const totalHrs = hrs + mins / 60;

    if (totalHrs >= 6 && totalHrs < 12) {
      return 'MORNING';
    } else if (totalHrs >= 12 && totalHrs < 16) {
      return 'AFTERNOON';
    } else if (totalHrs >= 16 && totalHrs < 23) {
      return 'NIGHT';
    } else if (totalHrs >= 23 || totalHrs < 1.5) {
      return 'MID NIGHT';
    } else {
      return 'LATE NIGHT';
    }
  };

  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [noteText, setNoteText] = useState('');

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Deploy portfolio update', time: 'Today at 10:00 AM', category: 'DEV', cycle: 'MORNING', completed: false },
    { id: 2, title: 'Call with design team', time: 'Today at 2:00 PM', category: 'DESIGN', cycle: 'AFTERNOON', completed: false },
    { id: 3, title: 'Review financial audit', time: 'Today at 5:30 PM', category: 'FINANCE', cycle: 'NIGHT', completed: false },
    { id: 4, title: 'Check server logs & backup', time: 'Today at 11:30 PM', category: 'OPS', cycle: 'MID NIGHT', completed: false },
  ]);

  const [habits, setHabits] = useState([
    { id: 1, name: 'Workout', streak: 12, completedDays: [1, 2, 3, 5, 7, 10, 12, 13, 15, 17], history: [1, 1, 1, 0, 1, 0, 1] },
    { id: 2, name: 'Read 10 Pages', streak: 7, completedDays: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], history: [1, 1, 1, 1, 1, 1, 0] },
    { id: 3, name: 'Meditation', streak: 5, completedDays: [1, 3, 4, 5, 7, 9, 10, 11, 12, 14, 15, 17], history: [1, 0, 1, 1, 1, 0, 1] },
  ]);

  const [habitLogs, setHabitLogs] = useState<{ [habitId: number]: Array<{ date: string, time: string, note: string, type: 'completed' | 'missed' }> }>({
    1: [
      { date: '17 May 2026', time: '07:15 PM', note: 'Felt incredibly energetic and smashed leg day!', type: 'completed' },
      { date: '15 May 2026', time: '06:30 PM', note: 'A bit tired but pushed through the daily cardio routine.', type: 'completed' },
      { date: '14 May 2026', time: '08:00 AM', note: 'Missed due to early morning deployment support.', type: 'missed' },
    ],
    2: [
      { date: '17 May 2026', time: '08:30 AM', note: 'Read Chapter 4 of Clean Architecture. Super insightful.', type: 'completed' },
      { date: '16 May 2026', time: '09:00 PM', note: 'Finished 12 pages before sleeping.', type: 'completed' },
    ],
    3: [
      { date: '17 May 2026', time: '06:00 AM', note: 'Felt very calm and aligned. 15 mins of breathwork.', type: 'completed' },
    ]
  });

  const handleAddLog = (type: 'completed' | 'missed') => {
    if (!noteText.trim() || !selectedHabit) return;

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog = {
      date: dateStr,
      time: timeStr,
      note: noteText,
      type
    };

    setHabitLogs(prev => ({
      ...prev,
      [selectedHabit.id]: [newLog, ...(prev[selectedHabit.id] || [])]
    }));

    const todayDay = now.getDate();
    if (type === 'completed') {
      setHabits(prev => prev.map(h => {
        if (h.id === selectedHabit.id) {
          const updatedDays = h.completedDays.includes(todayDay) 
            ? h.completedDays 
            : [...h.completedDays, todayDay];
          const newHistory = [...h.history];
          newHistory[newHistory.length - 1] = 1;
          return {
            ...h,
            streak: h.streak + 1,
            completedDays: updatedDays,
            history: newHistory
          };
        }
        return h;
      }));

      setSelectedHabit((prev: any) => ({
        ...prev,
        streak: prev.streak + 1,
        completedDays: prev.completedDays.includes(todayDay) ? prev.completedDays : [...prev.completedDays, todayDay]
      }));
    } else {
      setHabits(prev => prev.map(h => {
        if (h.id === selectedHabit.id) {
          const newHistory = [...h.history];
          newHistory[newHistory.length - 1] = 0;
          return {
            ...h,
            history: newHistory
          };
        }
        return h;
      }));
    }

    setNoteText('');
  };

  const SCREEN_WIDTH = Dimensions.get('window').width;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  const monthName = monthNames[month];

  const detailTranslateX = useSharedValue(SCREEN_WIDTH);

  const detailAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: detailTranslateX.value }],
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Trigger horizontal swipe back only if swipe is primarily horizontal and towards the right
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontal && gestureState.dx > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          detailTranslateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100 || gestureState.vx > 0.4) {
          detailTranslateX.value = withTiming(SCREEN_WIDTH, { 
            duration: 250, 
            easing: Easing.bezier(0.25, 1, 0.5, 1) 
          }, (finished) => {
            if (finished) {
              runOnJS(setSelectedHabit)(null);
            }
          });
        } else {
          detailTranslateX.value = withTiming(0, { 
            duration: 200, 
            easing: Easing.bezier(0.25, 1, 0.5, 1) 
          });
        }
      }
    })
  ).current;

  const handleBack = () => {
    detailTranslateX.value = withTiming(SCREEN_WIDTH, { 
      duration: 320, 
      easing: Easing.bezier(0.25, 1, 0.5, 1) 
    }, (finished) => {
      if (finished) {
        runOnJS(setSelectedHabit)(null);
      }
    });
  };

  const handleOpenDetail = (habit: any) => {
    setSelectedHabit(habit);
    detailTranslateX.value = withTiming(0, { 
      duration: 320, 
      easing: Easing.bezier(0.25, 1, 0.5, 1) 
    });
  };

  // Real-time Day Ends Countdown & Day Progress
  const [timeLeft, setTimeLeft] = useState('');
  const [dayProgress, setDayProgress] = useState(0);
  const dayProgressSV = useSharedValue(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        setDayProgress(100);
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      
      setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      
      const totalMsInDay = 24 * 60 * 60 * 1000;
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const passedMs = now.getTime() - startOfDay.getTime();
      setDayProgress((passedMs / totalMsInDay) * 100);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dayProgressSV.value = withSpring(dayProgress / 100, { damping: 20 });
  }, [dayProgress]);

  const dayAnimatedStyle = useAnimatedStyle(() => ({
    width: `${dayProgressSV.value * 100}%`,
  }));

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };



  return (
    <View style={styles.container}>
      <CEOBackground />
      <ScreenHeader title="Tasks & Habits" />
      
      {/* SEGMENTED TAB BAR */}
      <View style={[styles.tabBar, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {(['Tasks', 'Habits', 'Calendar'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                isActive && { backgroundColor: theme.surface2, borderColor: theme.border }
              ]}
            >
              <Text style={[
                styles.tabButtonText,
                { color: isActive ? theme.ice : theme.text2 }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ACTIVE TAB CONTENT */}
        {activeTab === 'Tasks' && (
          <View>
            {/* LIVE COUNTDOWN TIMER CARD */}
            <GlassCard style={styles.countdownCard}>
              <View style={styles.countdownHeader}>
                <Clock color={theme.ice} size={14} />
                <Text style={[styles.countdownTitle, { color: theme.ice }]}>TIME REMAINING IN THE DAY</Text>
              </View>
              <Text style={[styles.countdownTime, { color: theme.text }]}>{timeLeft}</Text>
              <View style={styles.segmentRow}>
                <Text style={[styles.segmentLabel, { color: theme.text2 }]}>CYCLE:</Text>
                <View style={[styles.segmentBadge, { borderColor: theme.ice }]}>
                  <Text style={[styles.segmentText, { color: theme.ice }]}>{getDaySegment()}</Text>
                </View>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: theme.surface2 }]}>
                <Animated.View style={[styles.progressBarFill, { backgroundColor: theme.ice }, dayAnimatedStyle]} />
              </View>
            </GlassCard>

            {/* SEPARATE TASK CARDS BY TIME CYCLE */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>TODAY'S TASKS</Text>
            {['MORNING', 'AFTERNOON', 'NIGHT', 'MID NIGHT'].map((cycle) => {
              const cycleTasks = tasks.filter(t => t.cycle === cycle);
              if (cycleTasks.length === 0) return null;

              const currentCycle = getDaySegment();
              const isActive = (cycle === currentCycle) || (currentCycle === 'LATE NIGHT' && cycle === 'MID NIGHT');

              return (
                <View key={cycle} style={{ marginBottom: 14, opacity: isActive ? 1 : 0.35 }}>
                  <Text style={[styles.cycleSectionTitle, { color: theme.ice }]}>{cycle}</Text>
                  {cycleTasks.map((task) => (
                    <GlassCard key={task.id} style={styles.taskCard}>
                      <View style={styles.taskCardContent}>
                        <TouchableOpacity 
                          onPress={() => toggleTask(task.id)}
                          style={[
                            styles.taskCheckbox, 
                            { borderColor: theme.ice, backgroundColor: task.completed ? theme.ice : 'transparent' }
                          ]}
                        >
                          {task.completed && <Text style={{ color: theme.surface, fontSize: 9, fontWeight: '900' }}>✓</Text>}
                        </TouchableOpacity>
                        <View style={styles.taskTextSection}>
                          <Text style={[
                            styles.taskCardTitle, 
                            { 
                              color: theme.text, 
                              textDecorationLine: task.completed ? 'line-through' : 'none', 
                              opacity: task.completed ? 0.6 : 1 
                            }
                          ]}>
                            {task.title}
                          </Text>
                          <Text style={[styles.taskCardTime, { color: theme.text2 }]}>{task.time}</Text>
                        </View>
                        <View style={[styles.pcTag, { borderColor: theme.border }]}>
                          <Text style={[styles.pcTagText, { color: theme.text2 }]}>{task.category}</Text>
                        </View>
                      </View>
                    </GlassCard>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'Habits' && (
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>HABIT STREAKS</Text>
            {habits.map((habit) => (
              <GlassCard key={habit.id} style={styles.habitCard}>
                <View style={styles.habitCardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Flame color={theme.ice} size={16} />
                    <Text style={[styles.habitName, { color: theme.text }]}>{habit.name}</Text>
                  </View>
                  <Text style={[styles.habitStreak, { color: theme.ice }]}>{habit.streak} DAY STREAK</Text>
                </View>
                
                <View style={styles.habitDotsRow}>
                  {habit.history.map((completed, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.habitDot, 
                        { backgroundColor: completed ? theme.ice : theme.surface2 }
                      ]} 
                    />
                  ))}
                </View>

                {/* VIEW BUTTON */}
                <TouchableOpacity 
                  onPress={() => handleOpenDetail(habit)}
                  style={[styles.habitViewBtn, { backgroundColor: theme.surface2, borderColor: theme.ice + '40' }]}
                >
                  <Text style={[styles.habitViewBtnText, { color: theme.ice }]}>VIEW</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
          </View>
        )}

        {activeTab === 'Calendar' && (
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>MONTH VIEW</Text>
            <GlassCard style={styles.calendarCard}>
              <View style={styles.calendarHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Calendar color={theme.ice} size={18} />
                  <Text style={[styles.calendarMonthText, { color: theme.text }]}>
                    {monthName} {year}
                  </Text>
                </View>
              </View>

              {/* Custom Month & Year Picker Row */}
              <View style={styles.pickerRow}>
                {/* Month Picker */}
                <View style={[styles.pickerSelector, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
                  <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn}>
                    <Text style={{ color: theme.ice, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 16 }}>◀</Text>
                  </TouchableOpacity>
                  <Text style={[styles.pickerText, { color: theme.text }]}>
                    {monthName.substring(0, 3)}
                  </Text>
                  <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
                    <Text style={{ color: theme.ice, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 16 }}>▶</Text>
                  </TouchableOpacity>
                </View>

                {/* Year Picker */}
                <View style={[styles.pickerSelector, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
                  <TouchableOpacity onPress={handlePrevYear} style={styles.arrowBtn}>
                    <Text style={{ color: theme.ice, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 16 }}>◀</Text>
                  </TouchableOpacity>
                  <Text style={[styles.pickerText, { color: theme.text }]}>
                    {year}
                  </Text>
                  <TouchableOpacity onPress={handleNextYear} style={styles.arrowBtn}>
                    <Text style={{ color: theme.ice, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 16 }}>▶</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Weekday headers row! */}
              <View style={styles.weekdayRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <Text key={idx} style={[styles.weekdayText, { color: theme.text2 }]}>{day}</Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {/* Empty offset spaces before first day of month */}
                {Array.from({ length: startOffset }).map((_, idx) => (
                  <View key={`empty-${idx}`} style={styles.calendarDayPlaceholder} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                  const isSelected = currentDate.getDate() === day;
                  
                  const checkDate = new Date(year, month, day);
                  const checkDayOfWeek = checkDate.getDay();
                  const showDot = checkDayOfWeek !== 0 && checkDayOfWeek !== 6;

                  return (
                    <TouchableOpacity 
                      key={day} 
                      onPress={() => handleSelectDay(day)}
                      style={[
                        styles.calendarDay, 
                        isToday && { borderColor: theme.ice, backgroundColor: theme.surface2, borderWidth: 2.5 },
                        isSelected && !isToday && { borderColor: theme.ice, backgroundColor: `${theme.ice}30`, borderWidth: 2.5 },
                        !isToday && !isSelected && showDot && { borderColor: theme.ice + '35', borderStyle: 'dashed', backgroundColor: theme.ice + '10' },
                        !isToday && !isSelected && !showDot && { borderColor: theme.border + '15', backgroundColor: theme.surface + '20' }
                      ]}
                    >
                      <Text style={[
                        styles.calendarDayText, 
                        { color: isSelected ? theme.ice : isToday ? theme.ice : theme.text }
                      ]}>
                        {day}
                      </Text>
                      {showDot && (
                        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: theme.ice, position: 'absolute', bottom: 6 }} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </GlassCard>

            {/* Synced Events List */}
            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={[styles.sectionTitle, { color: theme.text2, marginVertical: 0 }]}>
                  EVENTS ON {monthName} {currentDate.getDate()}, {year}
                </Text>
              </View>

              {getEventsForDate(currentDate).map((event, idx) => (
                <GlassCard key={idx} style={styles.eventCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={[styles.eventTime, { color: theme.ice }]}>
                        {event.time} ({event.duration})
                      </Text>
                      <Text style={[styles.eventTitle, { color: theme.text }]}>
                        {event.title}
                      </Text>
                      <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 11, color: theme.text2, marginTop: 4 }}>
                        📍 {event.location}
                      </Text>
                    </View>
                    <View style={[styles.eventCategoryBadge, { borderColor: theme.ice + '30', backgroundColor: theme.surface2 }]}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: theme.ice, letterSpacing: 0.5 }}>
                        {event.category}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* HABIT DETAIL OVERLAY VIEW */}
      {/* Pre-mounted to avoid JS layout frame drops on iPhone 14! */}
      <Animated.View {...panResponder.panHandlers} style={[styles.detailOverlay, { backgroundColor: theme.bg }, detailAnimatedStyle]}>
        <CEOBackground />
        <ScreenHeader title={selectedHabit?.name || 'HABIT DETAILS'} onBack={handleBack} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Calendar at the top of the detail page */}
          <Text style={[styles.sectionTitle, { color: theme.text2 }]}>MAY COMPLETION GRID</Text>
          <GlassCard style={styles.calendarCard}>
            <View style={styles.calendarHeaderRow}>
              <Calendar color={theme.ice} size={16} />
              <Text style={[styles.calendarMonthText, { color: theme.text }]}>MAY 2026</Text>
            </View>

            {/* Weekday headers row */}
            <View style={styles.weekdayRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <Text key={idx} style={[styles.weekdayText, { color: theme.text2 }]}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {/* May 1 is Friday, so 4 empty offset days before May 1 */}
              {Array.from({ length: 4 }).map((_, idx) => (
                <View key={`empty-${idx}`} style={styles.calendarDayPlaceholder} />
              ))}

              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const isCompleted = selectedHabit?.completedDays?.includes(day) || false;
                const isToday = day === 17;
                return (
                  <View 
                    key={day} 
                    style={[
                      styles.calendarDay, 
                      isCompleted && { borderColor: theme.ice, backgroundColor: `${theme.ice}30`, borderWidth: 1.5 },
                      isToday && { borderColor: theme.ice, backgroundColor: theme.surface2, borderWidth: 2 },
                      !isCompleted && !isToday && { borderColor: theme.border + '15', backgroundColor: theme.surface + '20' }
                    ]}
                  >
                    <Text style={[
                      styles.calendarDayText, 
                      { color: isCompleted ? theme.ice : isToday ? theme.ice : theme.text2 }
                    ]}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </GlassCard>

          {/* Form input for feelings/reasons */}
          <Text style={[styles.sectionTitle, { color: theme.text2, marginTop: 16 }]}>LOG TODAY'S SESSION</Text>
          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Syne_600SemiBold', color: theme.text2, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>
              HOW DID YOU FEEL / REASON FOR MISSING?
            </Text>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              placeholder="e.g. Smashed my workout goals, felt amazing!"
              placeholderTextColor={theme.text2 + '80'}
              style={[styles.textInput, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
              multiline
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity 
                onPress={() => handleAddLog('completed')}
                style={[styles.actionBtn, { backgroundColor: theme.ice, flex: 1 }]}
              >
                <Text style={[styles.actionBtnText, { color: theme.surface }]}>LOG SESSION</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleAddLog('missed')}
                style={[styles.actionBtn, { borderColor: theme.border, borderWidth: 1.5, backgroundColor: 'transparent', flex: 1 }]}
              >
                <Text style={[styles.actionBtnText, { color: theme.text }]}>LOG AS MISSED</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Logged entries list */}
          <Text style={[styles.sectionTitle, { color: theme.text2 }]}>LOGGED ENTRIES</Text>
          {selectedHabit && (habitLogs[selectedHabit.id] || []).map((log, idx) => (
            <GlassCard key={idx} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <View style={{ width: 6, height: 6, backgroundColor: log.type === 'completed' ? theme.ice : '#f87171' }} />
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11, color: theme.text2 }}>
                    {log.date} @ {log.time}
                  </Text>
                </View>
                <View style={[styles.logTag, { borderColor: log.type === 'completed' ? theme.ice : '#f87171' }]}>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: log.type === 'completed' ? theme.ice : '#f87171' }}>
                    {log.type.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 13, color: theme.text, lineHeight: 18 }}>
                {log.note}
              </Text>
            </GlassCard>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 120 },
  
  // TAB BAR STYLES
  tabBar: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginHorizontal: 12,
    marginBottom: 16,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabButtonText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },

  // COUNTDOWN CARD STYLES
  countdownCard: {
    marginBottom: 18,
    alignItems: 'center',
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  countdownTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  countdownTime: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 32,
    letterSpacing: 0.5,
    marginVertical: 4,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  segmentLabel: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 9,
    letterSpacing: 1,
  },
  segmentBadge: {
    borderWidth: 1,
    borderStyle: 'dashed',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  segmentText: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  progressBarBg: {
    height: 4,
    width: '100%',
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: '100%',
  },

  // SEPARATE TASK CARD STYLES
  sectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  cycleSectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  taskCard: {
    marginBottom: 10,
  },
  taskCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTextSection: {
    flex: 1,
    gap: 2,
  },
  taskCardTitle: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 14.5,
  },
  taskCardTime: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
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

  // HABIT TAB STYLES
  habitCard: {
    marginBottom: 12,
  },
  habitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitName: {
    fontFamily: 'Syne_700Bold',
    fontSize: 15.5,
  },
  habitStreak: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  habitDotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  habitDot: {
    width: 14,
    height: 14,
    borderRadius: 0, // Sharp aesthetic!
    flex: 1,
  },

  // CALENDAR TAB STYLES
  calendarCard: {
    padding: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  calendarMonthText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: '12.4%',
    aspectRatio: 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    margin: '0.9%',
    borderRadius: 6,
  },
  calendarDayText: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 14,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 6,
  },
  weekdayText: {
    width: '12.4%',
    textAlign: 'center',
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  calendarDayPlaceholder: {
    width: '12.4%',
    aspectRatio: 0.95,
    margin: '0.9%',
    backgroundColor: 'transparent',
  },
  detailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },

  // NEW HABIT SCREEN STYLES
  habitViewBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  habitViewBtnText: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  textInput: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 12,
    fontFamily: 'Syne_400Regular',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  logTag: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  eventCard: {
    padding: 16,
    marginBottom: 12,
  },
  eventTime: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 4,
  },
  eventTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 15,
    lineHeight: 20,
  },
  eventCategoryBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  pickerSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  arrowBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 12,
  },
  pickerText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
