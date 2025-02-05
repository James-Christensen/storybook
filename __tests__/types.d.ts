declare global {
  function logTestResult(testName: string, data: {
    input: any;
    response: any;
    error?: any;
  }): void;
}

export {}; 