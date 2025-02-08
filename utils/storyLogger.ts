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

export interface AssetMatchingLog {
  pageNumber: number;
  description: string;
  metadata: {
    character: {
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
    };
    dimensions: {
      width: number;
      height: number;
      character: {
        width: number;
        height: number;
        position: {
          left: number;
          top: number;
        };
      };
    };
  };
}

export const storyLogger = {
  async logStoryGeneration(log: StoryGenerationLog) {
    try {
      // Always use the API route
      const response = await fetch('/api/log', {
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
      return data;
    } catch (error) {
      console.error('Failed to log story generation:', error);
    }
  },

  async logAssetMatching(log: AssetMatchingLog) {
    try {
      const response = await fetch('/api/log/asset-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          ...log
        })
      });

      if (!response.ok) {
        throw new Error('Failed to log asset matching');
      }

      const data = await response.json();
      console.log(`Asset matching logged to: ${data.filename}`);
      return data;
    } catch (error) {
      console.error('Failed to log asset matching:', error);
    }
  }
};

function formatTimestamp(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(/,/g, '').replace(/\s+/g, '_');
} 