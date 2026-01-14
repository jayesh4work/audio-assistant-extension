// Mock chrome API
global.chrome = {
  storage: {
    session: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    },
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
  },
};

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});
