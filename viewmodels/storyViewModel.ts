import { Story, StoryRequest } from '../models/story';

const SPECIAL_STORIES = {
  MADDIE_AND_TOM: {
    title: "Maddie and Tom's Magical Adventure",
    pages: [
      {
        text: "Once upon a time, there was a wonderful little girl named Maddie who had a very special friend - a playful gray schnauzer named Tom. They loved going on adventures together!",
        imageUrl: "https://placehold.co/800x600/9333ea/ffffff?text=Maddie+%26+Tom"
      },
      {
        text: "One day, Maddie and Tom discovered a magical rainbow path in their backyard. Tom's whiskers started to sparkle with excitement!",
        imageUrl: "https://placehold.co/800x600/3b82f6/ffffff?text=The+Magic+Path"
      },
      {
        text: "Together they followed the path and found themselves in a beautiful garden where flowers sang sweet lullabies and butterflies danced in the air.",
        imageUrl: "https://placehold.co/800x600/10b981/ffffff?text=Magical+Garden"
      }
    ]
  }
};

export const storyViewModel = {
  async createStory(request: StoryRequest): Promise<Story> {
    // Check for special character combination
    if (request.mainCharacter === 'Maddie' && request.sidekick === 'Tom') {
      return SPECIAL_STORIES.MADDIE_AND_TOM;
    }

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