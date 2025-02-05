/**
 * Base prompt template for story generation.
 * 
 * Template Variables:
 * - {mainCharacter}: The protagonist's name
 * - {hasSidekick}: Conditional text for sidekick inclusion
 * - {setting}: The story's location/environment
 * - {pageCount}: Number of pages requested
 * - {storyStructure}: Generated story outline
 * - {themeGuideline}: Theme based on whether there's a sidekick
 */
export const STORY_PROMPT = `
Create a magical children's story about {mainCharacter}{hasSidekick} having an adventure in {setting}.
The story should be enchanting, fun, and suitable for young children aged 2-6.

IMPORTANT: The story MUST be exactly {pageCount} pages long, no more and no less.

First, create a creative and unique title for the story. The title should be engaging and reflect the specific adventure that will happen in the story. Don't use generic titles like "{mainCharacter}'s Adventure in {setting}" - make it unique and specific to the story you're about to tell!

Then, create the story itself.

Return everything as a JSON object with this structure:
{
  "title": "The creative story title you generated",
  "subtitle": "A short, engaging subtitle that captures the essence of the adventure",
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
{storyStructure}

Important guidelines:
- Keep the tone warm and friendly throughout
- Include moments of humor and wonder
- Show the characters expressing different emotions
- {themeGuideline}
- Make sure each page's text flows naturally when read aloud
- Include vivid sensory details in both text and image descriptions
- Make the image descriptions detailed enough to generate consistent character appearances across all illustrations
- IMPORTANT: The story MUST contain exactly {pageCount} pages, no more and no less

Make the story engaging and the image descriptions vivid and detailed, maintaining consistent character appearances throughout all scenes.
`; 