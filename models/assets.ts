export type AssetVariation = {
  path: string;
  tags?: string[];
};

export type CharacterPose = {
  id: string;
  name: string;
  description: string;
  emotions: string[];
  actions: string[];
  variations: {
    v1?: string;
    v2: AssetVariation[];
  };
};

export type Background = {
  id: string;
  name: string;
  description: string;
  settings: string[];
  timeOfDay: string[];
  variations: {
    v1?: string[];
    v2?: {
      [subtype: string]: AssetVariation[];
    };
  };
};

// Load the asset mapping
import assetMapping from '../public/assets/asset-mapping.json';

// Convert asset mapping to CHARACTER_POSES format
export const CHARACTER_POSES: CharacterPose[] = [
  // Maddie's poses
  {
    id: 'maddie_neutral',
    name: 'Standing',
    description: 'A neutral, friendly standing pose',
    emotions: ['neutral', 'calm', 'friendly'],
    actions: ['standing', 'introducing', 'observing'],
    variations: {
      v2: assetMapping.poses.maddie.neutral.v2.map(path => ({ path }))
    }
  },
  {
    id: 'maddie_thinking',
    name: 'Thinking',
    description: 'A curious, thoughtful pose',
    emotions: ['curious', 'thoughtful', 'interested'],
    actions: ['thinking', 'wondering', 'discovering'],
    variations: {
      v2: assetMapping.poses.maddie.thinking.v2.map(path => ({ path }))
    }
  },
  {
    id: 'maddie_running',
    name: 'Running',
    description: 'An active, adventurous running pose',
    emotions: ['energetic', 'adventurous', 'determined'],
    actions: ['running', 'chasing', 'exploring'],
    variations: {
      v2: assetMapping.poses.maddie.running.v2.map(path => ({ path }))
    }
  },
  {
    id: 'maddie_sitting',
    name: 'Sitting',
    description: 'A relaxed, seated pose',
    emotions: ['relaxed', 'attentive', 'calm'],
    actions: ['sitting', 'resting', 'listening'],
    variations: {
      v2: assetMapping.poses.maddie.sitting.v2.map(path => ({ path }))
    }
  },
  {
    id: 'maddie_walking',
    name: 'Walking',
    description: 'A casual walking pose',
    emotions: ['content', 'relaxed', 'happy'],
    actions: ['walking', 'strolling', 'exploring'],
    variations: {
      v2: assetMapping.poses.maddie.walking.v2.map(path => ({ path }))
    }
  },
  {
    id: 'maddie_celebrating',
    name: 'Celebrating',
    description: 'A joyful, celebratory pose',
    emotions: ['happy', 'excited', 'triumphant'],
    actions: ['celebrating', 'cheering', 'jumping'],
    variations: {
      v2: assetMapping.poses.maddie.celebrating.v2.map(path => ({ path }))
    }
  },
  {
    id: 'maddie_interaction',
    name: 'Interacting',
    description: 'An interactive pose with Tom',
    emotions: ['friendly', 'happy', 'caring'],
    actions: ['waving', 'greeting', 'playing'],
    variations: {
      v2: assetMapping.poses.maddie.interaction.v2.map(path => ({ path }))
    }
  },
  // Tom's poses
  {
    id: 'tom_standing',
    name: 'Standing Alert',
    description: 'An alert, attentive standing pose',
    emotions: ['alert', 'attentive', 'friendly'],
    actions: ['standing', 'watching', 'guarding'],
    variations: {
      v2: assetMapping.poses.tom.standing.v2.map(path => ({ path }))
    }
  },
  {
    id: 'tom_running',
    name: 'Running and Playing',
    description: 'An energetic running or playing pose',
    emotions: ['playful', 'excited', 'energetic'],
    actions: ['running', 'playing', 'chasing'],
    variations: {
      v2: assetMapping.poses.tom.running.v2.map(path => ({ path }))
    }
  },
  {
    id: 'tom_sitting',
    name: 'Sitting',
    description: 'A well-behaved sitting pose',
    emotions: ['attentive', 'relaxed', 'obedient'],
    actions: ['sitting', 'waiting', 'watching'],
    variations: {
      v2: assetMapping.poses.tom.sitting.v2.map(path => ({ path }))
    }
  },
  {
    id: 'tom_interaction',
    name: 'Interacting',
    description: 'An interactive pose with Maddie',
    emotions: ['happy', 'attentive', 'loving'],
    actions: ['looking', 'following', 'playing'],
    variations: {
      v2: assetMapping.poses.tom.interaction.v2.map(path => ({ path }))
    }
  }
];

