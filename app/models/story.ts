export type GenerationMode = 'ai' | 'asset';

export interface StoryRequest {
  mainCharacter: string;
  sidekick: string;
  setting: string;
  pageCount: number;
  generationMode: GenerationMode;
}

export interface StoryPage {
  text: string;
  imageUrl?: string;
}

export interface Story {
  title: string;
  subtitle: string;
  pages: StoryPage[];
  generationMode: GenerationMode;
} 