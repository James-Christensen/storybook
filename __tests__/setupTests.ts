// Mock the storyLogger to avoid actual logging during tests
jest.mock('../utils/storyLogger', () => ({
  storyLogger: {
    logStoryGeneration: jest.fn().mockResolvedValue(undefined)
  }
}));

// Set longer timeout for tests that interact with LLM
jest.setTimeout(30000);

// Mock environment variables if needed
process.env.OLLAMA_URL = process.env.OLLAMA_URL || 'http://192.168.0.131:11434/api/generate';
process.env.OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi4'; 