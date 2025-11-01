import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-full 
        text-gray-400 dark:text-gray-500
        hover:text-cyan-500 dark:hover:text-cyan-400
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors
      "
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <FaMoon size={22} /> : <FaSun size={22} />}
    </button>
  );
}