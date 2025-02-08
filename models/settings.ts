// Types for setting configuration
export type TimeOfDay = 'day' | 'night';

export type SettingType = 
  | 'maddies_room'  // Base setting - always available
  | 'home'          // Base setting - always available
  | 'backyard'      // Connected to home
  | 'park'          // Outdoor adventure
  | 'forest'        // Nature adventure
  | 'playground'    // Play-focused
  | 'library';      // Learning/quiet adventure

export interface SettingMetadata {
  name: SettingType;
  displayName: string;
  description: string;
  validTimeOfDay: TimeOfDay[];
  isIndoor: boolean;
  commonActivities: string[];
  requiredAssets: string[];
  // New: define which other settings can logically appear in the same story
  compatibleSettings: SettingType[];
}

// Configuration object for all valid settings
export const VALID_SETTINGS: Record<SettingType, SettingMetadata> = {
  maddies_room: {
    name: 'maddies_room',
    displayName: "Maddie's Room",
    description: 'A cozy bedroom with a bed, toys, and a window',
    validTimeOfDay: ['day', 'night'],
    isIndoor: true,
    commonActivities: ['playing', 'reading', 'getting ready', 'resting'],
    requiredAssets: ['bed', 'window', 'toys'],
    compatibleSettings: ['home', 'backyard'] // Can naturally flow to these locations
  },
  home: {
    name: 'home',
    displayName: 'Home',
    description: 'The main living areas of Maddie\'s home',
    validTimeOfDay: ['day', 'night'],
    isIndoor: true,
    commonActivities: ['playing', 'eating', 'family time', 'preparing'],
    requiredAssets: ['living_room', 'kitchen'],
    compatibleSettings: ['maddies_room', 'backyard'] // Natural flow between these areas
  },
  backyard: {
    name: 'backyard',
    displayName: 'Backyard',
    description: 'A friendly backyard with grass and a garden',
    validTimeOfDay: ['day'],
    isIndoor: false,
    commonActivities: ['playing', 'exploring', 'gardening'],
    requiredAssets: ['grass', 'fence', 'garden'],
    compatibleSettings: ['home', 'maddies_room'] // Connected to home settings
  },
  park: {
    name: 'park',
    displayName: 'Park',
    description: 'A public park with trees and paths',
    validTimeOfDay: ['day'],
    isIndoor: false,
    commonActivities: ['playing', 'walking', 'picnicking'],
    requiredAssets: ['trees', 'path', 'bench'],
    compatibleSettings: ['playground', 'home'] // Can combine with playground or return home
  },
  forest: {
    name: 'forest',
    displayName: 'Forest',
    description: 'A friendly forest with trees and paths',
    validTimeOfDay: ['day'],
    isIndoor: false,
    commonActivities: ['hiking', 'exploring', 'observing nature'],
    requiredAssets: ['trees', 'path', 'plants'],
    compatibleSettings: ['park', 'home'] // Can connect to park or return home
  },
  playground: {
    name: 'playground',
    displayName: 'Playground',
    description: 'A fun playground with play equipment',
    validTimeOfDay: ['day'],
    isIndoor: false,
    commonActivities: ['sliding', 'swinging', 'climbing'],
    requiredAssets: ['slide', 'swings', 'playground-structure'],
    compatibleSettings: ['park', 'home'] // Usually at a park, can return home
  },
  library: {
    name: 'library',
    displayName: 'Library',
    description: 'A quiet library with books and reading areas',
    validTimeOfDay: ['day'],
    isIndoor: true,
    commonActivities: ['reading', 'choosing books', 'storytelling'],
    requiredAssets: ['bookshelves', 'reading-area', 'books'],
    compatibleSettings: ['home'] // Can only really connect back to home
  }
};

// Helper functions for setting validation and queries
export function isValidSetting(setting: string): setting is SettingType {
  return setting in VALID_SETTINGS;
}

export function getCompatibleSettings(setting: SettingType): SettingType[] {
  return VALID_SETTINGS[setting].compatibleSettings;
}

export function areSettingsCompatible(setting1: SettingType, setting2: SettingType): boolean {
  return VALID_SETTINGS[setting1].compatibleSettings.includes(setting2) ||
         VALID_SETTINGS[setting2].compatibleSettings.includes(setting1);
}

export function getIndoorSettings(): SettingType[] {
  return Object.values(VALID_SETTINGS)
    .filter(setting => setting.isIndoor)
    .map(setting => setting.name);
}

export function getOutdoorSettings(): SettingType[] {
  return Object.values(VALID_SETTINGS)
    .filter(setting => !setting.isIndoor)
    .map(setting => setting.name);
} 