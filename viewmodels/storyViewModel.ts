import { Story, StoryRequest, StoryPage } from '../models/story';
import { AssetMatchDetails, storyLogger } from '../utils/storyLogger';

const API_ENDPOINTS = {
  STORY: '/api/story',
  COMPOSE_IMAGE: '/api/compose-image'
} as const;

// TODO: Adjust timeout for production
// Currently set to 10 minutes for development to accommodate slower response times
// Consider reducing this to 30-60 seconds for production, or implementing
// a streaming response mechanism for better user experience
const TIMEOUT_MS = 600000; // 10 minutes

interface CharacterDescription {
  name: string;
  description: string;
}

export const storyViewModel = {
  // Store character descriptions for the current story
  currentCharacters: new Map<string, CharacterDescription>(),

  initializeCharacterDescriptions(request: StoryRequest) {
    this.currentCharacters.clear();
    this.currentCharacters.set('Maddie', {
      name: 'Maddie',
      description: 'A three year old toddler girl with brown hair, blue eyes, wearing a pink t-shirt, blue jeans, and pink converse shoes'
    });
    
    if (request.sidekick === 'Tom') {
      this.currentCharacters.set('Tom', {
        name: 'Tom',
        description: 'A grey miniature schnauzer puppy with a blue collar'
      });
    }
  },

  async generateImage(imageDescription: string, pageNumber: number): Promise<{
    imageUrl: string;
    assetMatching?: AssetMatchDetails;
  }> {
    console.log(`\n=== Generating image for page ${pageNumber} using asset mode ===`);
    
    const response = await fetch(API_ENDPOINTS.COMPOSE_IMAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        description: imageDescription,
        pageNumber,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Image composition failed: ${errorText}`);
    }

    const data = await response.json();
    return {
      imageUrl: data.imageData,
      assetMatching: {
        pose: data.metadata.pose,
        background: data.metadata.background
      }
    };
  },

  async createStoryText(request: StoryRequest): Promise<Story> {
    this.initializeCharacterDescriptions(request);
    
    const response = await fetch(API_ENDPOINTS.STORY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error('Failed to generate story text');
    }

    const data = await response.json();
    return {
      title: data.title,
      subtitle: data.subtitle,
      pages: data.pages,
      generationMode: request.generationMode
    };
  },

  async generateImagesForStory(
    story: Story,
    options?: {
      onProgress?: (currentPage: number, totalPages: number) => void;
      onImageGenerated?: (pageIndex: number, imageUrl: string, assetMatching?: AssetMatchDetails) => void;
    }
  ): Promise<void> {
    const totalPages = story.pages.length;
    
    for (let i = 0; i < totalPages; i++) {
      options?.onProgress?.(i + 1, totalPages);
      
      try {
        const result = await this.generateImage(
          story.pages[i].imageDescription, 
          i + 1
        );
        
        options?.onImageGenerated?.(i, result.imageUrl, result.assetMatching);
        
        // Update the story object with asset matching details
        if (result.assetMatching) {
          story.pages[i].assetMatching = result.assetMatching;
        }
      } catch (error) {
        console.error(`Failed to generate image for page ${i + 1}:`, error);
      }
    }
  },

  async createStory(
    request: StoryRequest, 
    options?: { 
      onGenerationProgress?: (status: 'writing' | 'drawing', page?: number, total?: number) => void 
    }
  ): Promise<Story> {
    const startTime = Date.now();
    
    try {
      console.log('\n=== Starting Story Generation ===');
      console.log('Story request:', request);

      // Initialize character descriptions for this story
      this.initializeCharacterDescriptions(request);
      
      options?.onGenerationProgress?.('writing');

      // Generate story text using Ollama with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      console.log('Sending request to Ollama API for story text...');
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
      console.log('\n=== Story Text Generated ===');
      console.log('Story structure:', {
        title: data.title,
        subtitle: data.subtitle,
        pageCount: data.pages?.length || 0,
        hasError: !!data.error
      });

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to create your story right now. Please try again.');
      }

      if (!data.pages || !Array.isArray(data.pages) || data.pages.length === 0) {
        throw new Error('Oops! Something went wrong with the story generation. Please try again.');
      }

      console.log('\n=== Starting Image Generation ===');
      console.log(`Generating images for ${data.pages.length} pages sequentially...`);

      // Generate images for each page sequentially
      const pages: StoryPage[] = [];
      for (const page of data.pages) {
        try {
          options?.onGenerationProgress?.('drawing', page.pageNumber, data.pages.length);
          console.log(`\nProcessing page ${page.pageNumber}...`);
          
          const result = await this.generateImage(
            page.imageDescription, 
            page.pageNumber
          );

          // Create the page with all details including asset matching
          const storyPage: StoryPage = {
            ...page,
            imageUrl: result.imageUrl,
            assetMatching: result.assetMatching
          };
          
          pages.push(storyPage);
          console.log(`Successfully completed page ${page.pageNumber}`);
          
        } catch (error) {
          console.error(`Error generating image for page ${page.pageNumber}:`, error);
          console.log('Falling back to placeholder image...');
          pages.push({
            ...page,
            imageUrl: `https://placehold.co/800x600/${
              page.pageNumber === 1 ? '9333ea' : 
              page.pageNumber === 2 ? '3b82f6' : 
              '10b981'
            }/ffffff?text=Page+${page.pageNumber}`
          });
        }
      }

      // Create the complete story with all details
      const story: Story = {
        title: data.title,
        subtitle: data.subtitle,
        pages,
        generationMode: request.generationMode
      };

      // Log the story generation with all details
      await storyLogger.logStoryGeneration({
        timestamp: new Date().toISOString(),
        request,
        response: {
          title: story.title,
          subtitle: story.subtitle,
          pages: story.pages
        },
        duration: Date.now() - startTime,
        success: true
      });

      console.log('\n=== Story Creation Complete ===');
      console.log('Final story structure:', {
        title: story.title,
        subtitle: story.subtitle,
        pageCount: story.pages.length,
        pagesWithImages: story.pages.filter(p => p.imageUrl).length,
        pagesWithPlaceholders: story.pages.filter(p => p.imageUrl?.includes('placehold.co')).length,
        pagesWithAssetMatching: story.pages.filter(p => p.assetMatching).length
      });

      return story;

    } catch (error) {
      // Add error logging with duration
      await storyLogger.logStoryGeneration({
        timestamp: new Date().toISOString(),
        request,
        duration: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      console.error('\n=== Story Creation Failed ===');
      console.error('Error details:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Story generation took too long. Please try again.');
      }
      throw error;
    }
  }
}; 