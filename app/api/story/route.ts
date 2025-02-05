import { Story, StoryRequest } from '../../../models/story';
import { storyLogger } from '../../../utils/storyLogger';
import { STORY_PROMPT } from './prompts/storyPrompt';
import { ASSET_MODE_PROMPT } from './prompts/assetPrompt';
import { generateStoryStructure, replaceTemplateVariables } from './utils/templateProcessor';

/**
 * Configuration for the LLM service
 */
const OLLAMA_URL = 'http://192.168.0.131:11434/api/generate';
const OLLAMA_MODEL = 'phi4'; //qwen2.5:32b or phi4. Phi4 is smaller and faster.

/**
 * Parses and validates the LLM response
 */
async function parseStoryResponse(data: any): Promise<Story> {
    const storyData = JSON.parse(data.response);
    if (!storyData.pages || !Array.isArray(storyData.pages)) {
        throw new Error('Invalid story format: missing pages array');
    }
    return storyData;
}

/**
 * POST handler for story generation
 * 
 * Input (StoryRequest):
 * - mainCharacter: string - The protagonist's name
 * - sidekick: string - Companion character name or "None"
 * - setting: string - Story location/environment
 * - pageCount: number - Number of pages (must be ≥ 2)
 * - generationMode: "default" | "asset" - Whether to use pre-made assets
 * 
 * Output (Success):
 * {
 *   title: string - Unique, creative story title
 *   subtitle: string - Brief story description
 *   pages: Array<{
 *     pageNumber: number
 *     text: string - 2-3 sentences of story content
 *     imageDescription: string - Detailed scene description
 *   }>
 *   generationMode: "default" | "asset"
 * }
 * 
 * Output (Error):
 * {
 *   error: string - Error description
 *   status: 500
 * }
 * 
 * The route:
 * 1. Processes the request into a template
 * 2. Sends the template to the LLM
 * 3. Validates and formats the response
 * 4. Logs the generation attempt
 */
export async function POST(request: Request) {
    const startTime = Date.now();
    let log: any = {
        timestamp: new Date().toISOString(),
        request: null,
        response: null,
        duration: 0,
        success: false
    };

    try {
        const storyRequest: StoryRequest = await request.json();
        log.request = storyRequest;
        console.log('Generating story for:', storyRequest);

        // Generate the story structure and process the template
        const structure = generateStoryStructure(storyRequest);
        const basePrompt = storyRequest.generationMode === 'asset' 
            ? `${STORY_PROMPT}\n${ASSET_MODE_PROMPT}` 
            : STORY_PROMPT;
        const prompt = replaceTemplateVariables(basePrompt, storyRequest, structure);
        
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

        const storyData = await parseStoryResponse(data);

        // Update log with successful response
        log.success = true;
        log.response = storyData;
        log.duration = Date.now() - startTime;

        // Log the story generation
        await storyLogger.logStoryGeneration(log);

        return Response.json({ 
            title: storyData.title,
            subtitle: storyData.subtitle,
            pages: storyData.pages,
            generationMode: storyRequest.generationMode
        });

    } catch (error) {
        log.error = error instanceof Error ? error.message : 'Failed to generate story';
        log.duration = Date.now() - startTime;
        await storyLogger.logStoryGeneration(log);

        console.error('Story generation error:', error);
        return Response.json(
            { error: error instanceof Error ? error.message : 'Failed to generate story' },
            { status: 500 }
        );
    }
} 




