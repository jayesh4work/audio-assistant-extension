import React, { useState, useRef } from 'react';
import { useAudio } from './hooks/useAudio';
import { useSettings } from './hooks/useSettings';
import { useTranscription } from './hooks/useTranscription';
import { RecordingControls } from './components/RecordingControls';
import { AudioSourceSelector } from './components/AudioSourceSelector';
import { AudioLevelVisualizer } from './components/AudioLevelVisualizer';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { SettingsPanel } from './components/SettingsPanel';
import { TranscriptHistory } from './components/TranscriptHistory';
import { ProviderIndicator } from './components/ProviderIndicator';
import { Transcript } from '../shared/types/transcription';
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
    error: audioError,
    startRecording,
    stopRecording,
    switchAudioMode,
    audioBlob,
  } = useAudio(settings.audioMode);

  const {
    isTranscribing,
    currentTranscript,
    lastResult,
    error: transcriptionError,
    providerUsed,
    startTranscription,
    clearTranscript,
    clearError,
  } = useTranscription();

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryTranscript, setSelectedHistoryTranscript] = useState<Transcript | null>(null);
  const recordingStartTimeRef = useRef<number | null>(null);

  const handleStartRecording = async () => {
    recordingStartTimeRef.current = Date.now();
    clearTranscript();
    setSelectedHistoryTranscript(null);
    await startRecording();
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    
    // Calculate recording duration
    const duration = recordingStartTimeRef.current 
      ? (Date.now() - recordingStartTimeRef.current) / 1000 
      : 0;

    if (blob) {
      try {
        await startTranscription(
          blob,
          settings.language,
          settings.sttProvider,
          duration
        );
      } catch (err) {
        // Error is already handled in useTranscription
        console.error('Transcription failed', err);
      }
    }
  };

  const handleSelectHistoryTranscript = (transcript: Transcript) => {
    setSelectedHistoryTranscript(transcript);
    clearTranscript();
  };

  const displayedTranscript = selectedHistoryTranscript?.transcript || currentTranscript;
  const displayedResult = selectedHistoryTranscript 
    ? {
        transcript: selectedHistoryTranscript.transcript,
        provider: selectedHistoryTranscript.provider,
        confidence: selectedHistoryTranscript.confidence,
        processingTime: 0,
        language: settings.language,
        timestamp: selectedHistoryTranscript.timestamp,
      }
    : lastResult;

  if (settingsLoading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Audio Assistant</h1>
        <div className="header-actions">
          <button 
            className={`history-toggle ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(!showHistory)}
            title="Transcript History"
          >
            📜
          </button>
          <button 
            className="settings-toggle" 
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="app-main">
        {!showSettings ? (
          <div className="main-content">
            <div className="primary-panel">
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
                onStart={handleStartRecording}
                onStop={handleStopRecording}
                error={audioError}
              />

              {(providerUsed || (displayedResult && !selectedHistoryTranscript)) && (
                <ProviderIndicator 
                  sttProvider={providerUsed || displayedResult?.provider}
                  aiProvider={settings.aiProvider}
                />
              )}

              <TranscriptDisplay 
                transcript={displayedTranscript}
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                transcriptionResult={displayedResult}
                error={transcriptionError}
                onClearError={clearError}
              />
            </div>

            {showHistory && (
              <div className="history-panel">
                <TranscriptHistory 
                  onSelectTranscript={handleSelectHistoryTranscript}
                />
              </div>
            )}
          </div>
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
