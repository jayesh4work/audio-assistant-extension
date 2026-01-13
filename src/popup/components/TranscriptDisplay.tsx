import React from 'react';

interface Props {
  transcript: string;
  isRecording: boolean;
}

export const TranscriptDisplay: React.FC<Props> = ({ transcript, isRecording }) => {
  return (
    <div className="transcript-display">
      <h4>Transcript</h4>
      <div className="transcript-content">
        {transcript || (isRecording ? "Listening..." : "No transcript yet.")}
      </div>
      {transcript && (
        <button onClick={() => navigator.clipboard.writeText(transcript)}>
          Copy to Clipboard
        </button>
      )}
    </div>
  );
};
