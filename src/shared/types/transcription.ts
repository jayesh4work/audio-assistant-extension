export interface TranscriptionResult {
  transcript: string;
  provider: string;
  confidence: number;
  processingTime: number;
  language: string;
  timestamp: Date;
}

export interface Transcript {
  transcript: string;
  provider: string;
  duration: number;
  timestamp: Date;
  confidence: number;
}
