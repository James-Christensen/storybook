import { useState } from 'react';
import { StoryRequest, GenerationMode } from '../models/story';

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
    name: 'None',
    description: 'Create a story without a sidekick',
    visualDescription: '',
    emoji: '🌟'
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
    name: 'Space Station', 
    description: 'A friendly space station with robot helpers',
    emoji: '🚀'
  },
  { 
    name: 'Candy Land', 
    description: 'A sweet world where everything is made of treats',
    emoji: '🍭'
  },
  { 
    name: 'Bubble City', 
    description: 'An underwater city protected by giant bubbles',
    emoji: '🫧'
  },
  { 
    name: 'Dragon Valley', 
    description: 'A peaceful valley where baby dragons play',
    emoji: '🐉'
  },
  { 
    name: 'Star Garden', 
    description: 'A magical garden where you can pick falling stars',
    emoji: '⭐'
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
    setting: '',
    pageCount: 6, // Default to 6 pages
    generationMode: 'ai' // Default to AI mode
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
        if (!customInputs.setting) setStep(3);
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

  const renderPageCountSelector = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <h2 className="text-3xl font-bold text-secondary">Choose story length</h2>
        <div className="badge badge-md badge-primary">Step 4</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
        {[3, 4, 5, 6, 7, 8, 9, 10].map(count => (
          <button
            key={count}
            type="button"
            tabIndex={-1}
            onClick={() => {
              setFormData(prev => ({ ...prev, pageCount: count }));
              setStep(4); // Advance to mode selection step
            }}
            className={`card bg-base-100 hover:bg-base-200 transition-all hover:scale-105 border select-none touch-manipulation ${
              formData.pageCount === count ? 'border-primary border-2' : 'border-base-200'
            }`}
          >
            <div className="card-body flex flex-col items-center justify-center text-center p-6">
              <span className="text-4xl font-bold mb-2">{count}</span>
              <p className="text-sm opacity-70">
                {count <= 4 ? 'Quick Story' :
                 count <= 6 ? 'Regular Story' :
                 count <= 8 ? 'Longer Story' :
                 'Epic Adventure'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderModeSelector = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <h2 className="text-3xl font-bold text-secondary">Choose generation mode</h2>
        <div className="badge badge-md badge-primary">Final Step</div>
      </div>
      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, generationMode: 'ai' }))}
          className={`card bg-base-100 hover:bg-base-200 transition-all hover:scale-105 border select-none touch-manipulation ${
            formData.generationMode === 'ai' ? 'border-primary border-2' : 'border-base-200'
          }`}
        >
          <div className="card-body flex flex-col items-center justify-center text-center p-6">
            <span className="text-4xl mb-2">🎨</span>
            <h3 className="text-xl font-bold mb-2">AI Generation</h3>
            <p className="text-sm opacity-70">
              Unique AI-generated illustrations for each page
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, generationMode: 'asset' }))}
          className={`card bg-base-100 hover:bg-base-200 transition-all hover:scale-105 border select-none touch-manipulation ${
            formData.generationMode === 'asset' ? 'border-primary border-2' : 'border-base-200'
          }`}
        >
          <div className="card-body flex flex-col items-center justify-center text-center p-6">
            <span className="text-4xl mb-2">⚡</span>
            <h3 className="text-xl font-bold mb-2">Asset-Based</h3>
            <p className="text-sm opacity-70">
              Instant illustrations using pre-made assets
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center gap-2 mb-6">
              <h2 className="text-3xl font-bold text-secondary">Choose your hero</h2>
              <div className="badge badge-md badge-primary">Step 1</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              {CHARACTER_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  tabIndex={-1}
                  onClick={() => handlePresetSelect('character', preset.name)}
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
            {customInputs.character && (
              <div className="form-control mt-6">
                <label className="label justify-center">
                  <span className="label-text text-lg">What's your hero's name?</span>
                </label>
                <input
                  type="text"
                  value={formData.mainCharacter}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, mainCharacter: e.target.value }));
                    if (e.target.value) setStep(1);
                  }}
                  placeholder="Enter your hero's name"
                  className="input input-bordered w-full max-w-xs mx-auto"
                  autoFocus
                />
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center gap-2 mb-6">
              <h2 className="text-3xl font-bold text-secondary">Choose a sidekick</h2>
              <div className="badge badge-md badge-primary">Step 2</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              {PET_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  tabIndex={-1}
                  onClick={() => handlePresetSelect('pet', preset.name)}
                  className={`card bg-base-100 hover:bg-base-200 transition-all text-center items-center justify-center hover:scale-105 border select-none touch-manipulation  ${
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
            {customInputs.pet && (
              <div className="form-control mt-6">
                <label className="label justify-center">
                  <span className="label-text text-lg">What's your sidekick's name?</span>
                </label>
                <input
                  type="text"
                  value={formData.sidekick}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, sidekick: e.target.value }));
                    if (e.target.value) setStep(2);
                  }}
                  placeholder="Enter your sidekick's name"
                  className="input input-bordered w-full max-w-xs mx-auto"
                  autoFocus
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center gap-2 mb-6">
              <h2 className="text-3xl font-bold text-secondary">Choose your adventure place</h2>
              <div className="badge badge-md badge-primary">Step 3</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              {SETTING_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  tabIndex={-1}
                  onClick={() => handlePresetSelect('setting', preset.name)}
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
            {customInputs.setting && (
              <div className="form-control mt-6">
                <label className="label justify-center">
                  <span className="label-text text-lg">What's your magical place called?</span>
                </label>
                <input
                  type="text"
                  value={formData.setting}
                  onChange={(e) => setFormData(prev => ({ ...prev, setting: e.target.value }))}
                  placeholder="Enter the name of your place"
                  className="input input-bordered w-full max-w-xs mx-auto"
                  autoFocus
                />
              </div>
            )}
          </div>
        );

      case 3:
        return renderPageCountSelector();

      case 4:
        return renderModeSelector();

      default:
        return null;
    }
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
                {step === 4 && formData.pageCount && (
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
                <li className={`step ${step >= 4 ? 'step-primary' : ''}`}>Mode</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 