import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { ScreenHeader } from '../components/ScreenHeader';

export const HabitsScreen = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader title="Habits & Profile" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlassCard>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.text, fontFamily: 'Syne_600SemiBold', fontSize: 16 }}>Workout</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {[1, 1, 1, 0, 1, 0, 0].map((v, i) => (
                <View key={i} style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: v ? theme.ice : theme.surface2 }} />
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: theme.text, fontFamily: 'Syne_600SemiBold', fontSize: 16 }}>Read 10 Pages</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {[1, 1, 1, 1, 1, 1, 0].map((v, i) => (
                <View key={i} style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: v ? theme.ice : theme.surface2 }} />
              ))}
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
});
