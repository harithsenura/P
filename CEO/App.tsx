import React, { useContext } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CheckSquare, Calendar, DollarSign, Activity, Briefcase, MessageSquare, Award } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useFonts, Syne_400Regular, Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { IBMPlexMono_400Regular, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';

import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TodoScreen } from './src/screens/TodoScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { FinanceScreen } from './src/screens/FinanceScreen';
import { ProjectsScreen } from './src/screens/ProjectsScreen';
import { ChatScreen } from './src/screens/ChatScreen';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            borderTopWidth: 1,
            borderTopColor: theme.border,
            elevation: 0,
            height: 90,
            paddingBottom: 30,
            paddingTop: 10,
            backgroundColor: 'transparent',
          },
          tabBarBackground: () => (
            <BlurView tint={theme.blurTint} intensity={40} style={StyleSheet.absoluteFill} />
          ),
          tabBarActiveTintColor: theme.ice,
          tabBarInactiveTintColor: theme.text2,
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontFamily: 'Syne_600SemiBold',
            fontSize: 10,
            letterSpacing: 0.5,
            marginBottom: 5,
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={DashboardScreen} 
          options={{ tabBarIcon: ({ color }) => <Home color={color} size={22} /> }}
        />
        <Tab.Screen 
          name="Todo" 
          component={TodoScreen} 
          options={{ tabBarIcon: ({ color }) => <CheckSquare color={color} size={22} /> }}
        />
        <Tab.Screen 
          name="Skills" 
          component={ProjectsScreen} 
          options={{ tabBarIcon: ({ color }) => <Award color={color} size={22} /> }}
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ tabBarIcon: ({ color }) => <MessageSquare color={color} size={22} /> }}
        />
        <Tab.Screen 
          name="Finances" 
          component={FinanceScreen} 
          options={{ tabBarIcon: ({ color }) => <DollarSign color={color} size={22} /> }}
        />
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={{ tabBarItemStyle: { display: 'none' } }} // Hidden from tab bar
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const AppContent = () => {
  const { isDark } = useContext(ThemeContext);
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <Navigation />
    </>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
    IBMPlexMono_400Regular,
    IBMPlexMono_600SemiBold,
  });

  if (!fontsLoaded) {
    return null; // Or a splash screen
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
