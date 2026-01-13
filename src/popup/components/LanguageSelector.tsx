import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../shared/utils/constants';

interface Props {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const LanguageSelector: React.FC<Props> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  return (
    <div className="language-selector">
      <label>Transcription Language</label>
      <select 
        value={selectedLanguage} 
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
