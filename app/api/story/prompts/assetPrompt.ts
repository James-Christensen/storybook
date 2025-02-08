/**
 * Additional prompt instructions for asset-based story generation.
 * 
 * In asset mode, image descriptions must align with:
 * - Character emotions/actions: neutral/standing, happy/excited, thinking/curious, 
 *   celebrating/jumping, running/exploring
 * - Settings: Maddie's room, home, backyard, park, forest, playground, library
 * - Time of day: day or night (night only available for indoor settings)
 */
export const ASSET_MODE_PROMPT = `
IMPORTANT ADDITIONAL GUIDELINES FOR ASSET-BASED MODE:

For each page's imageDescription, you must follow these strict rules for setting consistency:

1. SETTINGS AND TRANSITIONS:
- The story can start in any setting but must follow logical transitions:
  * Maddie's room and home areas are always available as transition points
  * Outdoor locations (park, forest, playground) must connect through logical paths
  * The library can only connect back to home
  * The backyard must connect to home
  
2. VALID SETTINGS AND THEIR ACTIVITIES:
- Maddie's Room: playing, reading, getting ready, resting
- Home: playing, eating, family time, preparing
- Backyard: playing, exploring, gardening
- Park: playing, walking, picnicking
- Forest: hiking, exploring, observing nature
- Playground: sliding, swinging, climbing
- Library: reading, choosing books, storytelling

3. TIME OF DAY:
- Indoor settings (room, home, library) can be day or night
- Outdoor settings must be during the day

4. CHARACTER POSES:
For each page, clearly indicate Maddie's emotion and action that best matches our available poses:
- Standing/neutral: for calm, observational moments
- Happy/excited: for joyful discoveries
- Thinking/curious: for moments of wonder
- Running/exploring: for active adventures
- Sitting: for quiet moments or rest
- Celebrating: for achievement moments

Example descriptions:
- "In her cozy room, Maddie sits cross-legged on her bed, thoughtfully reading a special book as evening approaches."
- "At the sunny playground, Maddie runs excitedly toward the bright red slide, her eyes sparkling with joy."
- "In the quiet library, Maddie stands near the colorful bookshelf, carefully choosing her next adventure."

IMPORTANT: Each scene must logically connect to the next, maintaining setting consistency throughout the story. Don't jump between unconnected settings (e.g., don't go directly from forest to library without returning home first).
`; 