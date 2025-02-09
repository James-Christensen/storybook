import { useState } from 'react';
import { Story, StoryPage } from '../models/story';

interface StoryDisplayProps {
  story: Story | null;
}

export default function StoryDisplay({ story }: StoryDisplayProps) {
  const [loadingImages, setLoadingImages] = useState<{ [key: number]: boolean }>({});
  const [images, setImages] = useState<{ [key: number]: string }>({});
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  if (!story) {
    return null;
  }

  const generateImage = async (page: StoryPage, pageIndex: number) => {
    if (images[pageIndex]) return; // Skip if image already exists
    
    setLoadingImages(prev => ({ ...prev, [pageIndex]: true }));
    setErrors(prev => ({ ...prev, [pageIndex]: '' }));

    try {
      const response = await fetch('/api/compose-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: page.imageDescription,
          pageNumber: pageIndex + 1,
          totalPages: story.pages.length,
          storyId: story.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setImages(prev => ({ ...prev, [pageIndex]: data.imageData }));
      
    } catch (error) {
      console.error('Image generation error:', error);
      setErrors(prev => ({ 
        ...prev, 
        [pageIndex]: 'Failed to generate image. Click to retry.' 
      }));
    } finally {
      setLoadingImages(prev => ({ ...prev, [pageIndex]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">{story.title}</h1>
      <p className="text-xl text-gray-600 mb-8">{story.subtitle}</p>
      
      <div className="space-y-12">
        {story.pages.map((page, index) => (
          <div key={index} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <p className="text-lg mb-4">{page.text}</p>
                </div>
                <div className="flex-1">
                  {images[index] ? (
                    <img
                      src={images[index]}
                      alt={`Page ${index + 1}`}
                      className="w-full rounded-lg shadow-lg"
                    />
                  ) : (
                    <button
                      onClick={() => generateImage(page, index)}
                      disabled={loadingImages[index]}
                      className="w-full aspect-square flex items-center justify-center bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                    >
                      {loadingImages[index] ? (
                        <div className="loading loading-spinner loading-lg" />
                      ) : errors[index] ? (
                        <div className="text-error text-center p-4">
                          {errors[index]}
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          Click to generate illustration
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 