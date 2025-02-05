/**
 * Additional prompt instructions for asset-based story generation.
 * 
 * In asset mode, image descriptions must align with:
 * - Character emotions/actions: neutral/standing, happy/excited, thinking/curious, 
 *   celebrating/jumping, running/exploring
 * - Settings: bedroom/home, park/playground, forest/nature, beach/ocean
 */
export const ASSET_MODE_PROMPT = `
IMPORTANT ADDITIONAL GUIDELINES FOR ASSET-BASED MODE:

For each page's imageDescription, focus on these specific elements that will determine which pre-made assets to use:
1. Character's emotion and action (choose from: neutral/standing, happy/excited, thinking/curious, celebrating/jumping, running/exploring)
2. Setting type (choose from: bedroom/home, park/playground, forest/nature, beach/ocean)

The descriptions should clearly indicate which pose and background would best match the scene.
Examples:
- "Maddie stands thoughtfully in her cozy bedroom, hand on chin as she wonders what adventure awaits."
- "Maddie runs excitedly through the magical forest, exploring every path with boundless energy."

Keep the actions and settings aligned with our available assets while maintaining an engaging story.
Remember to vary the poses throughout the story to make it dynamic and engaging.
`; 