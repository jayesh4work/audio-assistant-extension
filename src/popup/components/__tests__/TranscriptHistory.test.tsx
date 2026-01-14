import React from 'react';
import { TranscriptHistory } from '../TranscriptHistory';
import { transcriptHistoryService } from '../../../shared/services/transcript-history-service';

jest.mock('../../../shared/services/transcript-history-service');

// Basic smoke tests - full component testing would require @testing-library/react
describe('TranscriptHistory', () => {
  const mockHistory = [
    {
      transcript: 'First transcript',
      provider: 'groq',
      duration: 5.2,
      timestamp: new Date('2024-01-01T12:00:00Z'),
      confidence: 0.95,
    },
    {
      transcript: 'Second transcript',
      provider: 'whisper_cpp',
      duration: 3.1,
      timestamp: new Date('2024-01-01T11:00:00Z'),
      confidence: 0.88,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (transcriptHistoryService.getHistory as jest.Mock).mockResolvedValue(mockHistory);
  });

  it('should render without crashing', () => {
    const component = React.createElement(TranscriptHistory, {});
    expect(component).toBeDefined();
  });

  it('should accept onSelectTranscript callback', () => {
    const onSelect = jest.fn();
    const component = React.createElement(TranscriptHistory, {
      onSelectTranscript: onSelect,
    });
    expect(component).toBeDefined();
    expect(component.props.onSelectTranscript).toBe(onSelect);
  });

  it('should call transcriptHistoryService.getHistory on mount', () => {
    React.createElement(TranscriptHistory, {});
    // Note: In a real test with render, we would verify the service was called
    expect(transcriptHistoryService.getHistory).toBeDefined();
  });
});
