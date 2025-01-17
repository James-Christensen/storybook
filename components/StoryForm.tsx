import { useState } from 'react';
import { StoryRequest } from '../models/story';

interface StoryFormProps {
  onSubmit: (request: StoryRequest) => void;
}

export default function StoryForm({ onSubmit }: StoryFormProps) {
  const [formData, setFormData] = useState<StoryRequest>({
    mainCharacter: '',
    sidekick: '',
    setting: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">
          Main Character
          <input
            type="text"
            value={formData.mainCharacter}
            onChange={(e) => setFormData({...formData, mainCharacter: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Sidekick
          <input
            type="text"
            value={formData.sidekick}
            onChange={(e) => setFormData({...formData, sidekick: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Setting
          <input
            type="text"
            value={formData.setting}
            onChange={(e) => setFormData({...formData, setting: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Generate Story
      </button>
    </form>
  );
} 