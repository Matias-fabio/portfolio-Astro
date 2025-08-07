import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    // Actualizar clase en documentElement
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    // Actualizar estado local
    setTheme(newTheme);

    // Guardar en localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  // Evitar hidration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 hover:cursor-pointer"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 hover:cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      )}
    </button>
  );
}
