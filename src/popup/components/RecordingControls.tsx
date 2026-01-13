import React, { useState, useEffect } from 'react';

interface Props {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  error: string | null;
}

export const RecordingControls: React.FC<Props> = ({
  isRecording,
  onStart,
  onStop,
  error
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return [hrs, mins, secs].map(v => v.toString().padStart(2, '0')).join(':');
  };

  return (
    <div className="recording-controls">
      <div className={`status-indicator ${isRecording ? 'pulsing' : ''}`}>
        {isRecording ? '● Recording' : 'Ready to record'}
      </div>
      
      <div className="timer">{formatTime(seconds)}</div>

      <button 
        className={`record-button ${isRecording ? 'stop' : 'start'}`}
        onClick={isRecording ? onStop : onStart}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
