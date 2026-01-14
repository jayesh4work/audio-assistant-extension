import { Transcript, TranscriptionResult } from '../types/transcription';
import { TRANSCRIPTION_CONFIG } from '../utils/constants';
import { logger } from '../utils/logger';

class TranscriptHistoryService {
  private readonly STORAGE_KEY = 'transcript_history';

  async addTranscript(result: TranscriptionResult, duration: number): Promise<void> {
    try {
      const history = await this.getHistory();
      
      const transcript: Transcript = {
        transcript: result.transcript,
        provider: result.provider,
        duration,
        timestamp: result.timestamp,
        confidence: result.confidence,
      };

      // Add to beginning of array
      history.unshift(transcript);

      // Keep only the most recent items
      const trimmedHistory = history.slice(0, TRANSCRIPTION_CONFIG.MAX_HISTORY_ITEMS);

      await this.saveHistory(trimmedHistory);
    } catch (error) {
      logger.error('Failed to add transcript to history', error);
      throw error;
    }
  }

  async getHistory(): Promise<Transcript[]> {
    try {
      const result = await chrome.storage.session.get(this.STORAGE_KEY);
      const history = result[this.STORAGE_KEY] || [];
      
      // Convert timestamp strings back to Date objects
      return history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      logger.error('Failed to get transcript history', error);
      return [];
    }
  }

  async deleteTranscript(timestamp: Date): Promise<void> {
    try {
      const history = await this.getHistory();
      const filtered = history.filter(
        item => item.timestamp.getTime() !== timestamp.getTime()
      );
      await this.saveHistory(filtered);
    } catch (error) {
      logger.error('Failed to delete transcript', error);
      throw error;
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await chrome.storage.session.remove(this.STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to clear transcript history', error);
      throw error;
    }
  }

  private async saveHistory(history: Transcript[]): Promise<void> {
    await chrome.storage.session.set({ [this.STORAGE_KEY]: history });
  }
}

export const transcriptHistoryService = new TranscriptHistoryService();
