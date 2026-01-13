import React, { useState } from 'react';
import { useAudio } from './hooks/useAudio';
import { useSettings } from './hooks/useSettings';
import { RecordingControls } from './components/RecordingControls';
import { AudioSourceSelector } from './components/AudioSourceSelector';
import { AudioLevelVisualizer } from './components/AudioLevelVisualizer';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { SettingsPanel } from './components/SettingsPanel';
import './styles/App.css';

export const App: React.FC = () => {
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const {
    isRecording,
    selectedMode,
    micLevel,
    tabLevel,
    combinedLevel,
    micStatus,
    tabStatus,
    error,
    startRecording,
    stopRecording,
    switchAudioMode,
  } = useAudio(settings.audioMode);

  const [showSettings, setShowSettings] = useState(false);
  const [transcript, setTranscript] = useState('');

  if (settingsLoading) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <header>
        <h1>Audio Assistant</h1>
        <button className="settings-toggle" onClick={() => setShowSettings(true)}>⚙️</button>
      </header>

      <main>
        {!showSettings ? (
          <>
            <AudioSourceSelector 
              selectedMode={selectedMode}
              onModeChange={(mode) => {
                switchAudioMode(mode);
                updateSettings({ audioMode: mode });
              }}
              micStatus={micStatus}
              tabStatus={tabStatus}
            />

            <AudioLevelVisualizer 
              micLevel={micLevel}
              tabLevel={tabLevel}
              combinedLevel={combinedLevel}
              mode={selectedMode}
              isRecording={isRecording}
            />

            <RecordingControls 
              isRecording={isRecording}
              onStart={startRecording}
              onStop={stopRecording}
              error={error}
            />

            <TranscriptDisplay 
              transcript={transcript}
              isRecording={isRecording}
            />
          </>
        ) : (
          <SettingsPanel 
            settings={settings}
            onUpdate={updateSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </main>
    </div>
  );
};
