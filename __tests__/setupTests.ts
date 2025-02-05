// Add type declaration for global function
declare global {
  var logTestResult: (testName: string, data: {
    input: any;
    response: any;
    error?: any;
  }) => void;
}

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

// Add test result logging
const fs = require('fs');
const path = require('path');

// Create a logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'test-logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Helper to log test results
global.logTestResult = (testName: string, {input, response, error}: {
  input: any;
  response: any;
  error?: any;
}) => {
  const timestamp = new Date().toISOString();
  const logFile = path.join(logsDir, `test-results-${timestamp.split('T')[0]}.jsonl`);
  
  const logEntry = {
    timestamp,
    testName,
    input,
    response,
    error,
    model: process.env.OLLAMA_MODEL
  };

  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}; 