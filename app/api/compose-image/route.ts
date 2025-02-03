import { NextResponse } from 'next/server';
import { findBestPose, findBestBackground, CHARACTER_POSES, BACKGROUNDS, CharacterPose, Background } from '../../../models/assets';
import sharp from 'sharp';
import path from 'path';
import { storyLogger } from '../../../utils/storyLogger';

// Add interfaces for type safety
interface PoseMatch {
  id: string;
  name: string;
  score: number;
  matchedEmotions: string[];
  matchedActions: string[];
}

interface BackgroundMatch {
  id: string;
  name: string;
  score: number;
  matchedSettings: string[];
  contextualMatches: string[];
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const { description, pageNumber, storyId } = await request.json();
    console.log('\n=== Starting Image Composition ===');
    console.log('Processing scene description:', description);
    
    // Find the best matching pose and background based on the description
    const poseMatch = findBestPose(description);
    const backgroundMatch = findBestBackground(description);
    
    console.log('\n=== Asset Selection Summary ===');
    console.log('Selected pose:', {
      id: poseMatch.pose.id,
      name: poseMatch.pose.name,
      description: poseMatch.pose.description,
      emotions: poseMatch.pose.emotions,
      actions: poseMatch.pose.actions
    });
    console.log('Selected background:', {
      id: backgroundMatch.background.id,
      name: backgroundMatch.background.name,
      description: backgroundMatch.background.description,
      settings: backgroundMatch.background.settings,
      timeOfDay: backgroundMatch.background.timeOfDay
    });
    
    try {
      // Get the absolute paths for the images
      const workspacePath = process.cwd();
      const bgPath = path.join(workspacePath, 'public', backgroundMatch.background.imageUrl);
      const posePath = path.join(workspacePath, 'public', poseMatch.pose.imageUrl);

      console.log('\n=== Image Processing ===');
      console.log('Loading images from:', {
        background: bgPath,
        pose: posePath
      });

      // Load the background image
      const bgImage = sharp(bgPath);
      const bgMetadata = await bgImage.metadata();
      
      if (!bgMetadata.width || !bgMetadata.height) {
        throw new Error('Invalid background image metadata');
      }

      console.log('Background dimensions:', {
        width: bgMetadata.width,
        height: bgMetadata.height,
        format: bgMetadata.format
      });

      // Load and process the character pose
      const poseImage = sharp(posePath);
      const poseMetadata = await poseImage.metadata();
      
      if (!poseMetadata.width || !poseMetadata.height) {
        throw new Error('Invalid pose image metadata');
      }

      console.log('Original pose dimensions:', {
        width: poseMetadata.width,
        height: poseMetadata.height,
        format: poseMetadata.format
      });

      // Calculate the target size for the character
      // Make character height 70% of background height
      const targetHeight = Math.round(bgMetadata.height * 0.7);
      const scale = targetHeight / poseMetadata.height;
      const targetWidth = Math.round(poseMetadata.width * scale);

      console.log('Calculated character dimensions:', {
        targetWidth,
        targetHeight,
        scale
      });

      // Resize the character pose
      const resizedPose = await poseImage
        .resize(targetWidth, targetHeight, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer();

      // Calculate position for the character
      // Place character in the center-bottom of the scene
      const left = Math.round((bgMetadata.width - targetWidth) / 2);
      const top = Math.round(bgMetadata.height - targetHeight - (bgMetadata.height * 0.1)); // 10% padding from bottom

      console.log('Character placement:', {
        left,
        top,
        bottomPadding: Math.round(bgMetadata.height * 0.1)
      });

      // Composite the images with high quality settings
      console.log('\n=== Compositing Images ===');
      const result = await bgImage
        .composite([
          {
            input: resizedPose,
            top: top,
            left: left
          }
        ])
        .jpeg({ quality: 90 })
        .toBuffer();
      
      // Convert to base64 for response
      const base64Image = result.toString('base64');
      console.log('Successfully composed image');
      
      // Get all considered poses and backgrounds with their scores
      const allPoseMatches = CHARACTER_POSES.map((pose: CharacterPose) => {
        const matches = {
          emotions: [] as string[],
          actions: [] as string[]
        };
        let score = 0;
        
        pose.emotions.forEach((emotion: string) => {
          if (description.toLowerCase().includes(emotion)) {
            score += 2;
            matches.emotions.push(emotion);
          }
        });
        
        pose.actions.forEach((action: string) => {
          if (description.toLowerCase().includes(action)) {
            score += 2;
            matches.actions.push(action);
          }
        });

        return {
          id: pose.id,
          name: pose.name,
          score,
          matchedEmotions: matches.emotions,
          matchedActions: matches.actions
        } as PoseMatch;
      });

      const allBackgroundMatches = BACKGROUNDS.map((bg: Background) => {
        const matches = {
          settings: [] as string[],
          context: [] as string[]
        };
        let score = 0;

        bg.settings.forEach((setting: string) => {
          if (description.toLowerCase().includes(setting)) {
            score += 2;
            matches.settings.push(setting);
          }
        });

        // Add contextual scoring
        const contextualMatches = [
          { terms: ['sleep', 'waking up', 'bedroom'], setting: 'bedroom' },
          { terms: ['sand', 'wave', 'ocean', 'beach'], setting: 'beach' },
          { terms: ['tree', 'nature', 'woods', 'forest'], setting: 'forest' },
          { terms: ['playground', 'swing', 'slide', 'park'], setting: 'park' }
        ];

        contextualMatches.forEach(({ terms, setting }) => {
          if (bg.id === setting && terms.some(term => description.toLowerCase().includes(term))) {
            score += 3;
            matches.context.push(...terms.filter(term => description.toLowerCase().includes(term)));
          }
        });

        return {
          id: bg.id,
          name: bg.name,
          score,
          matchedSettings: matches.settings,
          contextualMatches: matches.context
        } as BackgroundMatch;
      });

      return NextResponse.json({
        success: true,
        imageData: `data:image/jpeg;base64,${base64Image}`,
        metadata: {
          pose: {
            selected: {
              id: poseMatch.pose.id,
              name: poseMatch.pose.name,
              description: poseMatch.pose.description,
              emotions: poseMatch.pose.emotions,
              actions: poseMatch.pose.actions
            },
            matchDetails: {
              score: poseMatch.score,
              matchedEmotions: poseMatch.matches.emotions,
              matchedActions: poseMatch.matches.actions
            },
            alternativesConsidered: allPoseMatches
          },
          background: {
            selected: {
              id: backgroundMatch.background.id,
              name: backgroundMatch.background.name,
              description: backgroundMatch.background.description,
              settings: backgroundMatch.background.settings,
              timeOfDay: backgroundMatch.background.timeOfDay
            },
            matchDetails: {
              score: backgroundMatch.score,
              matchedSettings: backgroundMatch.matches.settings,
              contextualMatches: backgroundMatch.matches.context
            },
            alternativesConsidered: allBackgroundMatches
          },
          dimensions: {
            width: bgMetadata.width,
            height: bgMetadata.height
          },
          character: {
            width: targetWidth,
            height: targetHeight,
            position: { left, top }
          }
        }
      });
      
    } catch (imageError) {
      console.error('\n=== Image Processing Error ===');
      console.error('Error details:', imageError);
      return NextResponse.json(
        { error: 'Failed to process images' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('\n=== Image Composition Error ===');
    console.error('Error details:', error);
    return NextResponse.json(
      { error: 'Failed to compose image' },
      { status: 500 }
    );
  }
} 