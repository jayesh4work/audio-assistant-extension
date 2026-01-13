import { AudioMixer } from '../shared/utils/audio-mixer';

// Mock Web Audio API
class AudioContextMock {
  createMediaStreamDestination() {
    return {
      stream: {},
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  createGain() {
    return {
      gain: { value: 0 },
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  createMediaStreamSource() {
    return {
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  close() {}
}

(global as any).AudioContext = AudioContextMock;

describe('AudioMixer', () => {
  let mixer: AudioMixer;

  beforeEach(() => {
    mixer = new AudioMixer();
  });

  it('should initialize with default gain values', () => {
    expect(mixer).toBeDefined();
  });

  it('should set microphone gain correctly', () => {
    mixer.setMicrophoneGain(0.8);
  });

  it('should set tab audio gain correctly', () => {
    mixer.setTabAudioGain(0.2);
  });
});
