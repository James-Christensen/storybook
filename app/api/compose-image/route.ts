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

interface CharacterMetadata {
  selected: {
    id: string;
    name: string;
    description: string;
    emotions: string[];
    actions: string[];
  };
  matchDetails: {
    score: number;
    matchedEmotions: string[];
    matchedActions: string[];
  };
}

interface CharacterDimensions {
  width: number;
  height: number;
  position: {
    left: number;
    top: number;
  };
}

interface ImageMetadata {
  maddie: CharacterMetadata;
  tom?: CharacterMetadata;
  background: {
    selected: {
      id: string;
      name: string;
      description: string;
      settings: string[];
      timeOfDay: string[];
    };
    matchDetails: {
      score: number;
      matchedSettings: string[];
      contextualMatches: string[];
    };
  };
  dimensions: {
    width: number;
    height: number;
    characters: {
      maddie: CharacterDimensions;
      tom?: CharacterDimensions;
    };
  };
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const { description, pageNumber, storyId } = await request.json();
    console.log('\n=== Starting Image Composition ===');
    console.log('Processing scene description:', description);
    
    // Check if Tom is mentioned in the description
    const hasTom = description.toLowerCase().includes('tom');
    
    // Find the best matching poses and background
    const maddiePoseMatch = findBestPose(description, 'maddie');
    const tomPoseMatch = hasTom ? findBestPose(description, 'tom') : null;
    const backgroundMatch = findBestBackground(description);
    
    console.log('\n=== Asset Selection Summary ===');
    console.log('Selected Maddie pose:', {
      id: maddiePoseMatch.pose.id,
      name: maddiePoseMatch.pose.name,
      score: maddiePoseMatch.score
    });
    
    if (tomPoseMatch) {
      console.log('Selected Tom pose:', {
        id: tomPoseMatch.pose.id,
        name: tomPoseMatch.pose.name,
        score: tomPoseMatch.score
      });
    }
    
    console.log('Selected background:', {
      id: backgroundMatch.background.id,
      name: backgroundMatch.background.name,
      score: backgroundMatch.score
    });
    