// Initial background set
export const BACKGROUNDS: Background[] = [
  {
    id: 'forest',
    name: 'Forest',
    description: 'A magical forest with tall trees',
    settings: ['forest', 'outdoor', 'nature', 'woods', 'trees'],
    timeOfDay: ['day'],
    variations: {
      v1: assetMapping.backgrounds.forest.v1,
      v2: {
        magical_clearing: assetMapping.backgrounds.forest.v2.magical_clearing.map(path => ({ path })),
        dense_path: assetMapping.backgrounds.forest.v2.dense_path.map(path => ({ path })),
        meadow_edge: assetMapping.backgrounds.forest.v2.meadow_edge.map(path => ({ path }))
      }
    }
  },
  {
    id: 'park',
    name: 'Park',
    description: 'A fun park with playground equipment',
    settings: ['park', 'outdoor', 'playground', 'garden'],
    timeOfDay: ['day'],
    variations: {
      v1: assetMapping.backgrounds.park.v1,
      v2: {
        playground: assetMapping.backgrounds.park.v2.playground.map(path => ({ path })),
        walking_path: assetMapping.backgrounds.park.v2.walking_path.map(path => ({ path })),
        open_area: assetMapping.backgrounds.park.v2.open_area.map(path => ({ path }))
      }
    }
  },
  {
    id: 'home',
    name: 'Home',
    description: 'A cozy home environment',
    settings: ['home', 'indoor', 'house', 'bedroom', 'living room', 'backyard'],
    timeOfDay: ['day', 'night'],
    variations: {
      v1: assetMapping.backgrounds.home.v1,
      v2: {
        bedroom: assetMapping.backgrounds.home.v2.bedroom.map(path => ({ path })),
        living_room: assetMapping.backgrounds.home.v2.living_room.map(path => ({ path })),
        backyard: assetMapping.backgrounds.home.v2.backyard.map(path => ({ path }))
      }
    }
  },
  {
    id: 'beach',
    name: 'Beach',
    description: 'A beautiful beach setting',
    settings: ['beach', 'outdoor', 'ocean', 'sea', 'shore', 'coast'],
    timeOfDay: ['day', 'sunset'],
    variations: {
      v1: assetMapping.backgrounds.beach.v1,
      v2: {
        sandy: assetMapping.backgrounds.beach.v2.sandy.map(path => ({ path })),
        rocky_shore: assetMapping.backgrounds.beach.v2.rocky_shore.map(path => ({ path })),
        sunset: assetMapping.backgrounds.beach.v2.sunset.map(path => ({ path }))
      }
    }
  }
];

// Add these interfaces at the top of the file
interface PoseMatchResult {
  pose: CharacterPose;
  score: number;
  matches: {
    emotions: string[];
    actions: string[];
  };
}

interface BackgroundMatchResult {
  background: Background;
  score: number;
  matches: {
    settings: string[];
    context: string[];
  };
}

// Add interface for pose selection
interface PoseSelectionResult extends PoseMatchResult {
  selectedVariation: string;
}

