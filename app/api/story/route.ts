import { Story, StoryRequest } from '../../models/story';

const OLLAMA_URL = 'http://192.168.0.131:11434/api/generate';
const OLLAMA_MODEL = 'phi4'; //qwen2.5:32b or phi4. Phi4 is smaller and faster.

const STORY_PROMPT = `
Create a magical children's story about {mainCharacter} and their friend {sidekick} having an adventure in {setting}.
The story should be enchanting, fun, and suitable for young children aged 2-6.

Return the story as a JSON array of exactly 6 pages. Each page should contain:
- pageNumber: The page number (1-6)
- text: 2-3 sentences of story text that are easy to read aloud
- imageDescription: A detailed description for generating an illustration of that page's scene. Focus on describing the visual elements, characters' appearances, emotions, and the setting.

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

Follow this 6-page story structure:
1. Opening Scene: Introduce {mainCharacter} and {sidekick} in their everyday setting, showing their special friendship and personalities
2. Magical Discovery: They discover something extraordinary in {setting} that sparks their curiosity and sets up the adventure
3. First Challenge: They encounter an interesting problem or puzzle that needs solving together
4. Working Together: {mainCharacter} and {sidekick} combine their unique abilities to tackle the challenge
5. Moment of Success: Their teamwork and friendship leads to a magical or surprising result
6. Happy Ending: A heartwarming conclusion where they celebrate their adventure and maybe keep a special memory or magical keepsake

Important guidelines:
- Keep the tone warm and friendly throughout
- Include moments of humor and wonder
- Show the characters expressing different emotions
- Emphasize friendship, kindness, and working together
- Make sure each page's text flows naturally when read aloud
- Include vivid sensory details in both text and image descriptions
- Make the image descriptions detailed enough to generate consistent character appearances across all illustrations

Make the story engaging and the image descriptions vivid and detailed, maintaining consistent character appearances throughout all scenes.
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


//Flux Image Generation

//Need two actions. One to generate the flux specific prompt based on the image description and one to generate the image.  

//Flux Prompt Generation- Use the image description to generate a detailed prompt for diffusion models. 

//API Call to drawthings flux model. 



