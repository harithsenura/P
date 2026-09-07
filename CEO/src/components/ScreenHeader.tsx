import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon, ArrowLeft } from 'lucide-react-native';
import { ThemeContext } from '../theme/ThemeContext';

export const ScreenHeader = ({ 
  title, 
  showThemeToggle = false, 
  onBack 
}: { 
  title: string; 
  showThemeToggle?: boolean; 
  onBack?: () => void; 
}) => {
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
            <ArrowLeft color={theme.text} size={22} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
      </View>
      {showThemeToggle && (
        <TouchableOpacity 
          style={[styles.themeToggle, { borderColor: theme.border, backgroundColor: theme.surface2 }]} 
          onPress={toggleTheme}
        >
          {isDark ? <Sun color={theme.text} size={18} /> : <Moon color={theme.text} size={18} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 26,
    letterSpacing: -0.5,
  },
  themeToggle: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
