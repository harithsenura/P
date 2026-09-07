import React, { createContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './theme';

export const ThemeContext = createContext<{
  isDark: boolean;
  theme: typeof darkTheme | typeof lightTheme;
  toggleTheme: () => void;
}>({
  isDark: true,
  theme: darkTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  React.useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
