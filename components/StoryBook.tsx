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
      {/* Book Page */}
      <div className="card bg-base-100 shadow-xl flex-1">
        <div className="card-body p-4 md:p-8">
          {/* Main Content Area */}
          <div className="flex flex-col h-full">
            {/* Image Container - Takes up top 2/3 on mobile and tablet */}
            <div className="relative w-full h-0 pb-[66.67%] mb-4 rounded-xl overflow-hidden bg-base-200">
              {currentPageData.imageUrl ? (
                <img 
                  src={currentPageData.imageUrl} 
                  alt={`Page ${currentPage} illustration`}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <span className="ml-4 opacity-50">Loading illustration...</span>
                </div>
              )}
            </div>

            {/* Text Container - Takes up bottom 1/3 on mobile and tablet */}
            <div className="flex-1 flex flex-col justify-between min-h-[33.33%] bg-base-200/20 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Page {currentPage}</h2>
                  <span className="text-sm font-medium opacity-60">
                    {currentPage} of {totalPages}
                  </span>
                </div>
                <p className="text-lg md:text-xl leading-relaxed">{currentPageData.text}</p>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-base-300">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="btn btn-primary"
                >
                  ← Previous
                </button>
                
                {isLastPage ? (
                  <button
                    onClick={onStartOver}
                    className="btn btn-secondary"
                  >
                    Start New Story
                  </button>
                ) : (
                  <button
                    onClick={goToNextPage}
                    className="btn btn-primary"
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