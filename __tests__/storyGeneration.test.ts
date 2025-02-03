import { StoryRequest, Story } from '../models/story';
import { CHARACTER_POSES, BACKGROUNDS, findBestPose, findBestBackground } from '../models/assets';
import { storyViewModel } from '../viewmodels/storyViewModel';
import fs from 'fs/promises';
import path from 'path';

describe('Story Generation Analysis', () => {
  // Store multiple story outputs for analysis
  const SAMPLE_SIZE = 3;
  const OUTPUT_DIR = path.join(__dirname, 'analysis_output');
  let stories: Story[] = [];

  // Test requests with different settings
  const testRequests: StoryRequest[] = [
    {
      mainCharacter: 'Maddie',
      sidekick: 'Tom',
      setting: 'Magic Forest',
      pageCount: 3,
      generationMode: 'asset'
    },
    {
      mainCharacter: 'Maddie',
      sidekick: 'None',
      setting: 'Cozy Bedroom',
      pageCount: 3,
      generationMode: 'asset'
    },
    {
      mainCharacter: 'Maddie',
      sidekick: 'Tom',
      setting: 'Sunny Park',
      pageCount: 3,
      generationMode: 'asset'
    }
  ];

  beforeAll(async () => {
    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Generate multiple stories for analysis
    for (const request of testRequests) {
      const story = await storyViewModel.createStoryText(request);
      stories.push(story);
      
      // Save story output for manual review
      await fs.writeFile(
        path.join(OUTPUT_DIR, `story_${stories.length}.json`),
        JSON.stringify(story, null, 2)
      );
    }
  });

  describe('Title and Subtitle Analysis', () => {
    test('titles should be unique and creative', () => {
      const titles = stories.map(s => s.title);
      const uniqueTitles = new Set(titles);
      
      // Log titles for analysis
      console.log('Generated titles:', titles);
      
      // Check uniqueness
      expect(uniqueTitles.size).toBe(stories.length);
      
      // Check that titles aren't using generic patterns
      titles.forEach(title => {
        expect(title).not.toMatch(/^Maddie's Adventure in/);
        expect(title).not.toMatch(/^The Adventures of Maddie/);
      });
    });

    test('subtitles should provide meaningful context', () => {
      const subtitles = stories.map(s => s.subtitle);
      console.log('Generated subtitles:', subtitles);
      
      subtitles.forEach(subtitle => {
        // Check length and structure
        expect(subtitle.length).toBeGreaterThan(10);
        // Check for emotional or thematic content
        expect(
          subtitle.toLowerCase()
        ).toMatch(
          /(friendship|discovery|adventure|magic|wonder|brave|journey|fun)/
        );
      });
    });
  });

  describe('Asset Matching Analysis', () => {
    test('image descriptions should effectively match available poses', () => {
      const allPoseMatches = stories.flatMap(story =>
        story.pages.map(page => {
          const selectedPose = findBestPose(page.imageDescription);
          const score = evaluatePoseMatch(page.imageDescription, selectedPose);
          return {
            story: story.title,
            page: page.pageNumber,
            description: page.imageDescription,
            selectedPose: selectedPose.name,
            score,
            emotions: selectedPose.emotions,
            actions: selectedPose.actions
          };
        })
      );

      // Save pose matching analysis
      fs.writeFile(
        path.join(OUTPUT_DIR, 'pose_matching_analysis.json'),
        JSON.stringify(allPoseMatches, null, 2)
      );

      // Log summary for quick review
      console.log('Pose matching summary:', {
        totalMatches: allPoseMatches.length,
        averageScore: allPoseMatches.reduce((sum, m) => sum + m.score, 0) / allPoseMatches.length,
        poseDistribution: allPoseMatches.reduce((dist, m) => {
          dist[m.selectedPose] = (dist[m.selectedPose] || 0) + 1;
          return dist;
        }, {} as Record<string, number>)
      });

      // Verify pose variety
      const posesPerStory = stories.map(story => {
        const poses = story.pages.map(page => findBestPose(page.imageDescription).id);
        return new Set(poses).size;
      });
      
      // Each story should use at least 2 different poses
      posesPerStory.forEach(uniquePoses => {
        expect(uniquePoses).toBeGreaterThan(1);
      });
    });

    test('image descriptions should effectively match available backgrounds', () => {
      const allBackgroundMatches = stories.flatMap(story =>
        story.pages.map(page => {
          const selectedBg = findBestBackground(page.imageDescription);
          const score = evaluateBackgroundMatch(page.imageDescription, selectedBg);
          return {
            story: story.title,
            page: page.pageNumber,
            description: page.imageDescription,
            selectedBackground: selectedBg.name,
            score,
            settings: selectedBg.settings,
            timeOfDay: selectedBg.timeOfDay
          };
        })
      );

      // Save background matching analysis
      fs.writeFile(
        path.join(OUTPUT_DIR, 'background_matching_analysis.json'),
        JSON.stringify(allBackgroundMatches, null, 2)
      );

      // Log summary
      console.log('Background matching summary:', {
        totalMatches: allBackgroundMatches.length,
        averageScore: allBackgroundMatches.reduce((sum, m) => sum + m.score, 0) / allBackgroundMatches.length,
        backgroundDistribution: allBackgroundMatches.reduce((dist, m) => {
          dist[m.selectedBackground] = (dist[m.selectedBackground] || 0) + 1;
          return dist;
        }, {} as Record<string, number>)
      });

      // Verify background appropriateness
      allBackgroundMatches.forEach(match => {
        expect(match.score).toBeGreaterThan(0);
      });
    });
  });

  describe('Story Quality Analysis', () => {
    test('should maintain consistent character portrayal', () => {
      stories.forEach(story => {
        const characterAnalysis = analyzeCharacterConsistency(story);
        console.log('Character consistency analysis:', characterAnalysis);
        
        expect(characterAnalysis.maddiePresence).toBe(1); // Should be in every page
        if (story.pages[0].text.includes('Tom')) {
          expect(characterAnalysis.sidekickPresence).toBeGreaterThan(0.5); // Should appear in most pages
        }
      });
    });

    test('should use age-appropriate language', () => {
      stories.forEach(story => {
        const vocabularyAnalysis = analyzeVocabulary(story);
        console.log('Vocabulary analysis:', vocabularyAnalysis);
        
        expect(vocabularyAnalysis.complexWords.length).toBeLessThan(3);
        expect(vocabularyAnalysis.averageWordLength).toBeLessThan(6);
      });
    });

    test('should include emotional elements and character development', () => {
      stories.forEach(story => {
        const emotionalContent = analyzeEmotionalContent(story);
        console.log('Emotional content analysis:', emotionalContent);
        
        expect(emotionalContent.emotionsFound.length).toBeGreaterThan(2);
        expect(emotionalContent.emotionalProgression).toBeTruthy();
      });
    });
  });
});

// Analysis helper functions

function analyzeCharacterConsistency(story: Story) {
  const pages = story.pages;
  const maddiePresence = pages.filter(p => 
    p.text.toLowerCase().includes('maddie') || 
    p.imageDescription.toLowerCase().includes('maddie')
  ).length / pages.length;
  
  const sidekickPresence = pages.filter(p => 
    p.text.toLowerCase().includes('tom') || 
    p.imageDescription.toLowerCase().includes('tom')
  ).length / pages.length;
  
  return {
    maddiePresence,
    sidekickPresence,
    consistentCharacterization: true // Add more sophisticated analysis here
  };
}

function analyzeVocabulary(story: Story) {
  const words = story.pages
    .flatMap(p => p.text.toLowerCase().split(/\W+/))
    .filter(w => w.length > 0);
  
  const complexWords = words.filter(w => 
    w.length > 8 || 
    isComplexWord(w)
  );
  
  return {
    totalWords: words.length,
    uniqueWords: new Set(words).size,
    averageWordLength: words.reduce((sum, w) => sum + w.length, 0) / words.length,
    complexWords
  };
}

function analyzeEmotionalContent(story: Story) {
  const emotions = [
    'happy', 'excited', 'curious', 'brave', 'proud',
    'surprised', 'worried', 'determined', 'joyful', 'amazed'
  ];
  
  const emotionsFound = emotions.filter(emotion => 
    story.pages.some(page => 
      page.text.toLowerCase().includes(emotion) || 
      page.imageDescription.toLowerCase().includes(emotion)
    )
  );
  
  // Check if emotions progress through the story
  const emotionalProgression = story.pages.every((page, index) => {
    if (index === 0) return true;
    return hasEmotionalDevelopment(story.pages[index - 1], page);
  });
  
  return {
    emotionsFound,
    emotionalProgression,
    emotionsPerPage: story.pages.map(page => 
      emotions.filter(e => 
        page.text.toLowerCase().includes(e) || 
        page.imageDescription.toLowerCase().includes(e)
      )
    )
  };
}

function isComplexWord(word: string): boolean {
  const complexWords = new Set([
    'magnificent', 'extraordinary', 'tremendous', 'mysterious',
    'fascinating', 'remarkable', 'spectacular', 'astonishing'
  ]);
  return complexWords.has(word);
}

function hasEmotionalDevelopment(prevPage: Story['pages'][0], currentPage: Story['pages'][0]): boolean {
  // Simple check for different emotional content between pages
  const emotions = [
    'happy', 'excited', 'curious', 'brave', 'proud',
    'surprised', 'worried', 'determined', 'joyful', 'amazed'
  ];
  
  const prevEmotions = emotions.filter(e => 
    prevPage.text.toLowerCase().includes(e) || 
    prevPage.imageDescription.toLowerCase().includes(e)
  );
  
  const currentEmotions = emotions.filter(e => 
    currentPage.text.toLowerCase().includes(e) || 
    currentPage.imageDescription.toLowerCase().includes(e)
  );
  
  return new Set([...prevEmotions, ...currentEmotions]).size > prevEmotions.length;
}

// Scoring helper functions (from previous implementation)
function evaluatePoseMatch(description: string, pose: typeof CHARACTER_POSES[0]): number {
  let score = 0;
  const desc = description.toLowerCase();

  pose.emotions.forEach(emotion => {
    if (desc.includes(emotion.toLowerCase())) score += 2;
  });

  pose.actions.forEach(action => {
    if (desc.includes(action.toLowerCase())) score += 2;
  });

  return score;
}

function evaluateBackgroundMatch(description: string, background: typeof BACKGROUNDS[0]): number {
  let score = 0;
  const desc = description.toLowerCase();

  background.settings.forEach(setting => {
    if (desc.includes(setting.toLowerCase())) score += 2;
  });

  background.timeOfDay.forEach(time => {
    if (desc.includes(time.toLowerCase())) score += 1;
  });

  return score;
} 