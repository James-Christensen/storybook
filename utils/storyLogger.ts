import fs from 'fs/promises';
import path from 'path';

export interface AssetMatchDetails {
  pose: {
    selected: {
      id: string;
      name: string;
      description: string;
      emotions: string[];
      actions: string[];
    };
    matchDetails: {
      score: number;
      matchedEmotions: string[];
      matchedActions: string[];
    };
    alternativesConsidered: Array<{
      id: string;
      name: string;
      score: number;
      matchedEmotions: string[];
      matchedActions: string[];
    }>;
  };
  background: {
    selected: {
      id: string;
      name: string;
      description: string;
      settings: string[];
      timeOfDay: string[];
    };
    matchDetails: {
      score: number;
      matchedSettings: string[];
      contextualMatches: string[];
    };
    alternativesConsidered: Array<{
      id: string;
      name: string;
      score: number;
      matchedSettings: string[];
      contextualMatches: string[];
    }>;
  };
}

export interface StoryGenerationLog {
  timestamp: string;
  request: {
    mainCharacter: string;
    sidekick: string;
    setting: string;
    pageCount: number;
    generationMode: string;
  };
  response: {
    title: string;
    subtitle: string;
    pages: Array<{
      pageNumber: number;
      text: string;
      imageDescription: string;
      assetMatching?: AssetMatchDetails;
    }>;
  };
  duration: number;
  success: boolean;
  error?: string;
}

export const storyLogger = {
  async logStoryGeneration(log: StoryGenerationLog) {
    try {
      // Create logs directory if it doesn't exist
      const logsDir = path.join(process.cwd(), 'logs', 'stories');
      await fs.mkdir(logsDir, { recursive: true });

      // Create filename with timestamp and generation mode
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const mode = log.request.generationMode;
      const filename = `story_${mode}_${timestamp}.json`;
      
      // Write log to file with pretty formatting
      await fs.writeFile(
        path.join(logsDir, filename),
        JSON.stringify(log, null, 2),
        'utf-8'
      );

      console.log(`Story generation logged to: ${filename}`);
    } catch (error) {
      console.error('Failed to log story generation:', error);
    }
  }
}; 