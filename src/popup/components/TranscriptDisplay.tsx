import React from 'react';
import { TranscriptionResult } from '../../shared/types/transcription';

interface Props {
  transcript: string;
  isRecording: boolean;
  isTranscribing?: boolean;
  transcriptionResult?: TranscriptionResult | null;
  error?: string | null;
  onClearError?: () => void;
}

export const TranscriptDisplay: React.FC<Props> = ({
  transcript,
  isRecording,
  isTranscribing = false,
  transcriptionResult = null,
  error = null,
  onClearError,
}) => {
  const formatProcessingTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusMessage = (): string => {
    if (isRecording) return 'Recording...';
    if (isTranscribing) return 'Transcribing...';
    if (error) return 'Transcription failed';
    if (transcript) return 'Transcription complete';
    return 'No transcript yet';
  };

  return (
    <div className="transcript-display">
      <div className="transcript-header">
        <h4>Transcript</h4>
        <span className="transcript-status">{getStatusMessage()}</span>
      </div>

      {error && (
        <div className="transcript-error">
          <span className="error-message">{error}</span>
          {onClearError && (
            <button className="error-dismiss" onClick={onClearError} aria-label="Dismiss error">
              ✕
            </button>
          )}
        </div>
      )}

      {isTranscribing && (
        <div className="transcript-loading">
          <div className="spinner" />
          <span>Processing audio...</span>
        </div>
      )}

      {transcriptionResult && !isTranscribing && (
        <div className="transcript-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Provider:</span>
            <span className="metadata-value">{transcriptionResult.provider}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Confidence:</span>
            <span className="metadata-value">
              {(transcriptionResult.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Processing Time:</span>
            <span className="metadata-value">
              {formatProcessingTime(transcriptionResult.processingTime)}
            </span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Language:</span>
            <span className="metadata-value">{transcriptionResult.language}</span>
          </div>
        </div>
      )}

      <div className="transcript-content">
        {transcript || (isRecording ? 'Listening...' : 'No transcript yet.')}
      </div>

      {transcript && !isTranscribing && (
        <button
          className="copy-button"
          onClick={() => navigator.clipboard.writeText(transcript)}
        >
          📋 Copy to Clipboard
        </button>
      )}
    </div>
  );
};
