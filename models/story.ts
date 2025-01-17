export interface StoryRequest {
  mainCharacter: string;
  sidekick: string;
  setting: string;
}

export interface Story {
  title: string;
  paragraphs: string[];
  images: string[];
} 