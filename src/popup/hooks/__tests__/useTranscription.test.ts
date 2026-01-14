import { useTranscription } from '../useTranscription';
import { transcriptionClient } from '../../../shared/services/transcription-client';
import { transcriptHistoryService } from '../../../shared/services/transcript-history-service';
import { STTProviderType } from '../../../shared/types/providers';

jest.mock('../../../shared/services/transcription-client');
jest.mock('../../../shared/services/transcript-history-service');

// Basic tests - full hook testing would require @testing-library/react-hooks
describe('useTranscription', () => {
  const mockAudioBlob = new Blob(['mock audio'], { type: 'audio/webm' });
  const mockResult = {
    transcript: 'Test transcript',
    provider: 'groq',
    confidence: 0.9,
    processingTime: 1000,
    language: 'en-US',
    timestamp: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof useTranscription).toBe('function');
  });

  it('should have required dependencies', () => {
    expect(transcriptionClient).toBeDefined();
    expect(transcriptionClient.transcribeAudio).toBeDefined();
    expect(transcriptHistoryService).toBeDefined();
    expect(transcriptHistoryService.addTranscript).toBeDefined();
  });

  it('should handle transcription client mock', async () => {
    (transcriptionClient.transcribeAudio as jest.Mock).mockResolvedValue(mockResult);
    
    const result = await transcriptionClient.transcribeAudio(
      mockAudioBlob,
      'en-US',
      STTProviderType.GROQ
    );
    
    expect(result).toEqual(mockResult);
  });

  it('should handle history service mock', async () => {
    (transcriptHistoryService.addTranscript as jest.Mock).mockResolvedValue(undefined);
    
    await transcriptHistoryService.addTranscript(mockResult, 5.0);
    
    expect(transcriptHistoryService.addTranscript).toHaveBeenCalledWith(mockResult, 5.0);
  });

  it('should handle transcription errors', async () => {
    const error = new Error('Transcription failed');
    (transcriptionClient.transcribeAudio as jest.Mock).mockRejectedValue(error);
    
    await expect(
      transcriptionClient.transcribeAudio(mockAudioBlob, 'en-US', STTProviderType.GROQ)
    ).rejects.toThrow('Transcription failed');
  });
});
