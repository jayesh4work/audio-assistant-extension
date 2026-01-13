import React from 'react';
import { UserSettings } from '../../shared/types/settings';
import { ProviderSelector } from './ProviderSelector';
import { ApiKeyInput } from './ApiKeyInput';
import { LanguageSelector } from './LanguageSelector';

interface Props {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<Props> = ({
  settings,
  onUpdate,
  onClose
}) => {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3>Settings</h3>
        <button onClick={onClose}>Close</button>
      </div>
      
      <div className="settings-content">
        <LanguageSelector 
          selectedLanguage={settings.language}
          onLanguageChange={(lang) => onUpdate({ language: lang })}
        />

        <ProviderSelector 
          selectedSTT={settings.sttProvider}
          selectedAI={settings.aiProvider}
          onSTTChange={(stt) => onUpdate({ sttProvider: stt })}
          onAIChange={(ai) => onUpdate({ aiProvider: ai })}
        />

        <ApiKeyInput 
          apiKeys={settings.apiKeys}
          onSave={(keys) => onUpdate({ apiKeys: keys })}
        />

        <div className="advanced-settings">
          <label>
            <input 
              type="checkbox" 
              checked={settings.autoSave}
              onChange={(e) => onUpdate({ autoSave: e.target.checked })}
            />
            Auto-save transcripts
          </label>
        </div>
      </div>
    </div>
  );
};
