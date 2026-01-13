import { useState, useEffect } from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '../../shared/types/settings';
import { SettingsService } from '../../shared/services/settings-service';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loadedSettings = await SettingsService.loadSettings();
      setSettings(loadedSettings);
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      await SettingsService.saveSettings(updated);
      setSettings(updated);
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  const setSetting = async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    await updateSettings({ [key]: value });
  };

  return { settings, loading, error, updateSettings, setSetting, reloadSettings: loadSettings };
};
