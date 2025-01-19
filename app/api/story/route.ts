import { Story, StoryRequest } from '../../models/story';

const OLLAMA_URL = 'http://192.168.0.131:11434/api/generate';
const OLLAMA_MODEL = 'phi4'; //qwen2.5:32b or phi4. Phi4 is smaller and faster.

const STORY_PROMPT = `
Create a short children's story about {mainCharacter} and their friend {sidekick} having an adventure in {setting}.
The story should be magical, fun, and suitable for young children.

Return the story as a JSON array of exactly 3 pages. Each page should contain:
- pageNumber: The page number (1-3)
- text: 2-3 sentences of story text
- imageDescription: A detailed description for generating an illustration of that page's scene. Focus on describing the visual elements, characters' appearances, and the setting.

The response must be valid JSON in this format:
{
  "pages": [
    {
      "pageNumber": 1,
      "text": "string with 2-3 sentences",
      "imageDescription": "detailed visual description for AI image generation"
    },
    ...
  ]
}

Make the story engaging and the image descriptions vivid and detailed.
`;

export async function POST(request: Request) {
  try {
    const storyRequest: StoryRequest = await request.json();
    console.log('Generating story for:', storyRequest);
    
    const prompt = STORY_PROMPT
      .replace('{mainCharacter}', storyRequest.mainCharacter)
      .replace('{sidekick}', storyRequest.sidekick)
      .replace('{setting}', storyRequest.setting);

    console.log('Sending prompt to Ollama:', prompt);

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        format: 'json',
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error response:', errorText);
      throw new Error(`Failed to generate story: ${errorText}`);
    }

    const data = await response.json();
    console.log('Ollama response:', data);
    
    try {
      // Parse the response text as JSON since it's embedded in the Ollama response
      const storyData = JSON.parse(data.response);
      
      if (!storyData.pages || !Array.isArray(storyData.pages)) {
        throw new Error('Invalid story format: missing pages array');
      }

      // Return the parsed pages directly
      return Response.json({ pages: storyData.pages });

    } catch (parseError) {
      console.error('Failed to parse story JSON:', parseError);
      throw new Error('Story was not in the expected JSON format');
    }

  } catch (error) {
    console.error('Story generation error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    );
  }
} 