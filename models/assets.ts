export type CharacterPose = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  emotions: string[];
  actions: string[];
};

export type Background = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  settings: string[];
  timeOfDay: string[];
};

// Initial pose set for MVP
export const CHARACTER_POSES: CharacterPose[] = [
  {
    id: 'neutral',
    name: 'Standing',
    description: 'A neutral, friendly standing pose',
    imageUrl: '/assets/characters/maddie/poses/neutral.png',
    emotions: ['neutral', 'calm', 'friendly'],
    actions: ['standing', 'introducing', 'observing']
  },
  {
    id: 'happy',
    name: 'Happy',
    description: 'An excited, happy pose with raised arms',
    imageUrl: '/assets/characters/maddie/poses/happy.png',
    emotions: ['happy', 'excited', 'joyful'],
    actions: ['celebrating', 'playing', 'laughing']
  },
  {
    id: 'thinking',
    name: 'Thinking',
    description: 'A curious, thoughtful pose with hand on chin',
    imageUrl: '/assets/characters/maddie/poses/thinking.png',
    emotions: ['curious', 'thoughtful', 'interested'],
    actions: ['thinking', 'wondering', 'discovering']
  },
  {
    id: 'celebrating',
    name: 'Celebrating',
    description: 'A jumping, celebrating pose',
    imageUrl: '/assets/characters/maddie/poses/celebrating.png',
    emotions: ['triumphant', 'excited', 'proud'],
    actions: ['jumping', 'celebrating', 'succeeding']
  },
  {
    id: 'running',
    name: 'Running',
    description: 'An active, adventurous running pose',
    imageUrl: '/assets/characters/maddie/poses/running.png',
    emotions: ['energetic', 'adventurous', 'determined'],
    actions: ['running', 'chasing', 'exploring']
  }
];

// Initial background set for MVP
export const BACKGROUNDS: Background[] = [
  {
    id: 'bedroom',
    name: 'Bedroom',
    description: 'A cozy bedroom with toys and books',
    imageUrl: '/assets/backgrounds/bedroom.png',
    settings: ['home', 'indoor', 'bedroom'],
    timeOfDay: ['day', 'night']
  },
  {
    id: 'park',
    name: 'Park',
    description: 'A sunny park with playground and trees',
    imageUrl: '/assets/backgrounds/park.png',
    settings: ['park', 'outdoor', 'playground'],
    timeOfDay: ['day']
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'A magical forest with tall trees',
    imageUrl: '/assets/backgrounds/forest.png',
    settings: ['forest', 'outdoor', 'nature'],
    timeOfDay: ['day', 'night']
  },
  {
    id: 'beach',
    name: 'Beach',
    description: 'A beautiful beach with waves and sand',
    imageUrl: '/assets/backgrounds/beach.png',
    settings: ['beach', 'outdoor', 'ocean'],
    timeOfDay: ['day']
  }
];

// Helper function to find the best matching pose for a scene description
export function findBestPose(description: string): CharacterPose {
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
  
  // Return the pose with the highest score, or neutral as fallback
  const bestMatch = scores.reduce((best, current) => 
    current.score > best.score ? current : best
  , { pose: CHARACTER_POSES[0], score: -1, matches: { emotions: [], actions: [] } });
  
  console.log('\n=== Selected Pose ===');
  console.log('Name:', bestMatch.pose.name);
  console.log('Score:', bestMatch.score);
  console.log('Matched emotions:', bestMatch.matches.emotions.join(', ') || 'none');
  console.log('Matched actions:', bestMatch.matches.actions.join(', ') || 'none');
  
  return bestMatch.pose;
}

// Helper function to find the best matching background for a scene
export function findBestBackground(description: string): Background {
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
  
  return bestMatch.background;
} 