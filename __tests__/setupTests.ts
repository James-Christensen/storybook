import { Story } from '../models/story';

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      title: "Maddie's Magical Forest Discovery",
      subtitle: "A Tale of Friendship and Wonder",
      pages: [
        {
          pageNumber: 1,
          text: "One sunny morning, Maddie woke up feeling extra adventurous. She put on her favorite pink shoes and called out to her friend Tom.",
          imageDescription: "Maddie stands excitedly in her cozy bedroom, wearing pink shoes and a bright smile, while Tom the puppy wags his tail beside her bed."
        },
        {
          pageNumber: 2,
          text: "Together, they ventured into the magical forest where the trees seemed to whisper secrets. Maddie's eyes widened with wonder as she spotted something glowing in the distance.",
          imageDescription: "Maddie runs energetically through the magical forest path, with Tom following close behind. The forest is filled with tall trees and mysterious glowing lights."
        },
        {
          pageNumber: 3,
          text: "After their amazing discovery, Maddie and Tom celebrated their adventure with happy jumps and playful spins. They couldn't wait to come back tomorrow for another magical day.",
          imageDescription: "Maddie jumps joyfully in a forest clearing, arms raised in celebration, while Tom playfully circles around her. The magical forest backdrop sparkles with afternoon sunlight."
        }
      ]
    })
  })
) as jest.Mock;

// Mock console.log to reduce noise in tests
global.console.log = jest.fn(); 