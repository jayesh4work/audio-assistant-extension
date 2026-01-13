import React from 'react';
import { AudioMode, AudioSourceStatus } from '../../shared/types/audio';

interface Props {
  selectedMode: AudioMode;
  onModeChange: (mode: AudioMode) => void;
  micStatus: AudioSourceStatus;
  tabStatus: AudioSourceStatus;
}

export const AudioSourceSelector: React.FC<Props> = ({
  selectedMode,
  onModeChange,
  micStatus,
  tabStatus
}) => {
  const modes: { id: AudioMode; label: string; icon: string; description: string }[] = [
    { id: 'mic-only', label: 'Microphone Only', icon: '🎤', description: 'Voice notes and personal recordings' },
    { id: 'tab-only', label: 'Tab Audio Only', icon: '🎬', description: 'Record video content without voice' },
    { id: 'mic+tab', label: 'Mic + Tab', icon: '🎤+🎬', description: 'Meetings with background audio' },
  ];

  const getStatusIcon = (status: AudioSourceStatus) => {
    switch (status) {
      case 'ready': return '✅ Ready';
      case 'recording': return '🔴 Recording';
      case 'denied': return '❌ Denied';
      case 'unavailable': return '⚠️ Unavailable';
      case 'error': return '⚠️ Error';
      default: return '';
    }
  };

  return (
    <div className="audio-source-selector">
      <h3>Audio Source</h3>
      <div className="modes-list">
        {modes.map((mode) => (
          <div 
            key={mode.id} 
            className={`mode-item ${selectedMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
          >
            <div className="mode-header">
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-label">{mode.label}</span>
            </div>
            <p className="mode-description">{mode.description}</p>
          </div>
        ))}
      </div>
      <div className="source-status">
        <div>Mic: {getStatusIcon(micStatus)}</div>
        <div>Tab: {getStatusIcon(tabStatus)}</div>
      </div>
    </div>
  );
};
