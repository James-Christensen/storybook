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
  
  // Score each pose based on matching emotions and actions
  const scores = CHARACTER_POSES.map(pose => {
    let score = 0;
    pose.emotions.forEach(emotion => {
      if (desc.includes(emotion)) score += 2;
    });
    pose.actions.forEach(action => {
      if (desc.includes(action)) score += 2;
    });
    return { pose, score };
  });
  
  // Return the pose with the highest score, or neutral as fallback
  const bestMatch = scores.reduce((best, current) => 
    current.score > best.score ? current : best
  , { pose: CHARACTER_POSES[0], score: -1 });
  
  return bestMatch.pose;
}

// Helper function to find the best matching background for a scene
export function findBestBackground(description: string): Background {
  const desc = description.toLowerCase();
  
  // Score each background based on matching settings
  const scores = BACKGROUNDS.map(bg => {
    let score = 0;
    bg.settings.forEach(setting => {
      if (desc.includes(setting)) score += 2;
    });
    return { background: bg, score };
  });
  
  // Return the background with the highest score, or bedroom as fallback
  const bestMatch = scores.reduce((best, current) => 
    current.score > best.score ? current : best
  , { background: BACKGROUNDS[0], score: -1 });
  
  return bestMatch.background;
} 