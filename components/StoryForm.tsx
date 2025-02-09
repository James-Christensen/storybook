import { useState } from 'react';
import { StoryRequest, GenerationMode } from '../models/story';

interface CharacterPreset {
  name: string;
  description: string;
  visualDescription: string;
  emoji: string;
}

// Asset-based mode presets (limited to available assets)
export const ASSET_MODE_PRESETS = {
  characters: [
    { 
      name: 'Maddie', 
      description: 'A brave and cheerful toddler adventurer',
      visualDescription: 'A three year old toddler girl with brown hair, blue eyes, wearing a pink t-shirt, blue jeans, and pink converse shoes',
      emoji: '👧'
    }
  ],
  sidekicks: [
    { 
      name: 'Tom', 
      description: 'A playful gray mini schnauzer with a big heart',
      visualDescription: 'a grey miniature schnauzer puppy with a blue collar',
      emoji: '🐕'
    },
    {
      name: 'None',
      description: 'Create a story without a sidekick',
      visualDescription: '',
      emoji: '🌟'
    }
  ],
  settings: [
    { 
      name: 'Cozy Bedroom', 
      description: 'A warm and inviting bedroom filled with toys and books',
      emoji: '🛏️'
    },
    { 
      name: 'Sunny Park', 
      description: 'A cheerful park with a playground and tall trees',
      emoji: '🌳'
    },
    { 
      name: 'Magic Forest', 
      description: 'A mysterious forest with towering trees and magical paths',
      emoji: '🌲'
    },
    { 
      name: 'Sandy Beach', 
      description: 'A beautiful beach with sparkling waves and soft sand',
      emoji: '🏖️'
    }
  ]
};

interface StoryFormProps {
  onSubmit: (request: StoryRequest) => void;
  isLoading?: boolean;
}

export default function StoryForm({ onSubmit, isLoading = false }: StoryFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<StoryRequest>({
    mainCharacter: '',
    sidekick: 'None',
    setting: '',
    pageCount: 6,
    generationMode: 'asset'
  });

  const renderCharacterSelector = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <h2 className="text-3xl font-bold text-secondary">Meet Your Hero</h2>
        <div className="badge badge-md badge-primary">Step 1</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {ASSET_MODE_PRESETS.characters.map(preset => (
          <button
            key={preset.name}
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, mainCharacter: preset.name }));
              setStep(1);
            }}
            className={`card bg-base-100 hover:bg-base-200 transition-all text-center items-center justify-center hover:scale-105 border select-none touch-manipulation ${
              formData.mainCharacter === preset.name ? 'border-primary border-2' : 'border-base-200'
            }`}
          >
            <div className="card-body flex flex-col items-center justify-center text-center p-6 gap-4">
              <span className="text-5xl mb-2">{preset.emoji}</span>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{preset.name}</h3>
                <p className="text-sm opacity-70 leading-snug">{preset.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSidekickSelector = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <h2 className="text-3xl font-bold text-secondary">Choose a sidekick</h2>
        <div className="badge badge-md badge-primary">Step 2</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {ASSET_MODE_PRESETS.sidekicks.map(preset => (
          <button
            key={preset.name}
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, sidekick: preset.name }));
              setStep(2);
            }}
            className={`card bg-base-100 hover:bg-base-200 transition-all text-center items-center justify-center hover:scale-105 border select-none touch-manipulation ${
              formData.sidekick === preset.name ? 'border-primary border-2' : 'border-base-200'
            }`}
          >
            <div className="card-body flex flex-col items-center justify-center text-center p-6 gap-4">
              <span className="text-5xl mb-2">{preset.emoji}</span>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{preset.name}</h3>
                <p className="text-sm opacity-70 leading-snug">{preset.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSettingSelector = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <h2 className="text-3xl font-bold text-secondary">Choose your adventure place</h2>
        <div className="badge badge-md badge-primary">Step 3</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {ASSET_MODE_PRESETS.settings.map(preset => (
          <button
            key={preset.name}
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, setting: preset.name }));
              setStep(3);
            }}
            className={`card bg-base-100 hover:bg-base-200 transition-all text-center items-center justify-center hover:scale-105 border select-none touch-manipulation ${
              formData.setting === preset.name ? 'border-primary border-2' : 'border-base-200'
            }`}
          >
            <div className="card-body flex flex-col items-center justify-center text-center p-6 gap-4">
              <span className="text-5xl mb-2">{preset.emoji}</span>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{preset.name}</h3>
                <p className="text-sm opacity-70 leading-snug">{preset.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPageCountSelector = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <h2 className="text-3xl font-bold text-secondary">Choose story length</h2>
        <div className="badge badge-md badge-primary">Final Step</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
        {[3, 4, 5, 6].map(count => (
          <button
            key={count}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, pageCount: count }))}
            className={`card bg-base-100 hover:bg-base-200 transition-all hover:scale-105 border select-none touch-manipulation ${
              formData.pageCount === count ? 'border-primary border-2' : 'border-base-200'
            }`}
          >
            <div className="card-body flex flex-col items-center justify-center text-center p-6">
              <span className="text-4xl font-bold mb-2">{count}</span>
              <p className="text-sm opacity-70">
                {count <= 4 ? 'Quick Story' : 'Regular Story'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return renderCharacterSelector();
      case 1:
        return renderSidekickSelector();
      case 2:
        return renderSettingSelector();
      case 3:
        return renderPageCountSelector();
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-2xl w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="card-body p-8">
          <div className="min-h-[60vh] flex flex-col">
            <div className="flex-1">
              {renderStep()}
            </div>

            <div className="pt-6 mt-6 border-t border-base-300">
              <div className="flex justify-between items-center">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="btn btn-ghost"
                  >
                    ← Back
                  </button>
                )}
                <div className="flex-1" />
                {step === 3 && formData.pageCount && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn btn-primary btn-lg ${isLoading ? 'loading' : ''}`}
                  >
                    {isLoading ? 'Creating Story...' : 'Start Adventure!'}
                  </button>
                )}
              </div>

              <ul className="steps steps-horizontal w-full mt-6">
                <li className={`step ${step >= 0 ? 'step-primary' : ''}`}>Hero</li>
                <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Sidekick</li>
                <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Place</li>
                <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Length</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 