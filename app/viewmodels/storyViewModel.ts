import { Story, StoryRequest } from '../models/story';

export const storyViewModel = {
  async createStory(request: StoryRequest): Promise<Story> {
    try {
      console.log('Sending story request:', request);
      
      // Generate story text using Ollama
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate story');
      }

      if (!data.paragraphs || !Array.isArray(data.paragraphs) || data.paragraphs.length === 0) {
        throw new Error('Invalid story format received');
      }

      // Create story pages from paragraphs
      const pages = data.paragraphs.map((text: string, index: number) => ({
        text,
        imageUrl: `https://placehold.co/800x600/${index === 0 ? '9333ea' : index === 1 ? '3b82f6' : '10b981'}/ffffff?text=Page+${index + 1}`
      }));

      return {
        title: `The Adventures of ${request.mainCharacter} and ${request.sidekick}`,
        pages
      };

    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }
}; 