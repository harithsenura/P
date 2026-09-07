import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { CEOBackground } from '../components/CEOBackground';
import * as ExpoCalendar from 'expo-calendar';

export const CalendarScreen = () => {
  const { theme } = useContext(ThemeContext);
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
        console.warn('ExpoCalendar permission error in CalendarScreen:', err);
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
      console.warn('Error loading real Apple Calendar events in CalendarScreen:', err);
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

  return (
    <View style={styles.container}>
      <CEOBackground />
      <ScreenHeader title="Calendar" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
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

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 120 },
  sectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    marginVertical: 12,
  },
  calendarCard: {
    padding: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
