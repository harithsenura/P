import React, { useContext } from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ThemeContext } from '../theme/ThemeContext';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const GlassCard = ({ children, style }: Props) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Animated.View 
      entering={FadeInUp.duration(500).springify().damping(15)}
      style={[styles.container, { borderColor: theme.border }, style]}
    >
      <BlurView tint={theme.blurTint} intensity={35} style={StyleSheet.absoluteFill} />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 0,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: 16,
    padding: 16, // Default padding for a compact, clean look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  }
});
