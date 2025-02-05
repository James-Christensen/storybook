import { POST } from '../app/api/story/route';

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
      pageCount: 2,
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
      pageCount: 2,
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
      pageCount: 4,
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
    const testInput = {
      mainCharacter: '',  // Empty character name
      sidekick: 'Dragon',
      setting: 'Castle',
      pageCount: -1,  // Invalid page count
      generationMode: 'asset'
    };

    const response = await POST(createRequest(testInput));
    const result = await response.json();

    // Log the test result
    logTestResult('invalid-input', {
      input: testInput,
      response: result,
      error: response.status !== 200 ? result : undefined
    });

    expect(response.status).toBe(500);
    expect(result).toHaveProperty('error');
  }, 30000);
}); 