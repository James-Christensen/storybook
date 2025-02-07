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
    id: 'neutral',
    name: 'Standing',
    description: 'A neutral, friendly standing pose',
    emotions: ['neutral', 'calm', 'friendly'],
    actions: ['standing', 'introducing', 'observing'],
    variations: {
      v2: assetMapping.poses.maddie.neutral.v2.map(path => ({ path }))
    }
  },
  {
    id: 'thinking',
    name: 'Thinking',
    description: 'A curious, thoughtful pose',
    emotions: ['curious', 'thoughtful', 'interested'],
    actions: ['thinking', 'wondering', 'discovering'],
    variations: {
      v2: assetMapping.poses.maddie.thinking.v2.map(path => ({ path }))
    }
  },
  {
    id: 'running',
    name: 'Running',
    description: 'An active, adventurous running pose',
    emotions: ['energetic', 'adventurous', 'determined'],
    actions: ['running', 'chasing', 'exploring'],
    variations: {
      v2: assetMapping.poses.maddie.running.v2.map(path => ({ path }))
    }
  }
  // We'll add more poses after confirming this structure works
];

// Initial background set
export const BACKGROUNDS: Background[] = [
  {
    id: 'forest',
    name: 'Forest',
    description: 'A magical forest with tall trees',
    settings: ['forest', 'outdoor', 'nature'],
    timeOfDay: ['day'],
    variations: {
      v1: assetMapping.backgrounds.forest.v1,
      v2: {
        magical_clearing: assetMapping.backgrounds.forest.v2.magical_clearing.map(path => ({ path })),
        dense_path: assetMapping.backgrounds.forest.v2.dense_path.map(path => ({ path })),
        meadow_edge: assetMapping.backgrounds.forest.v2.meadow_edge.map(path => ({ path }))
      }
    }
  }
  // We'll add more backgrounds after confirming this structure works
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

// Modify the findBestPose function to return full match details
export function findBestPose(description: string): PoseMatchResult {
  const desc = description.toLowerCase();
  console.log('\n=== Pose Matching Process ===');
  console.log('Scene description:', description);
  
  // Score each pose based on matching emotions and actions
  const scores = CHARACTER_POSES.map(pose => {
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
  
  // Return the pose with the highest score and all scoring details
  return scores.reduce((best, current) => 
    current.score > best.score ? current : best
  , { pose: CHARACTER_POSES[0], score: -1, matches: { emotions: [], actions: [] } });
}

// Modify the findBestBackground function similarly
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
      if (desc.includes(setting)) {
        score += 2;
        matches.settings.push(setting);
      }
    });
    
    // Add contextual scoring
    const contextualMatches = [
      { terms: ['sleep', 'waking up', 'bedroom'], setting: 'bedroom' },
      { terms: ['sand', 'wave', 'ocean', 'beach'], setting: 'beach' },
      { terms: ['tree', 'nature', 'woods', 'forest'], setting: 'forest' },
      { terms: ['playground', 'swing', 'slide', 'park'], setting: 'park' }
    ];

    contextualMatches.forEach(({ terms, setting }) => {
      if (bg.id === setting && terms.some(term => desc.includes(term))) {
        score += 3;
        matches.context.push(...terms.filter(term => desc.includes(term)));
      }
    });

    console.log(`\nScoring background: ${bg.name}`);
    console.log('- Matching settings:', matches.settings.length ? matches.settings.join(', ') : 'none');
    console.log('- Contextual matches:', matches.context.length ? matches.context.join(', ') : 'none');
    console.log('- Total score:', score);
    
    return { background: bg, score, matches };
  });
  
  // Return the background with the highest score, or bedroom as fallback
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