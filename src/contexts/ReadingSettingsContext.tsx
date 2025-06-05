
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReadingSettings } from '@/types/book';

interface ReadingSettingsContextType {
  settings: ReadingSettings;
  updateSettings: (newSettings: Partial<ReadingSettings>) => void;
}

const ReadingSettingsContext = createContext<ReadingSettingsContextType | undefined>(undefined);

const defaultSettings: ReadingSettings = {
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'inter',
  lineHeight: 'normal',
};

export const ReadingSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ReadingSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('readingSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('readingSettings', JSON.stringify(updatedSettings));
  };

  return (
    <ReadingSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ReadingSettingsContext.Provider>
  );
};

export const useReadingSettings = () => {
  const context = useContext(ReadingSettingsContext);
  if (context === undefined) {
    throw new Error('useReadingSettings must be used within a ReadingSettingsProvider');
  }
  return context;
};
