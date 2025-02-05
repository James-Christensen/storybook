import { POST } from '../app/api/story/route';
import { Story } from '../models/story';

describe('Story Generation API', () => {
  const createRequest = (input: any) => {
    return new Request('http://localhost:3000/api/story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    });
  };

  it('should generate a story with a sidekick character', async () => {
    const testInput = {
      mainCharacter: 'Alice',
      sidekick: 'Rabbit',
      setting: 'Wonderland',
      pageCount: 3,
      generationMode: 'asset'
    };

    const response = await POST(createRequest(testInput));
    const story = await response.json();

    // Log the test result
    logTestResult('story-with-sidekick', {
      input: testInput,
      response: story,
      error: response.status !== 200 ? story : undefined
    });

    expect(response.status).toBe(200);
    expect(story).toBeDefined();
    expect(story.title).toContain(testInput.mainCharacter);
    expect(story.pages).toHaveLength(testInput.pageCount);
    expect(story.pages[0].text).toContain(testInput.sidekick);
    expect(story.pages[0].imageDescription).toBeDefined();
  }, 30000);

  it('should generate a story without a sidekick', async () => {
    const testInput = {
      mainCharacter: 'Max',
      sidekick: 'None',
      setting: 'Forest',
      pageCount: 3,
      generationMode: 'asset'
    };

    const response = await POST(createRequest(testInput));
    const story = await response.json();

    // Log the test result
    logTestResult('story-without-sidekick', {
      input: testInput,
      response: story,
      error: response.status !== 200 ? story : undefined
    });

    expect(response.status).toBe(200);
    expect(story).toBeDefined();
    expect(story.title).toContain(testInput.mainCharacter);
    expect(story.pages).toHaveLength(testInput.pageCount);
    expect(story.pages[0].text).toBeDefined();
    expect(story.pages[0].imageDescription).toBeDefined();
  }, 30000);

  it('should generate a longer story with correct page count', async () => {
    const testInput = {
      mainCharacter: 'Sophie',
      sidekick: 'Dragon',
      setting: 'Castle',
      pageCount: 5,
      generationMode: 'asset'
    };

    const response = await POST(createRequest(testInput));
    const story = await response.json();

    // Log the test result
    logTestResult('longer-story', {
      input: testInput,
      response: story,
      error: response.status !== 200 ? story : undefined
    });

    expect(response.status).toBe(200);
    expect(story).toBeDefined();
    expect(story.pages).toHaveLength(testInput.pageCount);
    expect(story.pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pageNumber: expect.any(Number),
          text: expect.any(String),
          imageDescription: expect.any(String)
        })
      ])
    );
  }, 30000);

  it('should handle invalid input gracefully', async () => {
    const invalidInput = {
      // Missing required fields
    };

    const response = await fetch('http://localhost:3000/api/story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidInput),
    });

    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toHaveProperty('error');
  }, 30000);

  it('should generate asset-mode story with consistent character actions', async () => {
    const testInput = {
      mainCharacter: 'Maddie',
      sidekick: 'Tom',
      setting: 'forest',
      pageCount: 3,
      generationMode: 'asset'
    };

    const response = await POST(createRequest(testInput));
    const story = await response.json() as Story;

    // Log the test result
    logTestResult('asset-mode-character-consistency', {
      input: testInput,
      response: story,
      error: response.status !== 200 ? story : undefined
    });

    // Basic response validation
    expect(response.status).toBe(200);
    expect(story).toBeDefined();
    expect(story.pages).toHaveLength(testInput.pageCount);

    // Check each page's image description
    const validCharacterActions = ['standing', 'excited', 'thinking', 'celebrating', 'running', 'exploring'];
    const validSettings = ['bedroom', 'park', 'forest', 'beach'];
    
    story.pages.forEach(page => {
      const desc = page.imageDescription.toLowerCase();
      
      // Verify Maddie's actions are from valid set
      expect(
        validCharacterActions.some(action => desc.includes(action))
      ).toBe(true);

      // Verify setting is from valid set
      expect(
        validSettings.some(setting => desc.includes(setting))
      ).toBe(true);

      // If Tom is present, verify dog-appropriate actions
      if (testInput.sidekick === 'Tom') {
        expect(desc).not.toMatch(/tom.*(holding|hands|writing|drawing)/i);
      }
    });
  }, 30000);
}); 