import { AssetMatchDetails } from '../utils/storyLogger';

export type GenerationMode = 'ai' | 'asset';

export interface StoryRequest {
  mainCharacter: string;
  sidekick: string;
  setting: string;
  pageCount: number;
  generationMode: GenerationMode;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imageDescription: string;
  imageUrl?: string;
  assetMatching?: AssetMatchDetails;
  metadata?: {
    pose?: string;
    background?: string;
  };
}

export interface Story {
  title: string;
  subtitle: string;
  pages: StoryPage[];
  generationMode: GenerationMode;
} 