export type AssetVariation = {
  path: string;
  tags: string[];
  context: {
    timeOfDay?: ('morning' | 'day' | 'sunset' | 'night')[];
    energy: 'low' | 'medium' | 'high';
    storyBeat: ('introduction' | 'action' | 'climax' | 'resolution')[];
    interaction?: 'solo' | 'with_tom' | 'with_environment';
  };
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
  subtypes: {
    [key: string]: {
      name: string;
      description: string;
      keywords: string[];
    };
  };
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
      v2: assetMapping.poses.maddie.neutral.v2.map(path => ({
        path,
        tags: ['neutral', 'standing', 'calm'],
        context: {
          energy: 'medium',
          storyBeat: ['introduction', 'action'],
          interaction: 'solo'
        }
      }))
    }
  },
  {
    id: 'maddie_thinking',
    name: 'Thinking',
    description: 'A curious, thoughtful pose',
    emotions: ['curious', 'thoughtful', 'interested'],
    actions: ['thinking', 'wondering', 'discovering'],
    variations: {
      v2: assetMapping.poses.maddie.thinking.v2.map(path => ({
        path,
        tags: ['thoughtful', 'curious', 'discovery'],
        context: {
          energy: 'medium',
          storyBeat: ['action', 'climax'],
          interaction: 'with_environment'
        }
      }))
    }
  },
  {
    id: 'maddie_running',
    name: 'Running',
    description: 'An active, adventurous running pose',
    emotions: ['energetic', 'adventurous', 'determined'],
    actions: ['running', 'chasing', 'exploring'],
    variations: {
      v2: assetMapping.poses.maddie.running.v2.map(path => ({
        path,
        tags: ['running', 'active', 'adventure'],
        context: {
          energy: 'high',
          storyBeat: ['action', 'climax'],
          interaction: 'solo'
        }
      }))
    }
  },
  {
    id: 'maddie_sitting',
    name: 'Sitting',
    description: 'A relaxed, seated pose',
    emotions: ['relaxed', 'attentive', 'calm'],
    actions: ['sitting', 'resting', 'listening'],
    variations: {
      v2: assetMapping.poses.maddie.sitting.v2.map(path => ({
        path,
        tags: ['sitting', 'relaxed', 'calm'],
        context: {
          energy: 'low',
          storyBeat: ['introduction', 'resolution'],
          interaction: 'with_environment'
        }
      }))
    }
  },
  {
    id: 'maddie_walking',
    name: 'Walking',
    description: 'A casual walking pose',
    emotions: ['content', 'relaxed', 'happy'],
    actions: ['walking', 'strolling', 'exploring'],
    variations: {
      v2: assetMapping.poses.maddie.walking.v2.map(path => ({
        path,
        tags: ['walking', 'exploring', 'casual'],
        context: {
          energy: 'medium',
          storyBeat: ['action'],
          interaction: 'solo'
        }
      }))
    }
  },
  {
    id: 'maddie_celebrating',
    name: 'Celebrating',
    description: 'A joyful, celebratory pose',
    emotions: ['happy', 'excited', 'triumphant'],
    actions: ['celebrating', 'cheering', 'jumping'],
    variations: {
      v2: assetMapping.poses.maddie.celebrating.v2.map(path => ({
        path,
        tags: ['celebrating', 'happy', 'victory'],
        context: {
          energy: 'high',
          storyBeat: ['climax', 'resolution'],
          interaction: 'solo'
        }
      }))
    }
  },
  {
    id: 'maddie_interaction',
    name: 'Interacting',
    description: 'An interactive pose with Tom',
    emotions: ['friendly', 'happy', 'caring'],
    actions: ['waving', 'greeting', 'playing'],
    variations: {
      v2: assetMapping.poses.maddie.interaction.v2.map(path => ({
        path,
        tags: ['interaction', 'friendly', 'playing'],
        context: {
          energy: 'medium',
          storyBeat: ['introduction', 'action', 'resolution'],
          interaction: 'with_tom'
        }
      }))
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
      v2: assetMapping.poses.tom.standing.v2.map(path => ({
        path,
        tags: ['standing', 'alert', 'attentive'],
        context: {
          energy: 'medium',
          storyBeat: ['introduction', 'action'],
          interaction: 'solo'
        }
      }))
    }
  },
  {
    id: 'tom_running',
    name: 'Running and Playing',
    description: 'An energetic running or playing pose',
    emotions: ['playful', 'excited', 'energetic'],
    actions: ['running', 'playing', 'chasing'],
    variations: {
      v2: assetMapping.poses.tom.running.v2.map(path => ({
        path,
        tags: ['running', 'playing', 'energetic'],
        context: {
          energy: 'high',
          storyBeat: ['action', 'climax'],
          interaction: 'solo'
        }
      }))
    }
  },
  {
    id: 'tom_sitting',
    name: 'Sitting',
    description: 'A well-behaved sitting pose',
    emotions: ['attentive', 'relaxed', 'obedient'],
    actions: ['sitting', 'waiting', 'watching'],
    variations: {
      v2: assetMapping.poses.tom.sitting.v2.map(path => ({
        path,
        tags: ['sitting', 'attentive', 'calm'],
        context: {
          energy: 'low',
          storyBeat: ['introduction', 'resolution'],
          interaction: 'solo'
        }
      }))
    }
  },
  {
    id: 'tom_interaction',
    name: 'Interacting',
    description: 'An interactive pose with Maddie',
    emotions: ['happy', 'attentive', 'loving'],
    actions: ['looking', 'following', 'playing'],
    variations: {
      v2: assetMapping.poses.tom.interaction.v2.map(path => ({
        path,
        tags: ['interaction', 'attentive', 'following'],
        context: {
          energy: 'medium',
          storyBeat: ['introduction', 'action', 'resolution'],
          interaction: 'with_tom'
        }
      }))
    }
  }
];

