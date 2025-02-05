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

  it('should generate asset-mode story with appropriate character actions', async () => {
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
    
    story.pages.forEach(page => {
      const desc = page.imageDescription.toLowerCase();
      
      // If Tom is present, verify dog-appropriate actions
      if (testInput.sidekick === 'Tom') {
        expect(desc).not.toMatch(/tom.*(holding|hands|writing|drawing)/i);
      }
    });
  }, 30000);

  describe('Image Asset Quality', () => {
    it('should maintain character visual consistency across pages', async () => {
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
      logTestResult('character-visual-consistency', {
        input: testInput,
        response: story,
        error: response.status !== 200 ? story : undefined
      });

      // Basic validation
      expect(response.status).toBe(200);
      expect(story).toBeDefined();
      expect(story.pages).toHaveLength(testInput.pageCount);

      // Extract character descriptions from each page
      const characterDescriptions = story.pages.map(page => {
        const desc = page.imageDescription.toLowerCase();
        return {
          maddieDesc: desc.substring(desc.indexOf('maddie'), desc.indexOf('.', desc.indexOf('maddie'))),
          tomDesc: testInput.sidekick === 'Tom' ? 
            desc.substring(desc.indexOf('tom'), desc.indexOf('.', desc.indexOf('tom'))) : ''
        };
      });

      // Check Maddie's description consistency
      characterDescriptions.forEach((desc, index) => {
        if (index > 0) {
          // If a physical trait is mentioned in a later description, it should match earlier mentions
          const prevDesc = characterDescriptions[index - 1].maddieDesc;
          const currentDesc = desc.maddieDesc;
          
          // Check for contradicting physical descriptions
          ['hair', 'eyes', 'wearing', 'dress', 'outfit'].forEach(trait => {
            if (currentDesc.includes(trait) && prevDesc.includes(trait)) {
              expect(currentDesc).toEqual(
                expect.stringContaining(
                  prevDesc.substring(
                    prevDesc.indexOf(trait),
                    prevDesc.indexOf(' ', prevDesc.indexOf(trait) + trait.length)
                  )
                )
              );
            }
          });
        }
      });
    });

    it('should use appropriate backgrounds for the setting', async () => {
      const testInput = {
        mainCharacter: 'Maddie',
        sidekick: 'None',
        setting: 'forest',
        pageCount: 3,
        generationMode: 'asset'
      };

      const response = await POST(createRequest(testInput));
      const story = await response.json() as Story;

      // Log the test result
      logTestResult('background-setting-consistency', {
        input: testInput,
        response: story,
        error: response.status !== 200 ? story : undefined
      });

      // Basic validation
      expect(response.status).toBe(200);
      expect(story).toBeDefined();
      expect(story.pages).toHaveLength(testInput.pageCount);

      // Check each page's background matches the setting
      story.pages.forEach(page => {
        const desc = page.imageDescription.toLowerCase();
        
        // The background description should match the story's setting
        expect(desc).toContain(testInput.setting.toLowerCase());
        
        // The setting should be described with appropriate elements
        if (testInput.setting.toLowerCase() === 'forest') {
          expect(desc).toMatch(/trees|leaves|woods|woodland|nature/);
        }
      });
    });
  });
}); 