# Character System Documentation

## Character Preset Structure
```typescript
interface CharacterPreset {
  name: string;
  description: string;
  visualDescription: string;
  emoji: string;
}
```

## Current Implementation
- Located in `components/StoryForm.tsx`
- Handles both main characters and sidekicks
- Used for both story and image generation

## Visual Description Guidelines
- Format and structure requirements
- Key elements to include
- Style consistency requirements

## Integration Points
1. Story Generation
   - How character descriptions are used in prompts
   - Special handling for specific characters

2. Image Generation
   - Character description integration
   - LoRA application logic
   - Pose and composition considerations 