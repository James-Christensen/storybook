'use client';  // This is important for client-side features like useState

import { useState } from 'react';
import StoryForm from '../components/StoryForm';
import StoryBook from '../components/StoryBook';
import LoadingOverlay from '../components/LoadingOverlay';
import { Story, StoryRequest } from '../models/story';
import { storyViewModel } from '../viewmodels/storyViewModel';

type GenerationStatus = {
  status: 'writing' | 'drawing';
  currentPage?: number;
  totalPages?: number;
};

export default function Home() {
  const [story, setStory] = useState<Story>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>();
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    status: 'writing'
  });

  const handleSubmit = async (request: StoryRequest) => {
    try {
      setIsGenerating(true);
      setError(undefined);
      setGenerationStatus({ status: 'writing' });
      
      console.log('Submitting request:', request);
      
      // First generate the story text
      const initialStory = await storyViewModel.createStoryText(request);
      setStory(initialStory);
      setIsGenerating(false);
      
      // Then generate images in the background
      storyViewModel.generateImagesForStory(initialStory, {
        onProgress: (page: number, total: number) => {
          setGenerationStatus({
            status: 'drawing',
            currentPage: page,
            totalPages: total
          });
        },
        onImageGenerated: (pageIndex: number, imageUrl: string) => {
          setStory(prevStory => {
            if (!prevStory) return prevStory;
            const updatedPages = [...prevStory.pages];
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], imageUrl };
            return { ...prevStory, pages: updatedPages };
          });
        }
      });
      
    } catch (error) {
      console.error('Error generating story:', error);
      setError(error instanceof Error ? error.message : 'Failed to create your story. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <main className="container mx-auto py-8">
      {isGenerating && (
        <LoadingOverlay 
          status={generationStatus.status}
          currentPage={generationStatus.currentPage}
          totalPages={generationStatus.totalPages}
        />
      )}
      
      {!story ? (
        <>
          <h1 className="text-4xl font-bold text-center mb-8">
            Storybook Creator
          </h1>
          {error && (
            <div className="alert alert-error max-w-md mx-auto mt-4">
              <span>{error}</span>
            </div>
          )}
          <StoryForm onSubmit={handleSubmit} isLoading={isGenerating} />
        </>
      ) : (
        <StoryBook 
          story={story} 
          onStartOver={() => {
            setStory(undefined);
            setGenerationStatus({ status: 'writing' });
          }}
          generationStatus={generationStatus}
        />
      )}
    </main>
  );
} 