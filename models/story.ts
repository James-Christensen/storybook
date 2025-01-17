export interface StoryRequest {
  mainCharacter: string;
  sidekick: string;
  setting: string;
}

export interface StoryPage {
  text: string;
  imageUrl?: string;
}

export interface Story {
  title: string;
  pages: StoryPage[];
} 