    try {
      // Get the absolute paths for the images
      const workspacePath = process.cwd();
      
      // Select a random background variation from v2 if available, otherwise fallback to v1
      const bgVariations = backgroundMatch.background.variations.v2?.[Object.keys(backgroundMatch.background.variations.v2)[0]] || 
                          backgroundMatch.background.variations.v1?.map(path => ({ path })) || [];
      const selectedBgVariation = bgVariations[Math.floor(Math.random() * bgVariations.length)].path;
      
      const bgPath = path.join(workspacePath, 'public', selectedBgVariation);
      const maddiePosePath = path.join(workspacePath, 'public', maddiePoseMatch.selectedVariation);
      const tomPosePath = tomPoseMatch ? path.join(workspacePath, 'public', tomPoseMatch.selectedVariation) : null;

      console.log('\n=== Image Processing ===');
      console.log('Loading images from:', {
        background: bgPath,
        maddie: maddiePosePath,
        tom: tomPosePath
      });

      // Load the background image
      const bgImage = sharp(bgPath);
      const bgMetadata = await bgImage.metadata();
      
      if (!bgMetadata.width || !bgMetadata.height) {
        throw new Error('Invalid background image metadata');
      }

      // Load and process Maddie's pose
      const maddieImage = sharp(maddiePosePath);
      const maddieMetadata = await maddieImage.metadata();
      
      if (!maddieMetadata.width || !maddieMetadata.height) {
        throw new Error('Invalid Maddie pose image metadata');
      }

      // Calculate Maddie's size - she should be 70% of background height
      const maddieTargetHeight = Math.round(bgMetadata.height * 0.7);
      const maddieScale = maddieTargetHeight / maddieMetadata.height;
      const maddieWidth = Math.round(maddieMetadata.width * maddieScale);

      // If Tom is present, load and process his image
      let tomImage, tomWidth, tomHeight, tomScale;
      if (tomPosePath) {
        tomImage = sharp(tomPosePath);
        const tomMetadata = await tomImage.metadata();
        if (!tomMetadata.width || !tomMetadata.height) {
          throw new Error('Invalid Tom pose image metadata');
        }

        // Tom should be about 50% of Maddie's height
        tomHeight = Math.round(maddieTargetHeight * 0.5);
        tomScale = tomHeight / tomMetadata.height;
        tomWidth = Math.round(tomMetadata.width * tomScale);
      }

      // Calculate horizontal positions
      const totalWidth = tomPosePath ? (maddieWidth + tomWidth! + 30) : maddieWidth; // 30px gap between characters
      const startX = Math.round((bgMetadata.width - totalWidth) / 2);
      const maddieLeft = tomPosePath ? startX : Math.round((bgMetadata.width - maddieWidth) / 2);
      const tomLeft = tomPosePath ? (maddieLeft + maddieWidth + 30) : 0;

      // Calculate vertical positions - anchor to bottom with padding
      const bottomPadding = Math.round(bgMetadata.height * 0.05); // 5% padding from bottom
      const maddieTop = bgMetadata.height - maddieTargetHeight - bottomPadding;
      const tomTop = bgMetadata.height - tomHeight! - bottomPadding;

      // Resize Maddie's image
      const resizedMaddie = await maddieImage
        .resize(maddieWidth, maddieTargetHeight, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer();

      // Prepare composite array
      const compositeArray = [{
        input: resizedMaddie,
        top: maddieTop,
        left: maddieLeft
      }];

      // If Tom is present, add him to the composition
      if (tomPosePath && tomImage) {
        const resizedTom = await tomImage
          .resize(tomWidth, tomHeight, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toBuffer();

        compositeArray.push({
          input: resizedTom,
          top: tomTop,
          left: tomLeft
        });
      }

      // Composite the images
      const result = await bgImage
        .composite(compositeArray)
        .jpeg({ quality: 90 })
        .toBuffer();
      
      // Convert to base64 for response
      const base64Image = result.toString('base64');
      console.log('Successfully composed image');

      // Prepare response metadata
      const metadata: ImageMetadata = {
        maddie: {
          selected: {
            id: maddiePoseMatch.pose.id,
            name: maddiePoseMatch.pose.name,
            description: maddiePoseMatch.pose.description,
            emotions: maddiePoseMatch.pose.emotions,
            actions: maddiePoseMatch.pose.actions
          },
          matchDetails: {
            score: maddiePoseMatch.score,
            matchedEmotions: maddiePoseMatch.matches.emotions,
            matchedActions: maddiePoseMatch.matches.actions
          }
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
          }
        },
        dimensions: {
          width: bgMetadata.width,
          height: bgMetadata.height,
          characters: {
            maddie: {
              width: maddieWidth,
              height: maddieTargetHeight,
              position: { left: maddieLeft, top: maddieTop }
            }
          }
        }
      };

      // Add Tom's metadata if present
      if (tomPoseMatch) {
        metadata.dimensions.characters.tom = {
          width: tomWidth!,
          height: tomHeight!,
          position: { left: tomLeft, top: tomTop }
        };
        metadata.tom = {
          selected: {
            id: tomPoseMatch.pose.id,
            name: tomPoseMatch.pose.name,
            description: tomPoseMatch.pose.description,
            emotions: tomPoseMatch.pose.emotions,
            actions: tomPoseMatch.pose.actions
          },
          matchDetails: {
            score: tomPoseMatch.score,
            matchedEmotions: tomPoseMatch.matches.emotions,
            matchedActions: tomPoseMatch.matches.actions
          }
        };
      }

      return NextResponse.json({
        success: true,
        imageData: `data:image/jpeg;base64,${base64Image}`,
        metadata
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