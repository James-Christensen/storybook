import { Story, StoryRequest, StoryPage } from '../models/story';

const API_ENDPOINTS = {
  STORY: '/api/story',
  IMAGE: '/api/image'
} as const;

// TODO: Adjust timeout for production
// Currently set to 10 minutes for development to accommodate slower response times
// Consider reducing this to 30-60 seconds for production, or implementing
// a streaming response mechanism for better user experience
const TIMEOUT_MS = 600000; // 10 minutes

const IMAGE_CONFIG = {
  serverIP: '192.168.0.131',
  port: '7860',
  baseURL: function() {
    return `http://${this.serverIP}:${this.port}`;
  }
};

export const storyViewModel = {
  async generateImage(imageDescription: string, pageNumber: number): Promise<string> {
    console.log(`\n=== Generating image for page ${pageNumber} ===`);
    console.log('Image prompt:', imageDescription);
    
    const requestBody = {
      prompt: imageDescription,
      model: 'flux_1_schnell_q5p.ckpt',
      loras: [],
      seed: -1,
      guidance_scale: 1.0,
      steps: 4,
      width: 768,
      height: 768,
      sampler: 'Euler A Trailing',
      batch_count: 1
    };

    console.log('Preparing request with config:', {
      model: requestBody.model,
      sampler: requestBody.sampler,
      steps: requestBody.steps,
      size: `${requestBody.width}x${requestBody.height}`
    });

    try {
      console.log('Sending request to image generation API...');
      const response = await fetch(API_ENDPOINTS.IMAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Image generation failed: ${errorText}`);
      }

      console.log('Successfully received API response, parsing data...');
      const data = await response.json();
      
      console.log(`Received response for page ${pageNumber}`);
      
      if (!data.images || !data.images[0]) {
        console.error('Invalid response structure:', data);
        throw new Error('No image was generated in the response');
      }

      const base64Length = data.images[0].length;
      console.log(`Generated image for page ${pageNumber} (base64 length: ${base64Length})`);
      
      if (base64Length < 1000) {
        console.warn('Warning: Unusually small base64 data received');
      }

      // Convert base64 to data URL
      return `data:image/png;base64,${data.images[0]}`;
    } catch (error) {
      console.error(`\n=== Image Generation Failed for Page ${pageNumber} ===`);
      console.error('Error details:', error);
      throw error;
    }
  },

  async createStory(request: StoryRequest): Promise<Story> {
    try {
      console.log('\n=== Starting Story Generation ===');
      console.log('Story request:', request);
      
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
          console.log(`\nProcessing page ${page.pageNumber}...`);
          const imageUrl = await this.generateImage(page.imageDescription, page.pageNumber);
          pages.push({
            ...page,
            imageUrl
          });
          console.log(`Successfully completed page ${page.pageNumber}`);
        } catch (error) {
          console.error(`Error generating image for page ${page.pageNumber}:`, error);
          console.log('Falling back to placeholder image...');
          // Fallback to placeholder on error
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

      console.log('\n=== Story Creation Complete ===');
      const story = {
        title: `The Adventures of ${request.mainCharacter} and ${request.sidekick}`,
        pages
      };
      console.log('Final story structure:', {
        title: story.title,
        pageCount: story.pages.length,
        pagesWithImages: story.pages.filter(p => p.imageUrl).length,
        pagesWithPlaceholders: story.pages.filter(p => p.imageUrl?.includes('placehold.co')).length
      });

      return story;

    } catch (error) {
      console.error('\n=== Story Creation Failed ===');
      console.error('Error details:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Story generation took too long. Please try again.');
      }
      throw error;
    }
  }
}; 