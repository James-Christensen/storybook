import { useState, useEffect } from 'react';
import { Story } from '../models/story';
import KeyboardHints from './KeyboardHints';

interface StoryBookProps {
  story: Story;
  onStartOver: () => void;
}

export default function StoryBook({ story, onStartOver }: StoryBookProps) {
  const [showCover, setShowCover] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = story.pages.length;
  
  const currentPageData = story.pages[currentPage - 1];
  const isLastPage = currentPage === totalPages;

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(curr => curr + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(curr => curr - 1);
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showCover) {
        if (e.code === 'Space' || e.code === 'Enter') {
          setShowCover(false);
        }
        return;
      }

      switch (e.code) {
        case 'ArrowRight':
        case 'Space':
          if (!isLastPage) goToNextPage();
          break;
        case 'ArrowLeft':
          if (currentPage > 1) goToPreviousPage();
          break;
        case 'Home':
          setCurrentPage(1);
          break;
        case 'End':
          setCurrentPage(totalPages);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, isLastPage, showCover]);

  if (showCover) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="card bg-primary text-primary-content w-full max-w-5xl">
          <div className="card-body items-center text-center py-16">
            <h1 className="text-5xl font-bold mb-6">{story.title}</h1>
            <p className="text-2xl italic mb-12">A magical adventure story</p>
            <button 
              onClick={() => setShowCover(false)} 
              className="btn btn-secondary btn-lg text-xl px-12"
            >
              Open Book
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col px-4 py-8 gap-4">
      <div className="card bg-base-100 shadow-xl flex-1">
        <div className="card-body p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Image Side */}
            <div className="relative min-h-[40vh] lg:min-h-[60vh] rounded-box overflow-hidden bg-base-200">
              {currentPageData.imageUrl ? (
                <img 
                  src={currentPageData.imageUrl} 
                  alt={`Page ${currentPage} illustration`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <span className="ml-4 opacity-50">Loading illustration...</span>
                </div>
              )}
            </div>
            
            {/* Text Side */}
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Page {currentPage}</h2>
                <p className="text-2xl leading-relaxed">{currentPageData.text}</p>
              </div>
              
              <div className="flex items-center justify-between pt-8 border-t border-base-300 mt-8">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="btn btn-primary btn-lg"
                >
                  ← Previous
                </button>
                
                <span className="text-xl font-medium">
                  {currentPage} of {totalPages}
                </span>
                
                {isLastPage ? (
                  <button
                    onClick={onStartOver}
                    className="btn btn-secondary btn-lg"
                  >
                    Start New Story
                  </button>
                ) : (
                  <button
                    onClick={goToNextPage}
                    className="btn btn-primary btn-lg"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <KeyboardHints />
    </div>
  );
} 