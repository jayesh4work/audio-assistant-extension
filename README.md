# Enhanced Audio Assistant Extension

Chrome Extension for capturing and transcribing microphone and tab audio using AI.

## Features
- **Multi-Source Audio Capture**: Record microphone, browser tab audio, or both mixed.
- **AI Transcription**: Support for Groq, OpenAI, and more.
- **Provider Agnostic**: Switch between different STT and AI providers.
- **Real-time Visualization**: Monitor audio levels for each source.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load in Chrome:
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder in this project

## Development
Run in watch mode:
```bash
npm run dev
```

## Supported Sources
- System Microphone
- Browser Tab Audio (YouTube, Spotify, Zoom web, etc.)

## Architecture
- **React 18**: Frontend UI (Popup)
- **Web Audio API**: Audio mixing and processing
- **Manifest v3**: Modern extension architecture
- **Webpack**: Bundling and build pipeline
