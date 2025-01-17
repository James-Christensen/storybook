import { Story, StoryRequest } from '../../models/story';

const OLLAMA_URL = 'http://192.168.0.131:11434/api/generate';

const STORY_PROMPT = `
Create a short children's story with exactly 3 paragraphs about {mainCharacter} and their friend {sidekick} having an adventure in {setting}.
The story should be magical, fun, and suitable for young children.
Each paragraph should be 2-3 sentences long.
Do not include any additional text, just the story paragraphs.
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
        model: 'qwen2.5:32b',
        prompt: prompt,
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
    const storyText = data.response;

    // Split the story into paragraphs
    const paragraphs = storyText
      .split('\n\n')
      .filter(Boolean)
      .slice(0, 3); // Ensure we only get 3 paragraphs

    console.log('Generated paragraphs:', paragraphs);
    return Response.json({ paragraphs });

  } catch (error) {
    console.error('Story generation error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    );
  }
} 