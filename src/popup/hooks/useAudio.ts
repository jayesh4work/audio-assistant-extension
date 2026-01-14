import { useState, useRef, useEffect } from 'react';
import { AudioMode, AudioSourceStatus } from '../../shared/types/audio';
import { AudioCaptureService } from '../../shared/utils/audio';
import { logger } from '../../shared/utils/logger';

export const useAudio = (initialMode: AudioMode = 'mic-only') => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<AudioMode>(initialMode);
  
  const [micLevel, setMicLevel] = useState(0);
  const [tabLevel, setTabLevel] = useState(0);
  const [combinedLevel, setCombinedLevel] = useState(0);

  const [micStatus, setMicStatus] = useState<AudioSourceStatus>('ready');
  const [tabStatus, setTabStatus] = useState<AudioSourceStatus>('ready');

  const audioServiceRef = useRef(new AudioCaptureService());
  const animationFrameRef = useRef<number>();

  const startRecording = async (mode?: AudioMode) => {
    const activeMode = mode || selectedMode;
    setError(null);
    try {
      await audioServiceRef.current.startRecording(activeMode);
      setIsRecording(true);
      startVisualization();
      
      if (activeMode === 'mic-only' || activeMode === 'mic+tab') setMicStatus('recording');
      if (activeMode === 'tab-only' || activeMode === 'mic+tab') setTabStatus('recording');
    } catch (err: any) {
      setError(err.message || 'Failed to start recording');
      logger.error('Recording error', err);
    }
  };

  const stopRecording = async (): Promise<Blob | null> => {
    try {
      const blob = await audioServiceRef.current.stopRecording();
      setAudioBlob(blob);
      setIsRecording(false);
      stopVisualization();
      
      setMicStatus('ready');
      setTabStatus('ready');
      return blob;
    } catch (err: any) {
      setError(err.message || 'Failed to stop recording');
      return null;
    }
  };

  const startVisualization = () => {
    const audioContext = audioServiceRef.current.getAudioContext();
    if (!audioContext) return;

    const micStream = audioServiceRef.current.getMicrophoneStream();
    const tabStream = audioServiceRef.current.getTabAudioStream();
    const mixedStream = audioServiceRef.current.getMixedStream();

    const createAnalyzer = (stream: MediaStream) => {
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);
      return analyzer;
    };

    const micAnalyzer = micStream ? createAnalyzer(micStream) : null;
    const tabAnalyzer = tabStream ? createAnalyzer(tabStream) : null;
    const mixedAnalyzer = mixedStream ? createAnalyzer(mixedStream) : null;

    const bufferLength = micAnalyzer?.frequencyBinCount || 128;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      if (micAnalyzer) {
        micAnalyzer.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setMicLevel(Math.round((average / 255) * 100));
      }
      if (tabAnalyzer) {
        tabAnalyzer.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setTabLevel(Math.round((average / 255) * 100));
      }
      if (mixedAnalyzer) {
        mixedAnalyzer.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setCombinedLevel(Math.round((average / 255) * 100));
      }
      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();
  };

  const stopVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setMicLevel(0);
    setTabLevel(0);
    setCombinedLevel(0);
  };

  const switchAudioMode = (newMode: AudioMode) => {
    setSelectedMode(newMode);
    // Logic to update status if needed
  };

  useEffect(() => {
    return () => {
      stopVisualization();
      audioServiceRef.current.resetAudio();
    };
  }, []);

  return {
    isRecording,
    audioBlob,
    error,
    selectedMode,
    micLevel,
    tabLevel,
    combinedLevel,
    micStatus,
    tabStatus,
    startRecording,
    stopRecording,
    switchAudioMode,
    resetAudio: () => audioServiceRef.current.resetAudio(),
  };
};
