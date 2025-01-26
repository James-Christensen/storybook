import { useState } from 'react';
import { StoryRequest } from '../models/story';

interface CharacterPreset {
  name: string;
  description: string;
  visualDescription: string;
  emoji: string;
}

export const CHARACTER_PRESETS: CharacterPreset[] = [
  { 
    name: 'Maddie', 
    description: 'A brave and cheerful toddler adventurer',
    visualDescription: 'A three year old toddler girl with brown hair, blue eyes, wearing a pink t-shirt, blue jeans, and pink converse shoes',
    emoji: '👧'
  },
  { 
    name: 'Pip', 
    description: 'A tiny, friendly dragon who loves cookies',
    visualDescription: 'A small, friendly dragon with iridescent purple scales, rounded spikes along its back, soft green eyes, and tiny wings. The dragon is wearing a blue bandana around its neck and has a cookie-crumb-covered snout',
    emoji: '🐲'
  },
  { 
    name: 'Luna', 
    description: 'A curious fairy with sparkly wings',
    visualDescription: 'A child-sized fairy with translucent rainbow wings that sparkle in the light, wearing a dress made of flower petals in pastel colors, with silver hair tied in two buns, and carrying a crystal wand',
    emoji: '🧚'
  },
  { 
    name: 'Beep', 
    description: 'A helpful robot learning about feelings',
    visualDescription: 'A small, rounded robot with a smooth white and blue metal exterior, expressive LED eyes that change color with emotions, retractable arms, and a digital heart display on its chest that glows softly',
    emoji: '🤖'
  },
  { 
    name: 'Sparklehorn', 
    description: 'A colorful unicorn who makes rainbows',
    visualDescription: 'A young unicorn with a pearlescent white coat, flowing rainbow mane and tail, golden hooves, and a spiral horn that sparkles with all colors of the rainbow. The unicorn has kind purple eyes and leaves a trail of sparkles when it walks',
    emoji: '🦄'
  },
  { 
    name: 'Custom', 
    description: 'Create your own character',
    visualDescription: '',
    emoji: '✨'
  },
];

export const PET_PRESETS: CharacterPreset[] = [
  { 
    name: 'Tom', 
    description: 'A playful gray mini schnauzer with a big heart',
    visualDescription: 'a grey miniature schnauzer puppy with a blue collar',
    emoji: '🐕'
  },
  { 
    name: 'Whisperwind', 
    description: 'A magical flying kitten',
    visualDescription: 'A small white and orange tabby kitten with tiny silver wings, wearing a purple ribbon around its neck, and having bright golden eyes that sparkle with magic',
    emoji: '🐱'
  },
  { 
    name: 'Glow', 
    description: 'A bouncy puppy with a glowing nose',
    visualDescription: 'A golden retriever puppy with fluffy fur, floppy ears, a red collar with a star-shaped tag, and a nose that glows with a soft blue light when excited',
    emoji: '🐶'
  },
  { 
    name: 'Bubbles', 
    description: 'A tiny dragon that hiccups bubbles',
    visualDescription: 'A baby dragon the size of a kitten, with soft teal scales, rounded baby horns, tiny wings, and a pink belly. When it hiccups, it produces rainbow-colored bubbles',
    emoji: '🐉'
  },
  { 
    name: 'Cloudhopper', 
    description: 'A rabbit that can hop through clouds',
    visualDescription: 'A fluffy white rabbit with extra-long ears tipped in silver, wearing a small backpack made of clouds, and having eyes that reflect the sky. Its fur seems to float weightlessly when it jumps',
    emoji: '🐰'
  },
  { 
    name: 'Custom', 
    description: 'Create your own sidekick',
    visualDescription: '',
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
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-secondary">Choose your hero</h2>
              <div className="badge badge-sm badge-primary">Step 1</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {CHARACTER_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect('character', preset.name)}
                  className={`card bg-base-100 hover:bg-base-200 transition-all hover:scale-105 border ${
                    formData.mainCharacter === preset.name ? 'border-primary border-2' : 'border-base-200'
                  }`}
                >
                  <div className="card-body flex flex-col items-center justify-between p-6">
                    <span className="text-4xl">{preset.emoji}</span>
                    <div className="text-center">
                      <h3 className="text-lg font-bold mb-2">{preset.name}</h3>
                      <p className="text-sm opacity-70">{preset.description}</p>
                    </div>
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
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-primary-content">Choose a sidekick</h2>
              <div className="badge badge-sm badge-primary">Step 2</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {PET_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect('pet', preset.name)}
                  className={`card bg-base-100 hover:bg-base-200 transition-all hover:scale-105 border ${
                    formData.sidekick === preset.name ? 'border-primary border-2' : 'border-base-200'
                  }`}
                >
                  <div className="card-body flex flex-col items-center justify-between p-6">
                    <span className="text-4xl">{preset.emoji}</span>
                    <div className="text-center">
                      <h3 className="text-lg font-bold mb-2">{preset.name}</h3>
                      <p className="text-sm opacity-70">{preset.description}</p>
                    </div>
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
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-primary-content">Choose your adventure place</h2>
              <div className="badge badge-sm badge-primary">Step 3</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {SETTING_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect('setting', preset.name)}
                  className={`card bg-base-100 hover:bg-base-200 transition-all hover:scale-105 border ${
                    formData.setting === preset.name ? 'border-primary border-2' : 'border-base-200'
                  }`}
                >
                  <div className="card-body flex flex-col items-center justify-between p-6">
                    <span className="text-4xl">{preset.emoji}</span>
                    <div className="text-center">
                      <h3 className="text-lg font-bold mb-2">{preset.name}</h3>
                      <p className="text-sm opacity-70">{preset.description}</p>
                    </div>
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
          <div className="min-h-[60vh] flex flex-col">
            <div className="flex-1">
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