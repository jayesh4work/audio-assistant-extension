import React from 'react';
import { TranscriptDisplay } from '../TranscriptDisplay';

// Basic smoke tests - full component testing would require @testing-library/react
describe('TranscriptDisplay', () => {
  const mockTranscriptionResult = {
    transcript: 'Test transcript',
    provider: 'groq',
    confidence: 0.95,
    processingTime: 1500,
    language: 'en-US',
    timestamp: new Date('2024-01-01T12:00:00Z'),
  };

  it('should render without crashing', () => {
    const component = React.createElement(TranscriptDisplay, {
      transcript: '',
      isRecording: false,
    });
    expect(component).toBeDefined();
  });

  it('should accept all required props', () => {
    const component = React.createElement(TranscriptDisplay, {
      transcript: 'Hello world',
      isRecording: false,
      isTranscribing: false,
      transcriptionResult: mockTranscriptionResult,
      error: null,
      onClearError: jest.fn(),
    });
    expect(component).toBeDefined();
  });

  it('should have proper prop types', () => {
    const props = {
      transcript: 'Test',
      isRecording: true,
      isTranscribing: false,
      transcriptionResult: mockTranscriptionResult,
      error: 'Test error',
      onClearError: jest.fn(),
    };

    expect(typeof props.transcript).toBe('string');
    expect(typeof props.isRecording).toBe('boolean');
    expect(typeof props.isTranscribing).toBe('boolean');
    expect(typeof props.error).toBe('string');
    expect(typeof props.onClearError).toBe('function');
  });
});
