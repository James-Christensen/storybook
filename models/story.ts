export interface StoryRequest {
  mainCharacter: string;
  sidekick: string;
  setting: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

export interface Story {
  title: string;
  pages: StoryPage[];
  currentPage: number;
} 