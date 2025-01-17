import { StoryRequest, Story, StoryPage } from '../models/story';

const MOCK_STORY_SEGMENTS = [
  "Once upon a time, there was a brave {mainCharacter} who lived in a cozy house with their loyal friend, a {sidekick}.",
  "One beautiful morning, they decided to go on an adventure to the {setting}, where magical things were known to happen.",
  "At the {setting}, {mainCharacter} and {sidekick} discovered a mysterious glowing stone.",
  "The stone began to sparkle, and suddenly they could understand the language of all the animals around them!",
  "They spent the whole day making new friends and learning secrets about the {setting}.",
  "As the sun began to set, {mainCharacter} and {sidekick} headed home, knowing this was just the beginning of their many adventures together."
];

const MOCK_IMAGES = [
  "/placeholder/home.jpg",
  "/placeholder/journey.jpg",
  "/placeholder/discovery.jpg",
  "/placeholder/magic.jpg",
  "/placeholder/friends.jpg",
  "/placeholder/sunset.jpg"
];

export const storyViewModel = {
  generateStoryText: async (request: StoryRequest): Promise<string[]> => {
    console.log('Generating story text for:', request);
    
    // Replace placeholders in mock story segments
    return MOCK_STORY_SEGMENTS.map(segment => 
      segment
        .replace(/{mainCharacter}/g, request.mainCharacter)
        .replace(/{sidekick}/g, request.sidekick)
        .replace(/{setting}/g, request.setting)
    );
  },

  generateImagesForStory: async (paragraphs: string[]): Promise<string[]> => {
    console.log('Generating images for paragraphs:', paragraphs);
    // For now, return mock image URLs
    return MOCK_IMAGES.slice(0, paragraphs.length);
  },

  createStory: async (request: StoryRequest): Promise<Story> => {
    console.log('Creating story with request:', request);
    const paragraphs = await storyViewModel.generateStoryText(request);
    const images = await storyViewModel.generateImagesForStory(paragraphs);
    
    // Create pages from paragraphs and images
    const pages: StoryPage[] = paragraphs.map((text, index) => ({
      pageNumber: index + 1,
      text,
      imageUrl: images[index] || '/placeholder/default.jpg'
    }));

    return {
      title: `${request.mainCharacter}'s Adventure`,
      pages,
      currentPage: 1
    };
  }
}; 