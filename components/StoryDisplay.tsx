import { Story } from '../models/story';

interface StoryDisplayProps {
  story?: Story;
}

export default function StoryDisplay({ story }: StoryDisplayProps) {
  if (!story) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">{story.title}</h1>
      
      <div className="space-y-6">
        {story.paragraphs.map((paragraph, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-gray-700">{paragraph}</p>
            </div>
            {story.images[index] && (
              <div className="w-full md:w-64">
                <div className="bg-gray-200 w-full h-64 rounded-lg flex items-center justify-center">
                  {/* Placeholder for actual images */}
                  <span className="text-gray-500">Image placeholder</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 