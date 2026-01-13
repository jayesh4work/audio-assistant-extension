import React from 'react';

interface Props {
  micLevel: number;
  tabLevel: number;
  combinedLevel: number;
  mode: string;
  isRecording: boolean;
}

export const AudioLevelVisualizer: React.FC<Props> = ({
  micLevel,
  tabLevel,
  combinedLevel,
  mode,
  isRecording
}) => {
  if (!isRecording) return null;

  return (
    <div className="visualizer-container">
      {(mode === 'mic-only' || mode === 'mic+tab') && (
        <div className="visualizer-bar-group">
          <label>Mic</label>
          <div className="progress-bg">
            <div 
              className="progress-fill mic-fill" 
              style={{ width: `${micLevel}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {(mode === 'tab-only' || mode === 'mic+tab') && (
        <div className="visualizer-bar-group">
          <label>Tab</label>
          <div className="progress-bg">
            <div 
              className="progress-fill tab-fill" 
              style={{ width: `${tabLevel}%` }}
            ></div>
          </div>
        </div>
      )}

      {mode === 'mic+tab' && (
        <div className="visualizer-bar-group">
          <label>Mixed</label>
          <div className="progress-bg">
            <div 
              className="progress-fill mixed-fill" 
              style={{ width: `${combinedLevel}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
