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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check for special character combination
    if (request.mainCharacter === 'Maddie' && request.sidekick === 'Tom') {
      return SPECIAL_STORIES.MADDIE_AND_TOM;
    }

    // Generate a standard story
    return {
      title: `The Adventures of ${request.mainCharacter} and ${request.sidekick}`,
      pages: [
        {
          text: `Once upon a time in ${request.setting}, there lived a wonderful ${request.mainCharacter} who had a best friend named ${request.sidekick}.`,
          imageUrl: `https://placehold.co/800x600/9333ea/ffffff?text=Meet+${request.mainCharacter}`
        },
        {
          text: `Every day, ${request.mainCharacter} and ${request.sidekick} would explore the magical ${request.setting}, finding new adventures and making new friends.`,
          imageUrl: `https://placehold.co/800x600/3b82f6/ffffff?text=Exploring+${request.setting}`
        },
        {
          text: `One day, they discovered a mysterious treasure that would change their lives forever...`,
          imageUrl: `https://placehold.co/800x600/10b981/ffffff?text=The+Discovery`
        }
      ]
    };
  }
}; 