'use client';  // This is important for client-side features like useState

import { useState } from 'react';
import StoryForm from '../components/StoryForm';
import StoryBook from '../components/StoryBook';
import LoadingOverlay from '../components/LoadingOverlay';
import { Story, StoryRequest } from '../models/story';
import { storyViewModel } from '../viewmodels/storyViewModel';

export default function Home() {
  const [story, setStory] = useState<Story>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (request: StoryRequest) => {
    try {
      setIsLoading(true);
      const generatedStory = await storyViewModel.createStory(request);
      setStory(generatedStory);
    } catch (error) {
      console.error('Error generating story:', error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStory(undefined);
  };

  return (
    <main className="container mx-auto py-8">
      {isLoading && <LoadingOverlay />}
      
      {!story ? (
        <>
          <h1 className="text-4xl font-bold text-center">
            Storybook Creator
          </h1>
          <StoryForm onSubmit={handleSubmit} isLoading={isLoading} />
        </>
      ) : (
        <StoryBook story={story} onStartOver={handleStartOver} />
      )}
    </main>
  );
} 