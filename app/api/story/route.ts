import { Story, StoryRequest } from '../../models/story';

const OLLAMA_URL = 'http://192.168.0.131:11434/api/generate';
const OLLAMA_MODEL = 'phi4'; //qwen2.5:32b or phi4. Phi4 is smaller and faster.

const STORY_PROMPT = `
Create a magical children's story about {mainCharacter}${(request: StoryRequest) => request.sidekick !== 'None' ? ` and their friend {sidekick}` : ''} having an adventure in {setting}.
The story should be enchanting, fun, and suitable for young children aged 2-6.

IMPORTANT: The story MUST be exactly {pageCount} pages long, no more and no less.

Return the story as a JSON array of exactly {pageCount} pages. Each page should contain:
- pageNumber: The page number (1-{pageCount})
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

Follow this story structure across exactly {pageCount} pages:
${(request: StoryRequest) => {
  const pages = [];
  const totalPages = request.pageCount;
  
  // Opening (always page 1)
  pages.push(`1. Opening Scene: Introduce {mainCharacter}${request.sidekick !== 'None' ? ` and {sidekick}` : ''} in their everyday setting, showing ${request.sidekick !== 'None' ? 'their special friendship' : 'their personality'}`);
  
  if (totalPages === 3) {
    // For 3-page stories
    pages.push(`2. Adventure: ${request.sidekick !== 'None' ? 'They discover' : `${request.mainCharacter} discovers`} something magical in {setting} and face an exciting challenge`);
    pages.push(`3. Happy Ending: ${request.sidekick !== 'None' ? 'They celebrate' : `${request.mainCharacter} celebrates`} their success and keep a special memory of the adventure`);
  } else {
    // For longer stories
    // Magical Discovery (always page 2)
    pages.push(`2. Magical Discovery: ${request.sidekick !== 'None' ? 'They discover' : `${request.mainCharacter} discovers`} something extraordinary in {setting} that sparks curiosity and sets up the adventure`);
    
    // Middle pages (challenges and development)
    const middlePages = totalPages - 3; // Subtract opening, discovery, and ending
    for (let i = 0; i < middlePages; i++) {
      const pageNum = i + 3;
      if (i === 0) {
        pages.push(`${pageNum}. First Challenge: ${request.sidekick !== 'None' ? 'They face' : `${request.mainCharacter} faces`} their first exciting challenge`);
      } else if (i === Math.floor(middlePages / 2)) {
        pages.push(`${pageNum}. Main Challenge: ${request.sidekick !== 'None' ? 'They work together using their unique abilities' : `${request.mainCharacter} uses creativity and courage`} to tackle the biggest challenge`);
      } else {
        pages.push(`${pageNum}. Adventure Progress: ${request.sidekick !== 'None' ? 'Their teamwork' : `${request.mainCharacter}'s determination`} leads to exciting developments`);
      }
    }
    
    // Happy Ending (always last page)
    pages.push(`${totalPages}. Happy Ending: A heartwarming conclusion where ${request.sidekick !== 'None' ? 'they celebrate' : `${request.mainCharacter} celebrates`} the adventure with a special memory or magical keepsake`);
  }
  
  return pages.join('\n');
}}

Important guidelines:
- Keep the tone warm and friendly throughout
- Include moments of humor and wonder
- Show the characters expressing different emotions
- ${(request: StoryRequest) => request.sidekick !== 'None' ? 'Emphasize friendship, kindness, and working together' : 'Emphasize creativity, bravery, and self-discovery'}
- Make sure each page's text flows naturally when read aloud
- Include vivid sensory details in both text and image descriptions
- Make the image descriptions detailed enough to generate consistent character appearances across all illustrations
- IMPORTANT: The story MUST contain exactly {pageCount} pages, no more and no less

Make the story engaging and the image descriptions vivid and detailed, maintaining consistent character appearances throughout all scenes.
`;

export async function POST(request: Request) {
  try {
    const storyRequest: StoryRequest = await request.json();
    console.log('Generating story for:', storyRequest);
    
    // Create a function to process template strings with the request context
    const processTemplate = (template: string) => {
      return template.replace(/\$\{(request: StoryRequest) => ([^}]+)\}/g, (_, params, code) => {
        return eval(`((request: any) => ${code})(storyRequest)`);
      })
      .replace(/\{pageCount\}/g, storyRequest.pageCount.toString())
      .replace('{mainCharacter}', storyRequest.mainCharacter)
      .replace('{sidekick}', storyRequest.sidekick)
      .replace('{setting}', storyRequest.setting);
    };

    const prompt = processTemplate(STORY_PROMPT);
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



