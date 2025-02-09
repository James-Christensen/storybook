import { StoryRequest } from '../../../../models/story';

/**
 * Validates a story generation request
 * @throws Error if the request is invalid
 */
export function validateStoryRequest(request: StoryRequest): void {
    const errors: string[] = [];

    // Check main character
    if (!request.mainCharacter?.trim()) {
        errors.push('Main character name is required');
    }

    // Check page count
    if (typeof request.pageCount !== 'number') {
        errors.push('Page count must be a number');
    } else if (request.pageCount < 3 || request.pageCount > 10) {
        errors.push('Page count must be between 3 and 10 pages');
    }

    // Check setting
    if (!request.setting?.trim()) {
        errors.push('Setting is required');
    }

    // Check sidekick (must be a string, can be "None")
    if (typeof request.sidekick !== 'string') {
        errors.push('Sidekick must be a string or "None"');
    }

    // Check generation mode
    if (request.generationMode !== 'asset') {
        errors.push('Generation mode must be "asset"');
    }

    // If any errors were found, throw them all at once
    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
} 