// Theme Toggle Utility
export const useThemeToggle = () => {
  const getCurrentTheme = () => {
    return localStorage.getItem('theme') || 'dark';
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1f2937';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      document.body.style.backgroundColor = '#000814';
      document.body.style.color = '#f1f2ff';
    }
  };

  const toggleTheme = () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    return newTheme;
  };

  const initTheme = () => {
    const theme = getCurrentTheme();
    applyTheme(theme);
  };

  return {
    getCurrentTheme,
    toggleTheme,
    initTheme
  };
};