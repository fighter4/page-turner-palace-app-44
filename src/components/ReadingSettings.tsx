
import React from 'react';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import { X, Palette, Type, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReadingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReadingSettings: React.FC<ReadingSettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useReadingSettings();

  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700 text-gray-100';
      case 'sepia':
        return 'bg-amber-100 border-amber-200 text-amber-900';
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto">
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 transform transition-transform duration-300
        lg:relative lg:transform-none lg:w-72
        ${getThemeClasses()} border-l shadow-lg
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <h2 className="font-semibold">Reading Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'light', label: 'Light', color: 'bg-white border-gray-300' },
                { key: 'dark', label: 'Dark', color: 'bg-gray-900 border-gray-600' },
                { key: 'sepia', label: 'Sepia', color: 'bg-amber-50 border-amber-300' },
              ].map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => updateSettings({ theme: theme.key })}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200
                    ${theme.color}
                    ${settings.theme === theme.key 
                      ? 'ring-2 ring-amber-500 ring-offset-2' 
                      : 'hover:ring-1 hover:ring-gray-300'
                    }
                  `}
                >
                  <div className="text-xs font-medium text-center text-gray-800">
                    {theme.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <Type className="w-4 h-4 mr-2" />
              Font Size
            </h3>
            <div className="space-y-2">
              {[
                { key: 'small', label: 'Small', size: 'text-sm' },
                { key: 'medium', label: 'Medium', size: 'text-base' },
                { key: 'large', label: 'Large', size: 'text-lg' },
                { key: 'extra-large', label: 'Extra Large', size: 'text-xl' },
              ].map((size) => (
                <button
                  key={size.key}
                  onClick={() => updateSettings({ fontSize: size.key })}
                  className={`
                    w-full p-3 rounded-lg border transition-all duration-200 text-left
                    ${settings.fontSize === size.key 
                      ? 'bg-amber-100 border-amber-300 text-amber-800' 
                      : 'hover:bg-opacity-50 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className={size.size}>{size.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <Type className="w-4 h-4 mr-2" />
              Font Family
            </h3>
            <div className="space-y-2">
              {[
                { key: 'inter', label: 'Inter', class: 'font-inter' },
                { key: 'crimson', label: 'Crimson Text', class: 'font-crimson' },
                { key: 'open-sans', label: 'Open Sans', class: 'font-open-sans' },
              ].map((font) => (
                <button
                  key={font.key}
                  onClick={() => updateSettings({ fontFamily: font.key })}
                  className={`
                    w-full p-3 rounded-lg border transition-all duration-200 text-left
                    ${font.class}
                    ${settings.fontFamily === font.key 
                      ? 'bg-amber-100 border-amber-300 text-amber-800' 
                      : 'hover:bg-opacity-50 hover:bg-gray-100'
                    }
                  `}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <AlignLeft className="w-4 h-4 mr-2" />
              Line Height
            </h3>
            <div className="space-y-2">
              {[
                { key: 'normal', label: 'Normal', class: 'leading-normal' },
                { key: 'relaxed', label: 'Relaxed', class: 'leading-relaxed' },
                { key: 'loose', label: 'Loose', class: 'leading-loose' },
              ].map((lineHeight) => (
                <button
                  key={lineHeight.key}
                  onClick={() => updateSettings({ lineHeight: lineHeight.key })}
                  className={`
                    w-full p-3 rounded-lg border transition-all duration-200 text-left
                    ${lineHeight.class}
                    ${settings.lineHeight === lineHeight.key 
                      ? 'bg-amber-100 border-amber-300 text-amber-800' 
                      : 'hover:bg-opacity-50 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="text-sm">
                    Sample text with {lineHeight.label.toLowerCase()} line height for reading comfort.
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingSettings;
