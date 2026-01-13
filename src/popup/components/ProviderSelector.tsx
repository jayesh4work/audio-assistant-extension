import React from 'react';
import { STTProviderType, AIProviderType } from '../../shared/types/providers';
import { STT_PROVIDERS, AI_PROVIDERS } from '../../shared/utils/constants';

interface Props {
  selectedSTT: STTProviderType;
  selectedAI: AIProviderType;
  onSTTChange: (provider: STTProviderType) => void;
  onAIChange: (provider: AIProviderType) => void;
}

export const ProviderSelector: React.FC<Props> = ({
  selectedSTT,
  selectedAI,
  onSTTChange,
  onAIChange
}) => {
  return (
    <div className="provider-selector">
      <div className="section">
        <h4>STT Provider</h4>
        {STT_PROVIDERS.map(p => (
          <label key={p.id} className="radio-label">
            <input 
              type="radio" 
              name="stt" 
              checked={selectedSTT === p.id} 
              onChange={() => onSTTChange(p.id)} 
            />
            {p.name} {p.isFree && <span className="badge">Free</span>}
          </label>
        ))}
      </div>

      <div className="section">
        <h4>AI Provider</h4>
        {AI_PROVIDERS.map(p => (
          <label key={p.id} className="radio-label">
            <input 
              type="radio" 
              name="ai" 
              checked={selectedAI === p.id} 
              onChange={() => onAIChange(p.id)} 
            />
            {p.name}
          </label>
        ))}
      </div>
    </div>
  );
};
