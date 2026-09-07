import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { CEOBackground } from '../components/CEOBackground';

export const ChatScreen = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <CEOBackground />
      <ScreenHeader title="AI Chat" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlassCard style={{ alignItems: 'center', padding: 32 }}>
          <MessageSquare color={theme.text2} size={48} />
          <Text style={{ color: theme.text, fontFamily: 'Syne_600SemiBold', marginTop: 16, fontSize: 16 }}>Talk to your AI Guide</Text>
          <Text style={{ color: theme.text2, fontFamily: 'Syne_400Regular', marginTop: 8, textAlign: 'center' }}>
            Ask anything about your schedule, finances, habits, or projects.
          </Text>
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 120 },
});
