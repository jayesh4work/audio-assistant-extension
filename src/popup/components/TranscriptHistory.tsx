import React, { useState, useEffect } from 'react';
import { Transcript } from '../../shared/types/transcription';
import { transcriptHistoryService } from '../../shared/services/transcript-history-service';
import { logger } from '../../shared/utils/logger';

interface Props {
  onSelectTranscript?: (transcript: Transcript) => void;
}

export const TranscriptHistory: React.FC<Props> = ({ onSelectTranscript }) => {
  const [history, setHistory] = useState<Transcript[]>([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const items = await transcriptHistoryService.getHistory();
      setHistory(items);
    } catch (error) {
      logger.error('Failed to load transcript history', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (timestamp: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await transcriptHistoryService.deleteTranscript(timestamp);
      setHistory(prev => prev.filter(item => item.timestamp.getTime() !== timestamp.getTime()));
      
      if (selectedTimestamp?.getTime() === timestamp.getTime()) {
        setSelectedTimestamp(null);
      }
    } catch (error) {
      logger.error('Failed to delete transcript', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Clear all transcript history?')) return;
    
    try {
      await transcriptHistoryService.clearHistory();
      setHistory([]);
      setSelectedTimestamp(null);
    } catch (error) {
      logger.error('Failed to clear history', error);
    }
  };

  const handleSelect = (item: Transcript) => {
    setSelectedTimestamp(item.timestamp);
    if (onSelectTranscript) {
      onSelectTranscript(item);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds.toFixed(0)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getProviderBadge = (provider: string): string => {
    const lowerProvider = provider.toLowerCase();
    if (lowerProvider.includes('groq')) return '⚡';
    if (lowerProvider.includes('whisper')) return '🎤';
    if (lowerProvider.includes('openai')) return '🤖';
    if (lowerProvider.includes('claude')) return '🧠';
    return '📝';
  };

  if (loading) {
    return (
      <div className="transcript-history">
        <div className="history-header">
          <h4>History</h4>
        </div>
        <div className="history-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="transcript-history">
      <div className="history-header">
        <h4>History</h4>
        {history.length > 0 && (
          <button
            className="clear-all-button"
            onClick={handleClearAll}
            title="Clear all history"
          >
            🗑️
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <p>No transcripts yet</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div
              key={item.timestamp.getTime()}
              className={`history-item ${
                selectedTimestamp?.getTime() === item.timestamp.getTime() ? 'selected' : ''
              }`}
              onClick={() => handleSelect(item)}
            >
              <div className="history-item-header">
                <span className="history-time">{formatTime(item.timestamp)}</span>
                <button
                  className="delete-button"
                  onClick={(e) => handleDelete(item.timestamp, e)}
                  aria-label="Delete transcript"
                  title="Delete"
                >
                  ✕
                </button>
              </div>

              <div className="history-item-meta">
                <span className="history-duration" title="Duration">
                  ⏱️ {formatDuration(item.duration)}
                </span>
                <span className="history-provider" title={`Provider: ${item.provider}`}>
                  {getProviderBadge(item.provider)} {item.provider}
                </span>
                <span className="history-confidence" title="Confidence">
                  {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <div className="history-item-preview">
                {truncateText(item.transcript)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
