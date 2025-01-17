import { Story, StoryRequest, StoryPage } from '../models/story';

const API_ENDPOINTS = {
  STORY: '/api/story'
} as const;

// TODO: Adjust timeout for production
// Currently set to 10 minutes for development to accommodate slower response times
// Consider reducing this to 30-60 seconds for production, or implementing
// a streaming response mechanism for better user experience
const TIMEOUT_MS = 600000; // 10 minutes

export const storyViewModel = {
  async createStory(request: StoryRequest): Promise<Story> {
    try {
      console.log('Sending story request:', request);
      
      // Generate story text using Ollama with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(API_ENDPOINTS.STORY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      console.log('API response:', data);

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to create your story right now. Please try again.');
      }

      if (!data.pages || !Array.isArray(data.pages) || data.pages.length === 0) {
        throw new Error('Oops! Something went wrong with the story generation. Please try again.');
      }

      // For now, keep using placeholder images but maintain the new structure
      const pages = data.pages.map((page: Omit<StoryPage, 'imageUrl'>) => ({
        ...page,
        imageUrl: `https://placehold.co/800x600/${
          page.pageNumber === 1 ? '9333ea' : 
          page.pageNumber === 2 ? '3b82f6' : 
          '10b981'
        }/ffffff?text=Page+${page.pageNumber}`
      }));

      return {
        title: `The Adventures of ${request.mainCharacter} and ${request.sidekick}`,
        pages
      };

    } catch (error) {
      console.error('Error creating story:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Story generation took too long. Please try again.');
      }
      throw error;
    }
  }
}; 