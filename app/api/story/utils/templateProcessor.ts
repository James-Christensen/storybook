import { StoryRequest } from '../../../../models/story';

/**
 * Generates the story structure based on the request parameters
 */
export function generateStoryStructure(request: StoryRequest): string {
    const pages = [];
    const totalPages = request.pageCount;
    const hasSidekick = request.sidekick !== 'None';
    const mainCharacter = request.mainCharacter;
    
    // Opening (always page 1)
    pages.push(`1. Opening Scene: Introduce ${mainCharacter}${hasSidekick ? ` and ${request.sidekick}` : ''} in their everyday setting, showing ${hasSidekick ? 'their special friendship' : 'their personality'}`);
    
    if (totalPages === 3) {
        // For 3-page stories
        pages.push(`2. Adventure: ${hasSidekick ? 'They discover' : `${mainCharacter} discovers`} something magical in ${request.setting} and face an exciting challenge`);
        pages.push(`3. Happy Ending: ${hasSidekick ? 'They celebrate' : `${mainCharacter} celebrates`} their success and keep a special memory of the adventure`);
    } else {
        // For longer stories
        pages.push(`2. Magical Discovery: ${hasSidekick ? 'They discover' : `${mainCharacter} discovers`} something extraordinary in ${request.setting} that sparks curiosity and sets up the adventure`);
        
        const middlePages = totalPages - 3;
        for (let i = 0; i < middlePages; i++) {
            const pageNum = i + 3;
            if (i === 0) {
                pages.push(`${pageNum}. First Challenge: ${hasSidekick ? 'They face' : `${mainCharacter} faces`} their first exciting challenge`);
            } else if (i === Math.floor(middlePages / 2)) {
                pages.push(`${pageNum}. Main Challenge: ${hasSidekick ? 'They work together using their unique abilities' : `${mainCharacter} uses creativity and courage`} to tackle the biggest challenge`);
            } else {
                pages.push(`${pageNum}. Adventure Progress: ${hasSidekick ? 'Their teamwork' : `${mainCharacter}'s determination`} leads to exciting developments`);
            }
        }
        
        pages.push(`${totalPages}. Happy Ending: A heartwarming conclusion where ${hasSidekick ? 'they celebrate' : `${mainCharacter} celebrates`} the adventure with a special memory or magical keepsake`);
    }
    
    return pages.join('\n');
}

/**
 * Replaces template variables with actual content
 */
export function replaceTemplateVariables(template: string, request: StoryRequest, structure: string): string {
    const hasSidekick = request.sidekick !== 'None' ? ` and their friend ${request.sidekick}` : '';
    const themeGuideline = request.sidekick !== 'None' 
        ? 'Emphasize friendship, kindness, and working together' 
        : 'Emphasize creativity, bravery, and self-discovery';

    return template
        .replace(/\{mainCharacter\}/g, request.mainCharacter)
        .replace(/\{hasSidekick\}/g, hasSidekick)
        .replace(/\{sidekick\}/g, request.sidekick)
        .replace(/\{setting\}/g, request.setting)
        .replace(/\{pageCount\}/g, request.pageCount.toString())
        .replace(/\{themeGuideline\}/g, themeGuideline)
        .replace(/\{storyStructure\}/g, structure);
} 