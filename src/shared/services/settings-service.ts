import { storage } from '../utils/storage';
import { UserSettings, DEFAULT_SETTINGS } from '../types/settings';
import { logger } from '../utils/logger';

const SETTINGS_KEY = 'user_settings';

export const SettingsService = {
  async loadSettings(): Promise<UserSettings> {
    try {
      const settings = await storage.get<UserSettings>(SETTINGS_KEY);
      return { ...DEFAULT_SETTINGS, ...settings };
    } catch (err) {
      logger.error('Failed to load settings', err);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await storage.set(SETTINGS_KEY, settings);
    } catch (err) {
      logger.error('Failed to save settings', err);
      throw err;
    }
  },

  async updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): Promise<void> {
    const settings = await this.loadSettings();
    settings[key] = value;
    await this.saveSettings(settings);
  }
};
