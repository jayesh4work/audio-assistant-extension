import { transcriptionClient } from '../transcription-client';
import { apiClient } from '../api-service';
import { STTProviderType } from '../../types/providers';
import { TranscriptionResult } from '../../types/transcription';

jest.mock('../api-service');

describe('TranscriptionClient', () => {
  const mockAudioBlob = new Blob(['mock audio'], { type: 'audio/webm' });
  const mockResponse: TranscriptionResult = {
    transcript: 'Hello world',
    provider: 'groq',
    confidence: 0.95,
    processingTime: 1200,
    language: 'en-US',
    timestamp: new Date('2024-01-01T12:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully transcribe audio', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await transcriptionClient.transcribeAudio(
      mockAudioBlob,
      'en-US',
      STTProviderType.GROQ
    );

    expect(result).toEqual(expect.objectContaining({
      transcript: 'Hello world',
      provider: 'groq',
      confidence: 0.95,
      processingTime: 1200,
      language: 'en-US',
    }));

    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/transcribe',
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  });

  it('should handle 400 errors', async () => {
    (apiClient.post as jest.Mock).mockRejectedValue({
      response: { status: 400, data: { message: 'Invalid audio' } },
    });

    await expect(
      transcriptionClient.transcribeAudio(mockAudioBlob, 'en-US', STTProviderType.GROQ)
    ).rejects.toThrow('Invalid audio');
  });

  it('should handle 401 errors', async () => {
    (apiClient.post as jest.Mock).mockRejectedValue({
      response: { status: 401 },
    });

    await expect(
      transcriptionClient.transcribeAudio(mockAudioBlob, 'en-US', STTProviderType.GROQ)
    ).rejects.toThrow('Authentication required');
  });

  it('should handle network errors', async () => {
    (apiClient.post as jest.Mock).mockRejectedValue({
      code: 'ERR_NETWORK',
      message: 'Network Error',
    });

    await expect(
      transcriptionClient.transcribeAudio(mockAudioBlob, 'en-US', STTProviderType.GROQ)
    ).rejects.toThrow('Network error');
  });

  it('should handle timeout errors', async () => {
    (apiClient.post as jest.Mock).mockRejectedValue({
      code: 'ECONNABORTED',
      message: 'timeout of 60000ms exceeded',
    });

    await expect(
      transcriptionClient.transcribeAudio(mockAudioBlob, 'en-US', STTProviderType.GROQ)
    ).rejects.toThrow('Transcription timeout');
  });

  it('should retry on server errors', async () => {
    (apiClient.post as jest.Mock)
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockResolvedValueOnce(mockResponse);

    const result = await transcriptionClient.transcribeAudio(
      mockAudioBlob,
      'en-US',
      STTProviderType.GROQ
    );

    expect(result.transcript).toBe('Hello world');
    expect(apiClient.post).toHaveBeenCalledTimes(3);
  });

  it('should not retry on client errors', async () => {
    (apiClient.post as jest.Mock).mockRejectedValue({
      response: { status: 400 },
    });

    await expect(
      transcriptionClient.transcribeAudio(mockAudioBlob, 'en-US', STTProviderType.GROQ)
    ).rejects.toThrow();

    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });
});
