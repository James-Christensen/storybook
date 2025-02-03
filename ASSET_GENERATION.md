# Asset Generation Documentation

## Current Asset Creation Process

### Maddie Character LoRA
- Training data specifications
- Image generation parameters used
- Best practices for consistent results
- Known limitations and workarounds

### Image Generation Parameters
Current optimal settings for character generation:
```typescript
{
  model: 'flux_1_schnell_q5p.ckpt',
  guidance_scale: 1.0,
  steps: 4,
  width: 768,
  height: 768,
  sampler: 'Euler A Trailing'
}
```

### Style Guidelines
Current style modifiers that should be maintained for consistency:
```typescript
const STYLE_MODIFIERS = {
  artStyle: 'children\'s book illustration style, digital art, vibrant colors, line art, cel shaded, 1990s Disney style,',
  composition: 'rule of thirds, dynamic composition, balanced framing',
  atmosphere: 'whimsical, magical, enchanting, cartoonish'
}
``` 