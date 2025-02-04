# Story Generation API Documentation

This documentation covers the two main APIs used for story and image generation in the application.

## Story Generation API

### Endpoint
```
POST /api/story
```

### Description
Generates a children's story using the Ollama API with the specified model (currently phi4).

### Request Body
```typescript
interface StoryRequest {
  mainCharacter: string;    // Name of the main character
  sidekick: string;        // Name of the sidekick character or "None"
  setting: string;         // Story setting
  pageCount: number;       // Number of pages (3 or more)
}
```

### Response Format
```typescript
interface StoryResponse {
  pages: {
    pageNumber: number;           // Page number (1-N)
    text: string;                // 2-3 sentences of story text
    imageDescription: string;    // Detailed scene description for image generation
  }[];
}
```

### Example Usage
```typescript
const response = await fetch('/api/story', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mainCharacter: "Maddie",
    sidekick: "Tom",
    setting: "Enchanted Forest",
    pageCount: 3
  })
});
```

### Story Structure
- 3-page stories:
  1. Opening Scene
  2. Adventure
  3. Happy Ending
- Longer stories:
  1. Opening Scene
  2. Magical Discovery
  3. First Challenge
  4. Main Challenge (middle)
  5. Adventure Progress
  6. Happy Ending

---

## Image Generation API

### Endpoint
```
POST /api/image
```

### Description
Generates illustrations using the Flux API (Stable Diffusion) based on story page descriptions.

### Request Body
```typescript
interface ImageRequest {
  prompt: string;           // Enhanced image description
  model: string;           // Model name (e.g., 'flux_1_schnell_q5p.ckpt')
  loras?: {                // Optional LoRA models
    weight: number;
    file: string;
  }[];
  seed: number;           // Random seed (-1 for random)
  guidance_scale: number; // Guidance scale for generation
  steps: number;          // Number of inference steps
  width: number;          // Image width
  height: number;         // Image height
  sampler: string;        // Sampling method
  batch_count: number;    // Number of images to generate
}
```

### Response Format
```typescript
interface ImageResponse {
  images: string[];      // Array of base64-encoded PNG images
}
```

### Example Usage
```typescript
const response = await fetch('/api/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "A young girl in an enchanted forest...",
    model: "flux_1_schnell_q5p.ckpt",
    seed: -1,
    guidance_scale: 1.0,
    steps: 4,
    width: 768,
    height: 768,
    sampler: "Euler A Trailing",
    batch_count: 1
  })
});
```

### Image Generation Features

#### Style Modifiers
The system automatically enhances image prompts with:
- Art style (children's book illustration, digital art, etc.)
- Composition rules
- Atmospheric elements
- Lighting and rendering settings

#### Character Consistency
- Maintains consistent character appearances using predefined visual descriptions
- Special handling for specific characters (e.g., "Maddie" trigger word and LoRA)

#### Prompt Enhancement Process
1. Character name replacement with detailed descriptions
2. Addition of style modifiers
3. Integration of composition and technical quality parameters
4. Optional LoRA model application for specific characters

### Configuration

Both APIs use local servers with configurable IP and port settings:

- Ollama API: `http://192.168.0.131:11434/api/generate`
- Flux API: `http://192.168.0.131:7860/sdapi/v1/txt2img`

Update these configurations in their respective route files for different environments.

### Error Handling

Both APIs include comprehensive error handling and logging:
- Invalid requests return 400-level status codes
- Server errors return 500-level status codes
- All errors include descriptive messages
- Extensive console logging for debugging

### Performance Considerations

- Story generation has a 10-minute timeout (configurable)
- Image generation processes one page at a time sequentially
- Consider implementing streaming responses for better user experience in production

``` 