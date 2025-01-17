import { useState } from 'react';
import { StoryRequest } from '../models/story';

const CHARACTER_PRESETS = [
  { 
    name: 'Dragon', 
    description: 'A tiny, friendly dragon who loves cookies',
    emoji: '🐲'
  },
  { 
    name: 'Fairy', 
    description: 'A curious fairy with sparkly wings',
    emoji: '🧚'
  },
  { 
    name: 'Robot', 
    description: 'A helpful robot learning about feelings',
    emoji: '🤖'
  },
  { 
    name: 'Unicorn', 
    description: 'A colorful unicorn who makes rainbows',
    emoji: '🦄'
  },
  { 
    name: 'Custom', 
    description: 'Create your own character',
    emoji: '✨'
  },
];

const PET_PRESETS = [
  { 
    name: 'Kitten', 
    description: 'A magical flying kitten',
    emoji: '🐱'
  },
  { 
    name: 'Puppy', 
    description: 'A bouncy puppy with a glowing nose',
    emoji: '🐶'
  },
  { 
    name: 'Baby Dragon', 
    description: 'A tiny dragon that hiccups bubbles',
    emoji: '🐉'
  },
  { 
    name: 'Bunny', 
    description: 'A rabbit that can hop through clouds',
    emoji: '🐰'
  },
  { 
    name: 'Custom', 
    description: 'Create your own sidekick',
    emoji: '✨'
  },
];

const SETTING_PRESETS = [
  { 
    name: 'Magic Forest', 
    description: 'A forest with talking trees and glowing flowers',
    emoji: '🌳'
  },
  { 
    name: 'Cloud Castle', 
    description: 'A castle floating high in the sky',
    emoji: '🏰'
  },
  { 
    name: 'Rainbow Beach', 
    description: 'A beach with colorful sand and singing waves',
    emoji: '🏖️'
  },
  { 
    name: 'Crystal Cave', 
    description: 'A sparkling cave full of magical gems',
    emoji: '💎'
  },
  { 
    name: 'Custom', 
    description: 'Create your own magical place',
    emoji: '✨'
  },
];

interface StoryFormProps {
  onSubmit: (request: StoryRequest) => void;
  isLoading?: boolean;
}

export default function StoryForm({ onSubmit, isLoading = false }: StoryFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<StoryRequest>({
    mainCharacter: '',
    sidekick: '',
    setting: ''
  });
  const [customInputs, setCustomInputs] = useState({
    character: false,
    pet: false,
    setting: false
  });

  const handlePresetSelect = (type: 'character' | 'pet' | 'setting', value: string) => {
    if (value === 'Custom') {
      setCustomInputs(prev => ({ ...prev, [type]: true }));
      return;
    }

    setCustomInputs(prev => ({ ...prev, [type]: false }));
    switch (type) {
      case 'character':
        setFormData(prev => ({ ...prev, mainCharacter: value }));
        if (!customInputs.character) setStep(1);
        break;
      case 'pet':
        setFormData(prev => ({ ...prev, sidekick: value }));
        if (!customInputs.pet) setStep(2);
        break;
      case 'setting':
        setFormData(prev => ({ ...prev, setting: value }));
        break;
    }
  };

  const handleCustomInput = (type: 'character' | 'pet' | 'setting', value: string) => {
    switch (type) {
      case 'character':
        setFormData(prev => ({ ...prev, mainCharacter: value }));
        break;
      case 'pet':
        setFormData(prev => ({ ...prev, sidekick: value }));
        break;
      case 'setting':
        setFormData(prev => ({ ...prev, setting: value }));
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-2xl font-bold text-primary-content">Choose your hero</h2>
              <div className="badge badge-sm badge-primary">Step 1</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {CHARACTER_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect('character', preset.name)}
                  className={`card bg-base-100 hover:bg-base-200 transition-colors border ${
                    formData.mainCharacter === preset.name ? 'border-primary' : 'border-base-200'
                  }`}
                >
                  <div className="card-body p-2 items-center text-center">
                    <span className="text-2xl">{preset.emoji}</span>
                    <h3 className="font-bold text-sm">{preset.name}</h3>
                    <p className="text-xs opacity-70 line-clamp-2">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>
            {customInputs.character && (
              <div className="form-control mt-2">
                <label className="label py-1">
                  <span className="label-text">What's your hero's name?</span>
                </label>
                <input
                  type="text"
                  value={formData.mainCharacter}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, mainCharacter: e.target.value }));
                    if (e.target.value) setStep(1);
                  }}
                  placeholder="Enter your hero's name"
                  className="input input-bordered input-sm"
                  autoFocus
                />
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-2xl font-bold text-primary-content">Choose a sidekick</h2>
              <div className="badge badge-sm badge-primary">Step 2</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {PET_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect('pet', preset.name)}
                  className={`card bg-base-100 hover:bg-base-200 transition-colors border ${
                    formData.sidekick === preset.name ? 'border-primary' : 'border-base-200'
                  }`}
                >
                  <div className="card-body p-2 items-center text-center">
                    <span className="text-2xl">{preset.emoji}</span>
                    <h3 className="font-bold text-sm">{preset.name}</h3>
                    <p className="text-xs opacity-70 line-clamp-2">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>
            {customInputs.pet && (
              <div className="form-control mt-2">
                <label className="label py-1">
                  <span className="label-text">What's your sidekick's name?</span>
                </label>
                <input
                  type="text"
                  value={formData.sidekick}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, sidekick: e.target.value }));
                    if (e.target.value) setStep(2);
                  }}
                  placeholder="Enter your sidekick's name"
                  className="input input-bordered input-sm"
                  autoFocus
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-2xl font-bold text-primary-content">Choose your adventure place</h2>
              <div className="badge badge-sm badge-primary">Step 3</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {SETTING_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect('setting', preset.name)}
                  className={`card bg-base-100 hover:bg-base-200 transition-colors border ${
                    formData.setting === preset.name ? 'border-primary' : 'border-base-200'
                  }`}
                >
                  <div className="card-body p-2 items-center text-center">
                    <span className="text-2xl">{preset.emoji}</span>
                    <h3 className="font-bold text-sm">{preset.name}</h3>
                    <p className="text-xs opacity-70 line-clamp-2">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>
            {customInputs.setting && (
              <div className="form-control mt-2">
                <label className="label py-1">
                  <span className="label-text">What's your magical place called?</span>
                </label>
                <input
                  type="text"
                  value={formData.setting}
                  onChange={(e) => setFormData(prev => ({ ...prev, setting: e.target.value }))}
                  placeholder="Enter the name of your place"
                  className="input input-bordered input-sm"
                  autoFocus
                />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-2xl w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="card-body p-6">
          <div className="h-[70vh] flex flex-col">
            <div className="flex-1 overflow-y-auto px-2">
              {renderStep()}
            </div>

            <div className="pt-3 mt-3 border-t border-base-300">
              <div className="flex justify-between items-center">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="btn btn-sm btn-ghost"
                  >
                    ← Back
                  </button>
                )}
                {step === 2 && formData.setting && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  >
                    {isLoading ? 'Creating Story...' : 'Start Adventure!'}
                  </button>
                )}
              </div>

              <ul className="steps steps-horizontal w-full mt-3">
                <li className={`step step-sm ${step >= 0 ? 'step-primary' : ''}`}>Hero</li>
                <li className={`step step-sm ${step >= 1 ? 'step-primary' : ''}`}>Sidekick</li>
                <li className={`step step-sm ${step >= 2 ? 'step-primary' : ''}`}>Place</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 