// Add character type to the pose matching
export function findBestPose(description: string, character: 'maddie' | 'tom' = 'maddie'): PoseSelectionResult {
  const desc = description.toLowerCase();
  console.log('\n=== Pose Matching Process ===');
  console.log('Character:', character);
  console.log('Scene description:', description);
  
  // Filter poses based on character
  const characterPoses = CHARACTER_POSES.filter(pose => 
    character === 'maddie' ? !pose.id.startsWith('tom_') : pose.id.startsWith('tom_')
  );
  
  // Score each pose based on matching emotions and actions
  const scores = characterPoses.map(pose => {
    let score = 0;
    const matches = {
      emotions: [] as string[],
      actions: [] as string[]
    };

    pose.emotions.forEach(emotion => {
      if (desc.includes(emotion)) {
        score += 2;
        matches.emotions.push(emotion);
      }
    });
    pose.actions.forEach(action => {
      if (desc.includes(action)) {
        score += 2;
        matches.actions.push(action);
      }
    });

    console.log(`\nScoring pose: ${pose.name}`);
    console.log('- Matching emotions:', matches.emotions.length ? matches.emotions.join(', ') : 'none');
    console.log('- Matching actions:', matches.actions.length ? matches.actions.join(', ') : 'none');
    console.log('- Total score:', score);

    return { pose, score, matches };
  });
  
  // Get the best matching pose
  const bestMatch = scores.reduce((best, current) => 
    current.score > best.score ? current : best
  , { pose: characterPoses[0], score: -1, matches: { emotions: [], actions: [] } });

  // Select a random variation from the available ones
  const variations = bestMatch.pose.variations.v2;
  const selectedVariation = variations[Math.floor(Math.random() * variations.length)].path;

  console.log('\n=== Selected Pose ===');
  console.log('Name:', bestMatch.pose.name);
  console.log('Score:', bestMatch.score);
  console.log('Selected variation:', selectedVariation);
  
  return {
    ...bestMatch,
    selectedVariation
  };
}

// Update findBestBackground to handle room-specific matching
export function findBestBackground(description: string): BackgroundMatchResult {
  const desc = description.toLowerCase();
  console.log('\n=== Background Matching Process ===');
  console.log('Scene description:', description);
  
  // Score each background based on matching settings and additional context
  const scores = BACKGROUNDS.map(bg => {
    let score = 0;
    const matches = {
      settings: [] as string[],
      context: [] as string[]
    };
    
    // Check settings matches
    bg.settings.forEach(setting => {
      if (desc.includes(setting.toLowerCase())) {
        score += 2;
        matches.settings.push(setting);
      }
    });
    
    // Add contextual scoring with room-specific matches
    const contextualMatches = [
      { 
        setting: 'home',
        rooms: {
          bedroom: ['bedroom', 'bed', 'sleeping', 'pillow', 'stuffed animals', 'fairy lights'],
          living_room: ['living room', 'couch', 'sofa', 'tv', 'fireplace'],
          backyard: ['backyard', 'garden', 'patio', 'yard']
        }
      },
      {
        setting: 'park',
        features: ['playground', 'swing', 'slide', 'bench', 'path', 'walking path']
      },
      {
        setting: 'beach',
        features: ['sand', 'wave', 'ocean', 'shore', 'seashell', 'lighthouse']
      },
      {
        setting: 'forest',
        features: ['tree', 'nature', 'woods', 'woodland', 'clearing', 'path']
      }
    ];

    // Check for room-specific matches
    contextualMatches.forEach(context => {
      if (bg.id === context.setting) {
        if (context.rooms) {
          // For home backgrounds, check room-specific matches
          Object.entries(context.rooms).forEach(([room, terms]) => {
            terms.forEach(term => {
              if (desc.includes(term.toLowerCase())) {
                score += 3;
                matches.context.push(term);
              }
            });
          });
        } else if (context.features) {
          // For other backgrounds, check feature matches
          context.features.forEach(feature => {
            if (desc.includes(feature.toLowerCase())) {
              score += 3;
              matches.context.push(feature);
            }
          });
        }
      }
    });

    console.log(`\nScoring background: ${bg.name}`);
    console.log('- Matching settings:', matches.settings.length ? matches.settings.join(', ') : 'none');
    console.log('- Contextual matches:', matches.context.length ? matches.context.join(', ') : 'none');
    console.log('- Total score:', score);
    
    return { background: bg, score, matches };
  });
  
  // Return the background with the highest score
  const bestMatch = scores.reduce((best, current) => 
    current.score > best.score ? current : best
  , { background: BACKGROUNDS[0], score: -1, matches: { settings: [], context: [] } });
  
  console.log('\n=== Selected Background ===');
  console.log('Name:', bestMatch.background.name);
  console.log('Score:', bestMatch.score);
  console.log('Matched settings:', bestMatch.matches.settings.join(', ') || 'none');
  console.log('Contextual matches:', bestMatch.matches.context.join(', ') || 'none');
  
  return bestMatch;
} 