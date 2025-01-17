'use client';  // This is important for client-side features like useState

import { useState } from 'react';
import StoryForm from '../components/StoryForm';
import StoryDisplay from '../components/StoryDisplay';
import { Story, StoryRequest } from '../models/story';
import { storyViewModel } from '../viewmodels/storyViewModel';

export default function Home() {
  const [story, setStory] = useState<Story>();

  const handleSubmit = async (request: StoryRequest) => {
    try {
      const generatedStory = await storyViewModel.createStory(request);
      setStory(generatedStory);
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Storybook Creator</h1>
      <StoryForm onSubmit={handleSubmit} />
      <StoryDisplay story={story} />
    </main>
  );
} 