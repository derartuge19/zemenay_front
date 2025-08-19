"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Ensure the component is mounted before rendering
  useEffect(() => {
    setMounted(true);
    
    // Log the current theme state for debugging
    console.log('Current theme:', { theme, resolvedTheme });
    
    // Manually ensure the theme class is set on the HTML element
    if (resolvedTheme) {
      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    }
  }, [theme, resolvedTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Toggling theme to:', newTheme);
    setTheme(newTheme);
    
    // Force update the HTML class immediately
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="w-10 h-10"
        aria-label="Toggle theme"
      >
        {resolvedTheme === 'light' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
      <div className="text-xs text-muted-foreground mt-1">
        {resolvedTheme === 'light' ? 'Light' : 'Dark'} Mode
      </div>
    </div>
  );
}
