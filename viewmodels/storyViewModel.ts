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

// Art style and quality modifiers to enhance image generation
const STYLE_MODIFIERS = {
  artStyle: 'children\'s book illustration style, digital art, vibrant colors, line art, cel shaded',
  quality: 'highly detailed, vivid colors, strong lines,',
  lighting: 'soft ambient lighting, gentle shadows',
  composition: 'rule of thirds, dynamic composition, balanced framing',
  atmosphere: 'whimsical, magical, enchanting',
  rendering: ''
} as const;

// Import character presets for consistent descriptions
import { CHARACTER_PRESETS, PET_PRESETS } from '../components/StoryForm';

const IMAGE_CONFIG = {
  serverIP: '192.168.0.131',
  port: '7860',
  baseURL: function() {
    return `http://${this.serverIP}:${this.port}`;
  }
};

interface CharacterDescription {
  name: string;
  description: string;
}

export const storyViewModel = {
  // Store character descriptions for the current story
  currentCharacters: new Map<string, CharacterDescription>(),

  initializeCharacterDescriptions(request: StoryRequest) {
    // Clear any existing character descriptions
    this.currentCharacters.clear();

    // Find the visual descriptions from presets
    const mainCharacterPreset = CHARACTER_PRESETS.find(preset => preset.name === request.mainCharacter);
    const sidekickPreset = PET_PRESETS.find(preset => preset.name === request.sidekick);

    // Set the main character description
    this.currentCharacters.set(request.mainCharacter, {
      name: request.mainCharacter,
      description: mainCharacterPreset?.visualDescription || 
        "A three year old toddler girl with brown hair, blue eyes, wearing a pink t-shirt, blue jeans, and pink converse shoes" // Default Maddie description
    });

    // Set the sidekick description
    this.currentCharacters.set(request.sidekick, {
      name: request.sidekick,
      description: sidekickPreset?.visualDescription || 
        "a grey miniature schnauzer puppy with a blue collar" // Default Tom description
    });

    console.log('Initialized character descriptions:', {
      mainCharacter: this.currentCharacters.get(request.mainCharacter),
      sidekick: this.currentCharacters.get(request.sidekick)
    });
  },

  replaceCharacterNamesWithDescriptions(text: string): string {
    let enhancedText = text;
    
    // Replace each character name with their description
    this.currentCharacters.forEach((character) => {
      // Create a regex that matches the character name as a whole word
      const nameRegex = new RegExp(`\\b${character.name}\\b`, 'g');
      enhancedText = enhancedText.replace(nameRegex, character.description);
    });

    return enhancedText;
  },

  enhancePrompt(imageDescription: string): string {
    console.log('Original image description:', imageDescription);

    // Replace character names with their descriptions
    const descriptionWithCharacters = this.replaceCharacterNamesWithDescriptions(imageDescription);
    console.log('Description with character details:', descriptionWithCharacters);

    // Split description into components for analysis
    const sentences = descriptionWithCharacters.split('. ').filter(Boolean);
    
    // Extract key elements from the description
    const mainSubjects = sentences[0] || ''; // Usually contains the main subjects and setting
    const actions = sentences[1] || ''; // Usually contains actions and emotions
    const details = sentences.slice(2).join('. ') || ''; // Additional details

    // Construct enhanced prompt following the rules
    const enhancedPrompt = [
      // 1. Subject and Setting (from original with character descriptions)
      mainSubjects,

      // 2. Actions, Poses, and Emotions (from original + enhancements)
      actions,

      // 3. Atmosphere and Mood
      STYLE_MODIFIERS.atmosphere,

      // 4. Artistic Style
      STYLE_MODIFIERS.artStyle,

      // 5. Details and Quality
      STYLE_MODIFIERS.quality,

      // 6. Additional Details (from original)
      details,

      // 7. Lighting
      STYLE_MODIFIERS.lighting,

      // 8. Composition
      STYLE_MODIFIERS.composition,

      // 9. Technical Quality
      STYLE_MODIFIERS.rendering
    ]
      .filter(Boolean) // Remove empty strings
      .join(', ');

    console.log('Enhanced prompt:', enhancedPrompt);
    return enhancedPrompt;
  },

  async generateImage(imageDescription: string, pageNumber: number): Promise<string> {
    console.log(`\n=== Generating image for page ${pageNumber} ===`);
    
    // Transform the basic image description into an enhanced prompt
    const enhancedPrompt = this.enhancePrompt(imageDescription);
    console.log('Using enhanced prompt:', enhancedPrompt);
    
    const requestBody = {
      prompt: enhancedPrompt,
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

      // Initialize character descriptions for this story
      this.initializeCharacterDescriptions(request);
      
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