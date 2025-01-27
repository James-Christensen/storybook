import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Story } from '../models/story';
import KeyboardHints from './KeyboardHints';

interface StoryBookProps {
  story: Story;
  onStartOver: () => void;
  generationStatus: {
    status: 'writing' | 'drawing';
    currentPage?: number;
    totalPages?: number;
  };
}

export default function StoryBook({ story, onStartOver, generationStatus }: StoryBookProps) {
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

  const isCurrentPageGenerating = 
    generationStatus.status === 'drawing' && 
    generationStatus.currentPage === currentPage;

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
            {/* Image Container */}
            <div className="relative w-full h-0 pb-[66.67%] mb-4 rounded-xl overflow-hidden bg-base-200">
              {currentPageData.imageUrl ? (
                <Image 
                  src={currentPageData.imageUrl} 
                  alt={`Page ${currentPage} illustration`}
                  fill
                  className="object-contain"
                  priority={currentPage === 1}
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPENDPzE2O0FBNjpLPS1yWkNKTm1dZmNpbHaBf4GGgW96gXN9gW3/2wBDARUXFx4aHR4eHW1tQy1DbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  onLoadingComplete={(img) => {
                    img.classList.remove('blur-sm');
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">
                      {isCurrentPageGenerating ? (
                        <span>Creating illustration for page {currentPage}...</span>
                      ) : (
                        <span>Loading illustration...</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Text Container */}
            <div className="flex-1 flex flex-col justify-between min-h-[33.33%] bg-base-200/20 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Page {currentPage}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium opacity-60">
                      {currentPage} of {totalPages}
                    </span>
                    {generationStatus.status === 'drawing' && (
                      <span className="badge badge-primary badge-sm">
                        Generating illustrations...
                      </span>
                    )}
                  </div>
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