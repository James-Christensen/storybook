export interface StoryRequest {
  mainCharacter: string;
  sidekick: string;
  setting: string;
  pageCount: number;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imageDescription: string;
  imageUrl?: string;
}

export interface Story {
  title: string;
  pages: StoryPage[];
} 