import { Story, StoryRequest, StoryPage, GenerationMode } from '../models/story';

const API_ENDPOINTS = {
  STORY: '/api/story',
  IMAGE: '/api/image',
  COMPOSE_IMAGE: '/api/compose-image'
} as const;

// TODO: Adjust timeout for production
// Currently set to 10 minutes for development to accommodate slower response times
// Consider reducing this to 30-60 seconds for production, or implementing
// a streaming response mechanism for better user experience
const TIMEOUT_MS = 600000; // 10 minutes

// Art style and quality modifiers to enhance image generation
const STYLE_MODIFIERS = {
  artStyle: 'children\'s book illustration style, digital art, vibrant colors, line art, cel shaded, 1990s Disney style,',
  quality: '',
  lighting: '',
  composition: 'rule of thirds, dynamic composition, balanced framing',
  atmosphere: 'whimsical, magical, enchanting, cartoonish',
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

    // Only set the sidekick description if it's not "None"
    if (request.sidekick !== 'None' && sidekickPreset) {
      this.currentCharacters.set(request.sidekick, {
        name: request.sidekick,
        description: sidekickPreset.visualDescription || 
          "a grey miniature schnauzer puppy with a blue collar" // Default Tom description
      });
    }

    console.log('Initialized character descriptions:', {
      mainCharacter: this.currentCharacters.get(request.mainCharacter),
      sidekick: request.sidekick !== 'None' ? this.currentCharacters.get(request.sidekick) : 'None'
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

    // Check if Maddie is the main character to add trigger word
    const isMaddie = Array.from(this.currentCharacters.values()).some(
      char => char.name === 'Maddie'
    );

    // Split description into components for analysis
    const sentences = descriptionWithCharacters.split('. ').filter(Boolean);
    
    // Extract key elements from the description
    const mainSubjects = sentences[0] || ''; // Usually contains the main subjects and setting
    const actions = sentences[1] || ''; // Usually contains actions and emotions
    const details = sentences.slice(2).join('. ') || ''; // Additional details

    // Construct enhanced prompt following the rules
    const enhancedPrompt = [
      // 0. Maddie trigger word if applicable
      isMaddie ? 'mddie' : '',

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

  async generateImage(imageDescription: string, pageNumber: number, mode: GenerationMode): Promise<string> {
    console.log(`\n=== Generating image for page ${pageNumber} using ${mode} mode ===`);
    
    if (mode === 'asset') {
      // Use asset-based composition
      const response = await fetch(API_ENDPOINTS.COMPOSE_IMAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: imageDescription })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Image composition failed: ${errorText}`);
      }

      const data = await response.json();
      return data.imageData;
    } else {
      // Use AI generation (existing code)
      const enhancedPrompt = this.enhancePrompt(imageDescription);
      console.log('Using enhanced prompt:', enhancedPrompt);
      
      const isMaddie = Array.from(this.currentCharacters.values()).some(
        char => char.name === 'Maddie'
      );

      const loras = isMaddie ? [
        {
          weight: 0.7,
          file: "maddie_lora_lora_f16.ckpt"
        }
      ] : [];

      const requestBody = {
        prompt: enhancedPrompt,
        model: 'flux_1_schnell_q5p.ckpt',
        loras,
        seed: -1,
        guidance_scale: 1.0,
        steps: 4,
        width: 768,
        height: 768,
        sampler: 'Euler A Trailing',
        batch_count: 1
      };

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

      const data = await response.json();
      
      if (!data.images || !data.images[0]) {
        throw new Error('No image was generated in the response');
      }

      return `data:image/png;base64,${data.images[0]}`;
    }
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
      onImageGenerated?: (pageIndex: number, imageUrl: string) => void;
    }
  ): Promise<void> {
    const totalPages = story.pages.length;
    
    for (let i = 0; i < totalPages; i++) {
      options?.onProgress?.(i + 1, totalPages);
      
      try {
        const imageUrl = await this.generateImage(
          story.pages[i].imageDescription, 
          i + 1,
          story.generationMode || 'ai' // Default to 'ai' for backward compatibility
        );
        
        options?.onImageGenerated?.(i, imageUrl);
      } catch (error) {
        console.error(`Failed to generate image for page ${i + 1}:`, error);
        // Continue with next image even if one fails
      }
    }
  },

  async createStory(
    request: StoryRequest, 
    options?: { 
      onGenerationProgress?: (status: 'writing' | 'drawing', page?: number, total?: number) => void 
    }
  ): Promise<Story> {
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
          const imageUrl = await this.generateImage(page.imageDescription, page.pageNumber, request.generationMode);
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
        title: data.title,
        subtitle: data.subtitle,
        pages,
        generationMode: request.generationMode
      };
      console.log('Final story structure:', {
        title: story.title,
        subtitle: story.subtitle,
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