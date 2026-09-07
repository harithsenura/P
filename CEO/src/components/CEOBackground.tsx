import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Path, Rect, RadialGradient, Stop } from 'react-native-svg';
import { ThemeContext } from '../theme/ThemeContext';

export const CEOBackground = () => {
  const { theme, isDark } = useContext(ThemeContext);
  
  const gridColor = isDark ? 'rgba(144, 184, 207, 0.04)' : 'rgba(42, 127, 168, 0.05)';
  const glowColor = isDark ? '#90b8cf' : '#2a7fa8';

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bg }]}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <Path d="M 40 0 L 0 0 0 40" fill="none" stroke={gridColor} strokeWidth="1" />
          </Pattern>
          <RadialGradient id="glow" cx="50%" cy="20%" rx="80%" ry="80%">
            <Stop offset="0%" stopColor={glowColor} stopOpacity={isDark ? "0.07" : "0.09"} />
            <Stop offset="70%" stopColor={glowColor} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grid)" />
        <Rect width="100%" height="100%" fill="url(#glow)" />
      </Svg>
    </View>
  );
};
