import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ht';

interface ScannerSettings {
  audioEnabled: boolean;
  language: Language;
}

interface ScannerSettingsContextType {
  settings: ScannerSettings;
  toggleAudio: () => void;
  setLanguage: (language: Language) => void;
  updateSettings: (newSettings: Partial<ScannerSettings>) => void;
}

const defaultSettings: ScannerSettings = {
  audioEnabled: true,
  language: 'en',
};

const ScannerSettingsContext = createContext<ScannerSettingsContextType | undefined>(undefined);

export function ScannerSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ScannerSettings>(defaultSettings);

  // Load settings from AsyncStorage on app start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('scannerSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.log('Error loading scanner settings:', error);
    }
  };

  const saveSettings = async (newSettings: ScannerSettings) => {
    try {
      await AsyncStorage.setItem('scannerSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.log('Error saving scanner settings:', error);
    }
  };

  const updateSettings = (newSettings: Partial<ScannerSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  const toggleAudio = () => {
    updateSettings({ audioEnabled: !settings.audioEnabled });
  };

  const setLanguage = (language: Language) => {
    updateSettings({ language });
  };

  return (
    <ScannerSettingsContext.Provider
      value={{
        settings,
        toggleAudio,
        setLanguage,
        updateSettings,
      }}
    >
      {children}
    </ScannerSettingsContext.Provider>
  );
}

export function useScannerSettings() {
  const context = useContext(ScannerSettingsContext);
  if (context === undefined) {
    throw new Error('useScannerSettings must be used within a ScannerSettingsProvider');
  }
  return context;
}