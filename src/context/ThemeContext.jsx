import { createContext, useContext, useState, useEffect } from 'react';

// Get the system preference
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 1. Check local storage
    const savedTheme = localStorage.getItem('theme');
    // 2. If no saved theme, use system preference
    return savedTheme || systemTheme;
  });

  useEffect(() => {
    const root = document.documentElement; // The <html> tag

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);