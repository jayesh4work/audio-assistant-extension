# STT Integration - Extension Components

This document describes the Speech-to-Text (STT) integration components added to the extension.

## Architecture Overview

The extension now fully integrates with the backend STT service through the following components:

### Services

#### 1. TranscriptionClient (`src/shared/services/transcription-client.ts`)
- Handles communication with the backend `/api/transcribe` endpoint
- Sends audio blobs as multipart form data with language and provider settings
- Implements retry logic with exponential backoff (max 2 retries)
- Comprehensive error handling for various failure scenarios
- Timeout management (60 seconds default)

#### 2. TranscriptHistoryService (`src/shared/services/transcript-history-service.ts`)
- Manages session-based transcript history using `chrome.storage.session`
- Stores up to 20 most recent transcripts
- Provides CRUD operations for transcript history
- Auto-clears on session end

### Hooks

#### useTranscription (`src/popup/hooks/useTranscription.ts`)
Manages the transcription workflow state:
- **State:**
  - `isTranscribing`: boolean
  - `currentTranscript`: string
  - `lastResult`: TranscriptionResult | null
  - `error`: string | null
  - `providerUsed`: string

- **Methods:**
  - `startTranscription(audioData, language, sttProvider, audioDuration)`: Initiates transcription
  - `stopTranscription()`: Stops ongoing transcription
  - `clearTranscript()`: Clears current transcript
  - `clearError()`: Dismisses error messages

### Components

#### 1. TranscriptDisplay (Enhanced)
Displays transcription results with:
- Real-time transcription status
- Loading spinner during processing
- Provider information (which STT provider was used)
- Confidence score as percentage
- Processing time
- Detected language
- Error messages with dismiss button
- Copy to clipboard functionality

#### 2. TranscriptHistory
Session-based history panel showing:
- List of recent transcripts (up to 20)
- Timestamp, duration, provider, and confidence for each
- Preview of first 50 characters
- Click to view full transcript
- Delete individual items or clear all
- Session storage (cleared on extension reload)

#### 3. ProviderIndicator
Visual indicator showing:
- STT provider used (with icon and badge)
- Color coding:
  - Green: Primary provider (Groq)
  - Yellow: Fallback providers
  - Blue: Custom/user-provided APIs
- Fallback warning indicator
- Tooltip with provider details

### Types

#### TranscriptionResult
```typescript
{
  transcript: string;
  provider: string;
  confidence: number;
  processingTime: number;
  language: string;
  timestamp: Date;
}
```

#### Transcript (History)
```typescript
{
  transcript: string;
  provider: string;
  duration: number;
  timestamp: Date;
  confidence: number;
}
```

## Workflow

1. User starts recording audio
2. User stops recording
3. Audio blob is captured
4. `useTranscription.startTranscription()` is called with:
   - Audio blob
   - Selected language
   - Selected STT provider
   - Recording duration
5. TranscriptionClient sends request to backend
6. Backend processes audio and returns TranscriptionResult
7. Result is displayed in TranscriptDisplay
8. Result is added to TranscriptHistory
9. ProviderIndicator shows which provider was used

## Error Handling

The implementation handles:
- Network errors (connection timeout, no network)
- API errors (400, 401, 403, 404, 500, 503)
- Timeout errors (60-second limit)
- Audio encoding errors
- Provider unavailable errors
- Rate limiting (429)

Error messages are user-friendly and actionable:
- "Authentication required. Please sign in." (401)
- "Access denied. Check your API keys." (403)
- "Network error. Please check your connection." (Network failure)
- "Transcription timeout. The audio file may be too long." (Timeout)

Automatic retry logic:
- Max 2 retries with exponential backoff
- Only retries on transient errors (5xx, network issues)
- Does not retry on client errors (4xx except 429)

## Configuration

Constants in `src/shared/utils/constants.ts`:

```typescript
export const TRANSCRIPTION_CONFIG = {
  TIMEOUT: 60000,        // 60 seconds
  MAX_RETRIES: 2,        // Max retry attempts
  RETRY_DELAY: 1000,     // 1 second base delay
  MAX_HISTORY_ITEMS: 20, // Max history items
};
```

## UI/UX Features

1. **Real-time Feedback**
   - Loading spinner during transcription
   - Status messages ("Transcribing...", "Complete", etc.)
   - Progress indication

2. **History Management**
   - Toggleable history sidebar
   - Session-based storage
   - Quick access to previous transcripts
   - Delete individual or all items

3. **Provider Transparency**
   - Clear indication of which provider was used
   - Fallback provider warnings
   - Processing time and confidence metrics

4. **Error Recovery**
   - User-friendly error messages
   - Dismiss button for errors
   - Automatic retry on transient failures

## Testing

Test coverage includes:
- TranscriptionClient API calls and error handling
- useTranscription hook state management
- Component rendering and props
- History service CRUD operations
- Retry logic and timeout handling

Run tests:
```bash
npm test
```

## Integration with Backend

The extension expects the backend to provide:

**Endpoint:** `POST /api/transcribe`

**Request:**
- Content-Type: multipart/form-data
- Fields:
  - `audio`: Audio blob (WebM format)
  - `language`: Language code (e.g., "en-US")
  - `sttProvider`: Provider enum (e.g., "groq")

**Response:**
```json
{
  "transcript": "Transcribed text...",
  "provider": "groq",
  "confidence": 0.95,
  "processingTime": 1200,
  "language": "en-US",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Future Enhancements

Potential improvements:
- Persistent history (beyond session)
- Export transcript history
- Real-time streaming transcription
- Transcript editing/correction
- Share transcripts
- Transcript search/filter
- Multi-language support indicators
- Voice activity detection for auto-stop
