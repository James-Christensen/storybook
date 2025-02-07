# Asset Organization Structure

## Character Assets
```
public/assets/characters/
├── maddie/
│   ├── v1/                    # Original assets
│   │   ├── neutral.png
│   │   ├── thinking.png
│   │   └── ...
│   └── v2/                    # New asset collection
│       ├── standing/
│       │   ├── neutral_1.png
│       │   ├── neutral_2.png
│       │   └── ...
│       ├── running/
│       │   ├── running_1.png
│       │   ├── running_2.png
│       │   └── ...
│       ├── thinking/
│       │   ├── thinking_1.png
│       │   ├── pointing_1.png
│       │   └── ...
│       ├── celebrating/
│       │   ├── victory_1.png
│       │   ├── happy_1.png
│       │   └── ...
│       └── interaction/
│           ├── with_tom_1.png
│           ├── with_tom_2.png
│           └── ...
└── tom/
    ├── v1/                    # Original assets
    │   └── ...
    └── v2/                    # New asset collection
        ├── standing/
        │   ├── alert_1.png
        │   ├── friendly_1.png
        │   └── ...
        ├── running/
        │   ├── running_1.png
        │   ├── playful_1.png
        │   └── ...
        ├── sitting/
        │   ├── attentive_1.png
        │   ├── relaxed_1.png
        │   └── ...
        └── interaction/
            ├── with_maddie_1.png
            ├── with_maddie_2.png
            └── ...

## Background Assets
```
public/assets/backgrounds/
├── v1/                        # Original assets
│   ├── forest.png
│   ├── beach.png
│   └── ...
└── v2/                        # New organized backgrounds
    ├── forest/
    │   ├── magical_clearing/
    │   │   ├── variation_1.png
    │   │   ├── variation_2.png
    │   │   └── variation_3.png
    │   ├── dense_path/
    │   └── meadow_edge/
    ├── park/
    │   ├── playground/
    │   ├── walking_path/
    │   └── open_area/
    ├── home/
    │   ├── bedroom/
    │   ├── living_room/
    │   └── backyard/
    └── beach/
        ├── sandy/
        ├── rocky_shore/
        └── sunset/
```

## Asset Mapping
Create a JSON mapping file to maintain compatibility between old and new assets:

```json
{
  "poses": {
    "maddie": {
      "neutral": {
        "v1": "/assets/characters/maddie/v1/neutral.png",
        "v2": [
          "/assets/characters/maddie/v2/standing/neutral_1.png",
          "/assets/characters/maddie/v2/standing/neutral_2.png"
        ]
      },
      // ... more pose mappings
    },
    "tom": {
      // ... similar structure for Tom
    }
  },
  "backgrounds": {
    "forest": {
      "v1": "/assets/backgrounds/v1/forest.png",
      "v2": {
        "magical_clearing": [
          "/assets/backgrounds/v2/forest/magical_clearing/variation_1.png",
          // ... more variations
        ]
      }
    }
    // ... more background mappings
  }
}
```

## Implementation Steps

1. Create new directory structure
2. Move existing assets to v1 folders
3. Organize new assets into v2 structure
4. Create asset mapping file
5. Update image composition code to use mapping file
6. Update tests to work with both v1 and v2 assets 