// Update BACKGROUNDS array with comprehensive background information
export const BACKGROUNDS: Background[] = [
  {
    id: 'forest',
    name: 'Forest',
    description: 'A magical forest with tall trees',
    settings: ['forest', 'outdoor', 'nature', 'woods', 'trees'],
    timeOfDay: ['day'],
    subtypes: {
      magical_clearing: {
        name: 'Magical Clearing',
        description: 'A mystical clearing in the forest',
        keywords: ['magical', 'clearing', 'mystical', 'enchanted', 'glow', 'fairy']
      },
      dense_path: {
        name: 'Dense Woodland Path',
        description: 'A winding path through dense trees',
        keywords: ['path', 'trail', 'dense', 'winding', 'walking', 'exploring']
      },
      meadow_edge: {
        name: 'Forest Meadow Edge',
        description: 'Where forest meets meadow',
        keywords: ['meadow', 'edge', 'open', 'flowers', 'grass', 'sunny']
      }
    },
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
    settings: ['park', 'outdoor', 'playground', 'garden', 'recreation'],
    timeOfDay: ['day'],
    subtypes: {
      playground: {
        name: 'Playground Area',
        description: 'A fun playground with equipment',
        keywords: ['playground', 'swing', 'slide', 'play', 'fun', 'equipment']
      },
      walking_path: {
        name: 'Park Walking Path',
        description: 'A peaceful walking path',
        keywords: ['path', 'walking', 'stroll', 'peaceful', 'bench']
      },
      open_area: {
        name: 'Open Park Area',
        description: 'An open area with scattered trees',
        keywords: ['open', 'grass', 'trees', 'picnic', 'spacious']
      }
    },
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
    settings: ['home', 'indoor', 'house', 'cozy', 'inside'],
    timeOfDay: ['day', 'night'],
    subtypes: {
      bedroom: {
        name: 'Bedroom',
        description: 'A cozy bedroom setting',
        keywords: ['bedroom', 'bed', 'sleeping', 'rest', 'stuffed animals', 'toys', 'fairy lights']
      },
      living_room: {
        name: 'Living Room',
        description: 'A comfortable living room',
        keywords: ['living room', 'couch', 'sofa', 'tv', 'fireplace', 'comfortable']
      },
      backyard: {
        name: 'Backyard Garden',
        description: 'A pleasant backyard garden',
        keywords: ['backyard', 'garden', 'patio', 'yard', 'flowers', 'outdoor']
      }
    },
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
    subtypes: {
      sandy: {
        name: 'Sandy Beach',
        description: 'A beautiful sandy beach',
        keywords: ['sand', 'waves', 'sunny', 'beach', 'shells', 'ocean']
      },
      rocky_shore: {
        name: 'Rocky Shore',
        description: 'A dramatic rocky shoreline with lighthouse',
        keywords: ['rocks', 'lighthouse', 'cliffs', 'waves', 'shore', 'dramatic']
      },
      sunset: {
        name: 'Beach Sunset',
        description: 'A peaceful beach at sunset',
        keywords: ['sunset', 'dusk', 'evening', 'peaceful', 'golden', 'orange']
      }
    },
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

// Add interface for subtype matching
interface SubtypeMatch {
  subtype: string;
  score: number;
  matches: string[];
}

// Update BackgroundMatchResult to include subtype information
interface BackgroundMatchResult {
  background: Background;
  score: number;
  matches: {
    settings: string[];
    context: string[];
  };
  selectedSubtype?: {
    name: string;
    score: number;
    matches: string[];
  };
}

// Add interface for pose selection
interface PoseSelectionResult extends PoseMatchResult {
  selectedVariation: string;
}

// Add interface for variation selection
export interface VariationContext {
  timeOfDay?: string;
  pageNumber: number;
  totalPages: number;
  previousPose?: string;
  isWithTom: boolean;
  sceneType: 'introduction' | 'action' | 'climax' | 'resolution';
}

// Update the pose selection function to use context
export function selectPoseVariation(
  pose: CharacterPose,
  description: string,
  context: VariationContext
): string {
  const variations = pose.variations.v2;
  if (!variations || variations.length === 0) {
    throw new Error(`No variations available for pose: ${pose.name}`);
  }

  console.log('\n=== Pose Variation Selection ===');
  console.log('Selecting variation for pose:', pose.name);
  console.log('Context:', context);

  // Score each variation based on context
  const scoredVariations = variations.map(variation => {
    let score = 0;
    const desc = description.toLowerCase();

    // Score based on time of day if specified
    if (context.timeOfDay && variation.context.timeOfDay?.includes(context.timeOfDay as any)) {
      score += 2;
    }

    // Score based on story progression
    const progressionPercent = context.pageNumber / context.totalPages;
    if (progressionPercent <= 0.2 && variation.context.storyBeat.includes('introduction')) {
      score += 3;
    } else if (progressionPercent >= 0.8 && variation.context.storyBeat.includes('resolution')) {
      score += 3;
    } else if (progressionPercent > 0.6 && variation.context.storyBeat.includes('climax')) {
      score += 3;
    } else if (variation.context.storyBeat.includes('action')) {
      score += 2;
    }

    // Score based on interaction context
    if (context.isWithTom && variation.context.interaction === 'with_tom') {
      score += 2;
    } else if (!context.isWithTom && variation.context.interaction === 'solo') {
      score += 2;
    }

    // Score based on energy level from description
    const energyKeywords = {
      high: ['run', 'jump', 'play', 'chase', 'excited', 'energetic'],
      medium: ['walk', 'explore', 'discover', 'curious', 'interested'],
      low: ['sit', 'rest', 'sleep', 'calm', 'quiet', 'peaceful']
    };

    if (energyKeywords.high.some(word => desc.includes(word)) && variation.context.energy === 'high') {
      score += 2;
    } else if (energyKeywords.medium.some(word => desc.includes(word)) && variation.context.energy === 'medium') {
      score += 2;
    } else if (energyKeywords.low.some(word => desc.includes(word)) && variation.context.energy === 'low') {
      score += 2;
    }

    // Avoid repeating the exact same pose if possible
    if (variation.path === context.previousPose) {
      score -= 3;
    }

    // Score based on custom tags
    variation.tags.forEach(tag => {
      if (desc.includes(tag)) {
        score += 1;
      }
    });

    return { variation, score };
  });

  // Sort by score and add some randomness for variations with close scores
  scoredVariations.sort((a, b) => b.score - a.score);
  
  // Group variations with similar scores (within 2 points of the highest score)
  const highestScore = scoredVariations[0].score;
  const topVariations = scoredVariations.filter(v => v.score >= highestScore - 2);

  // Randomly select from top variations
  const selected = topVariations[Math.floor(Math.random() * topVariations.length)];

  console.log('Selected variation score:', selected.score);
  console.log('Selected variation path:', selected.variation.path);

  return selected.variation.path;
}

// Update findBestPose to use the new variation selection
export function findBestPose(
  description: string,
  character: 'maddie' | 'tom' = 'maddie',
  context: VariationContext
): PoseSelectionResult {
  const desc = description.toLowerCase();
  console.log('\n=== Pose Matching Process ===');
  console.log('Character:', character);
  console.log('Scene description:', description);
  console.log('Context:', context);
  
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

  // Select the best variation based on context
  const selectedVariation = selectPoseVariation(bestMatch.pose, description, context);

  console.log('\n=== Selected Pose ===');
  console.log('Name:', bestMatch.pose.name);
  console.log('Score:', bestMatch.score);
  console.log('Selected variation:', selectedVariation);
  
  return {
    ...bestMatch,
    selectedVariation
  };
}

// Update findBestBackground to include subtype selection
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

    // Score each subtype
    const subtypeMatches = Object.entries(bg.subtypes).map(([subtype, info]): SubtypeMatch => {
      let subtypeScore = 0;
      const subtypeMatches: string[] = [];

      info.keywords.forEach(keyword => {
        if (desc.includes(keyword.toLowerCase())) {
          subtypeScore += 3;
          subtypeMatches.push(keyword);
        }
      });

      return {
        subtype,
        score: subtypeScore,
        matches: subtypeMatches
      };
    });

    // Find best matching subtype
    const bestSubtype = subtypeMatches.reduce((best, current) => 
      current.score > best.score ? current : best
    , { subtype: Object.keys(bg.subtypes)[0], score: 0, matches: [] });

    // Add subtype score to total
    score += bestSubtype.score;

    console.log(`\nScoring background: ${bg.name}`);
    console.log('- Matching settings:', matches.settings.length ? matches.settings.join(', ') : 'none');
    if (bestSubtype.score > 0) {
      console.log(`- Best matching subtype: ${bg.subtypes[bestSubtype.subtype].name}`);
      console.log('- Subtype matches:', bestSubtype.matches.join(', '));
    }
    console.log('- Total score:', score);
    
    return { 
      background: bg, 
      score, 
      matches,
      selectedSubtype: bestSubtype.score > 0 ? {
        name: bestSubtype.subtype,
        score: bestSubtype.score,
        matches: bestSubtype.matches
      } : undefined
    };
  });
  
  // Return the background with the highest score
  const bestMatch = scores.reduce((best, current) => 
    current.score > best.score ? current : best
  , { 
    background: BACKGROUNDS[0], 
    score: -1, 
    matches: { settings: [], context: [] },
    selectedSubtype: undefined
  } as BackgroundMatchResult);
  
  console.log('\n=== Selected Background ===');
  console.log('Name:', bestMatch.background.name);
  console.log('Score:', bestMatch.score);
  console.log('Matched settings:', bestMatch.matches.settings.join(', ') || 'none');
  if (bestMatch.selectedSubtype) {
    console.log('Selected subtype:', bestMatch.background.subtypes[bestMatch.selectedSubtype.name].name);
    console.log('Subtype matches:', bestMatch.selectedSubtype.matches.join(', '));
  }
  
  return bestMatch;
} 