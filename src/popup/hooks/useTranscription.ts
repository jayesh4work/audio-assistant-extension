import { useState } from 'react';
import { TranscriptionResult } from '../../shared/types/transcription';
import { STTProviderType } from '../../shared/types/providers';
import { transcriptionClient } from '../../shared/services/transcription-client';
import { transcriptHistoryService } from '../../shared/services/transcript-history-service';
import { logger } from '../../shared/utils/logger';

export const useTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastResult, setLastResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [providerUsed, setProviderUsed] = useState('');

  const startTranscription = async (
    audioData: Blob,
    language: string,
    sttProvider: STTProviderType,
    audioDuration?: number
  ): Promise<void> => {
    setIsTranscribing(true);
    setError(null);
    setCurrentTranscript('');
    setProviderUsed('');

    try {
      logger.info('Starting transcription', { language, sttProvider, audioSize: audioData.size });
      
      const result = await transcriptionClient.transcribeAudio(
        audioData,
        language,
        sttProvider
      );

      setCurrentTranscript(result.transcript);
      setLastResult(result);
      setProviderUsed(result.provider);

      // Add to history if duration is provided
      if (audioDuration !== undefined) {
        await transcriptHistoryService.addTranscript(result, audioDuration);
      }

      logger.info('Transcription completed', {
        provider: result.provider,
        confidence: result.confidence,
        processingTime: result.processingTime,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Transcription failed';
      setError(errorMessage);
      logger.error('Transcription error', err);
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  };

  const stopTranscription = (): void => {
    setIsTranscribing(false);
  };

  const clearTranscript = (): void => {
    setCurrentTranscript('');
    setLastResult(null);
    setProviderUsed('');
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    isTranscribing,
    currentTranscript,
    lastResult,
    error,
    providerUsed,
    startTranscription,
    stopTranscription,
    clearTranscript,
    clearError,
  };
};
