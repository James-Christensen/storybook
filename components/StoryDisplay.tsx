import { useState } from 'react';
import { Story, StoryPage, GenerationMode } from '../models/story';

interface StoryDisplayProps {
  story?: Story;
  generationMode: GenerationMode;
}

export default function StoryDisplay({ story, generationMode }: StoryDisplayProps) {
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
      const endpoint = generationMode === 'asset' ? '/api/compose-image' : '/api/image';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: page.imageDescription,
          // Add any mode-specific parameters here
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      
      // Handle different response formats for each mode
      const imageUrl = generationMode === 'asset' 
        ? data.imageData // Base64 image data from compose-image
        : `data:image/png;base64,${data.images[0]}`; // Base64 image from AI generation

      setImages(prev => ({ ...prev, [pageIndex]: imageUrl }));
      
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
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{story.title}</h1>
      
      <div className="space-y-12">
        {story.pages.map((page, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 prose">
              <h2 className="text-xl font-semibold mb-4">Page {page.pageNumber}</h2>
              <p className="text-lg">{page.text}</p>
            </div>
            
            <div className="w-full md:w-96">
              {!images[index] && !loadingImages[index] && (
                <button
                  onClick={() => generateImage(page, index)}
                  className={`w-full h-64 rounded-lg flex items-center justify-center border-2 border-dashed 
                    ${errors[index] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
                    hover:bg-gray-100 transition-colors`}
                >
                  <div className="text-center p-4">
                    <p className="text-gray-500">
                      {errors[index] || 'Click to generate image'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Using {generationMode === 'asset' ? 'asset-based' : 'AI'} generation
                    </p>
                  </div>
                </button>
              )}
              
              {loadingImages[index] && (
                <div className="w-full h-64 rounded-lg flex items-center justify-center bg-gray-50 border-2 border-gray-300">
                  <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="text-gray-500 mt-4">Generating image...</p>
                  </div>
                </div>
              )}
              
              {images[index] && (
                <img
                  src={images[index]}
                  alt={`Illustration for page ${page.pageNumber}`}
                  className="w-full rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 