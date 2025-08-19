'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

// Define the settings type
type Settings = {
  siteTitle: string;
  adminEmail: string;
  enableComments: boolean;
};

// Key for localStorage
const SETTINGS_KEY = 'zemenay_blog_settings';

// Default settings
const DEFAULT_SETTINGS: Settings = {
  siteTitle: 'Zemenay Tech Blog',
  adminEmail: 'info@zemenay.com',
  enableComments: true,
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Sync theme state with theme provider
  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Save to localStorage
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Success',
        description: 'Settings saved successfully!',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your blog settings and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => 
                  setSettings({...settings, siteTitle: e.target.value})
                }
                required
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => 
                  setSettings({...settings, adminEmail: e.target.value})
                }
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="enableComments">Enable Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Allow visitors to post comments on blog posts
                </p>
              </div>
              <Switch
                id="enableComments"
                checked={settings.enableComments}
                onCheckedChange={(checked) => 
                  setSettings({...settings, enableComments: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={isDarkMode}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </CardContent>
          
          <CardContent className="border-t pt-4">
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}