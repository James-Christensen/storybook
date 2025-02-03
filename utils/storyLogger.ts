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
  response?: {
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
      const response = await fetch(`${window.location.origin}/api/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      });

      if (!response.ok) {
        throw new Error('Failed to log story generation');
      }

      const data = await response.json();
      console.log(`Story generation logged to: ${data.filename}`);
    } catch (error) {
      console.error('Failed to log story generation:', error);
    }
  }
}; 