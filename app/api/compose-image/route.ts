import { NextResponse } from 'next/server';
import { findBestPose, findBestBackground, CHARACTER_POSES, BACKGROUNDS, CharacterPose, Background, VariationContext } from '../../../models/assets';
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

// Add new interfaces for interaction handling
interface InteractionType {
  type: 'playing' | 'exploring' | 'talking' | 'resting' | 'none';
  proximity: 'close' | 'medium' | 'far';
  facing: 'same-direction' | 'towards-each-other' | 'away' | 'independent';
  position: 'center' | 'left' | 'right';  // New: Overall position in scene
  arrangement: 'side-by-side' | 'diagonal' | 'staggered';  // New: How characters are arranged
}

function analyzeInteraction(description: string): InteractionType {
  const desc = description.toLowerCase();
  
  // Default interaction - characters positioned independently
  let interaction: InteractionType = {
    type: 'none',
    proximity: 'far',
    facing: 'independent',
    position: 'center',
    arrangement: 'side-by-side'
  };

  // Analyze for playing interactions - grouped, dynamic positioning
  if (desc.includes('play') || desc.includes('chase') || desc.includes('game')) {
    interaction.type = 'playing';
    interaction.proximity = 'close';
    interaction.facing = 'towards-each-other';
    interaction.arrangement = 'diagonal';
    // Position based on context clues
    interaction.position = desc.includes('left') ? 'left' : 
                         desc.includes('right') ? 'right' : 
                         Math.random() > 0.5 ? 'left' : 'right';
  }
  // Analyze for exploring interactions - can be grouped or separate
  else if (desc.includes('explor') || desc.includes('discover') || desc.includes('walk') || desc.includes('adventure')) {
    interaction.type = 'exploring';
    interaction.proximity = 'medium';
    interaction.facing = 'same-direction';
    interaction.arrangement = desc.includes('together') ? 'side-by-side' : 'staggered';
    // Position based on direction of exploration
    interaction.position = desc.includes('left') ? 'left' : 
                         desc.includes('right') ? 'right' : 
                         desc.includes('towards') ? 'right' : 'left';
  }
  // Analyze for talking/social interactions - always grouped
  else if (desc.includes('talk') || desc.includes('chat') || desc.includes('discuss') || desc.includes('tell')) {
    interaction.type = 'talking';
    interaction.proximity = 'close';
    interaction.facing = 'towards-each-other';
    interaction.arrangement = 'side-by-side';
    // Position based on scene context
    interaction.position = desc.includes('bed') ? 'right' :
                         desc.includes('window') ? 'left' :
                         desc.includes('door') ? 'right' : 'left';
  }
  // Analyze for resting interactions - grouped but relaxed
  else if (desc.includes('rest') || desc.includes('sleep') || desc.includes('sit') || desc.includes('relax')) {
    interaction.type = 'resting';
    interaction.proximity = 'close';
    interaction.facing = 'same-direction';
    interaction.arrangement = 'side-by-side';
    // Position near furniture or features
    interaction.position = desc.includes('bed') ? 'right' :
                         desc.includes('couch') ? 'left' :
                         desc.includes('chair') ? 'right' : 'left';
  }

  return interaction;
}

function calculateCharacterPositions(
  bgWidth: number,
  bgHeight: number,
  maddieWidth: number,
  maddieHeight: number,
  tomWidth: number | undefined,
  tomHeight: number | undefined,
  interaction: InteractionType
): { maddie: CharacterDimensions; tom?: CharacterDimensions } {
  // Ensure all inputs are integers
  bgWidth = Math.round(bgWidth);
  bgHeight = Math.round(bgHeight);
  maddieWidth = Math.round(maddieWidth);
  maddieHeight = Math.round(maddieHeight);
  
  const bottomPadding = Math.round(bgHeight * 0.05);
  const sidePadding = Math.round(bgWidth * 0.1);
  
  // Calculate spacing based on interaction type
  const proximitySpacing = {
    close: Math.round(maddieWidth * 0.2),
    medium: Math.round(maddieWidth * 0.4),
    far: Math.round(maddieWidth * 0.8)
  };

  const spacing = proximitySpacing[interaction.proximity];
  
  // Helper function to ensure position is within bounds
  const ensureValidPosition = (left: number, width: number): number => {
    return Math.round(Math.max(sidePadding, Math.min(bgWidth - width - sidePadding, left)));
  };

  // If Tom isn't present, position Maddie based on scene context
  if (!tomWidth || !tomHeight) {
    let maddieLeft: number;
    
    switch (interaction.position) {
      case 'left':
        maddieLeft = sidePadding;
        break;
      case 'right':
        maddieLeft = bgWidth - maddieWidth - sidePadding;
        break;
      default: // center
        maddieLeft = Math.round((bgWidth - maddieWidth) / 2);
    }

    maddieLeft = ensureValidPosition(maddieLeft, maddieWidth);
    
    return {
      maddie: {
        width: maddieWidth,
        height: maddieHeight,
        position: {
          left: maddieLeft,
          top: Math.round(bgHeight - maddieHeight - bottomPadding)
        }
      }
    };
  }

  // Ensure Tom's dimensions are integers
  tomWidth = Math.round(tomWidth);
  tomHeight = Math.round(tomHeight);

  // Determine if characters should be grouped
  const shouldGroup = ['playing', 'talking'].includes(interaction.type) || 
                     (interaction.type === 'exploring' && interaction.arrangement === 'side-by-side') ||
                     (interaction.type === 'resting' && interaction.proximity === 'close');

  let maddieLeft: number;
  let tomLeft: number;

  if (shouldGroup) {
    // Calculate group width
    const groupWidth = maddieWidth + tomWidth + spacing;
    
    // Calculate group position
    switch (interaction.position) {
      case 'left':
        maddieLeft = sidePadding;
        break;
      case 'right':
        maddieLeft = bgWidth - groupWidth - sidePadding;
        break;
      default: // center
        maddieLeft = Math.round((bgWidth - groupWidth) / 2);
    }

    // Ensure Maddie's position is valid
    maddieLeft = ensureValidPosition(maddieLeft, maddieWidth);
    
    // Calculate Tom's base position
    tomLeft = maddieLeft + maddieWidth + spacing;
    
    // Create position objects
    const maddiePosition: CharacterDimensions = {
      width: maddieWidth,
      height: maddieHeight,
      position: {
        left: maddieLeft,
        top: Math.round(bgHeight - maddieHeight - bottomPadding)
      }
    };

    const tomPosition: CharacterDimensions = {
      width: tomWidth,
      height: tomHeight,
      position: {
        left: tomLeft,
        top: Math.round(bgHeight - tomHeight - bottomPadding)
      }
    };

    // Apply arrangement-specific adjustments
    if (interaction.arrangement === 'diagonal') {
      tomPosition.position.top = Math.round(tomPosition.position.top + (maddieHeight * 0.1));
    } else if (interaction.arrangement === 'staggered') {
      const depthScale = 0.95;
      tomPosition.width = Math.round(tomWidth * depthScale);
      tomPosition.height = Math.round(tomHeight * depthScale);
      tomPosition.position.left = Math.round(maddiePosition.position.left + (maddieWidth * 0.7));
    }

    // Final boundary check for Tom
    tomPosition.position.left = ensureValidPosition(tomPosition.position.left, tomPosition.width);

    return { maddie: maddiePosition, tom: tomPosition };

  } else {
    // Position characters independently
    switch (interaction.position) {
      case 'left':
        maddieLeft = sidePadding;
        tomLeft = bgWidth - tomWidth - sidePadding;
        break;
      case 'right':
        maddieLeft = bgWidth - maddieWidth - sidePadding;
        tomLeft = sidePadding;
        break;
      default: // center
        maddieLeft = Math.round(bgWidth * 0.25 - maddieWidth / 2);
        tomLeft = Math.round(bgWidth * 0.75 - tomWidth / 2);
    }

    // Ensure positions are valid
    maddieLeft = ensureValidPosition(maddieLeft, maddieWidth);
    tomLeft = ensureValidPosition(tomLeft, tomWidth);

    return {
      maddie: {
        width: maddieWidth,
        height: maddieHeight,
        position: {
          left: maddieLeft,
          top: Math.round(bgHeight - maddieHeight - bottomPadding)
        }
      },
      tom: {
        width: tomWidth,
        height: tomHeight,
        position: {
          left: tomLeft,
          top: Math.round(bgHeight - tomHeight - bottomPadding)
        }
      }
    };
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const { description, pageNumber, totalPages, storyId } = await request.json();
    console.log('\n=== Starting Image Composition ===');
    console.log('Processing scene description:', description);
    
    // Check if Tom is mentioned in the description
    const hasTom = description.toLowerCase().includes('tom');

    // Determine time of day from description
    const timeOfDay = description.toLowerCase().includes('night') ? 'night' :
                     description.toLowerCase().includes('sunset') ? 'sunset' :
                     description.toLowerCase().includes('morning') ? 'morning' : 'day';

    // Determine story beat based on page position
    const progress = pageNumber / totalPages;
    const storyBeat = progress <= 0.2 ? 'introduction' as const :
                     progress >= 0.8 ? 'resolution' as const :
                     progress >= 0.6 ? 'climax' as const : 
                     'action' as const;

    // Create context for pose selection
    const context: VariationContext = {
      timeOfDay,
      pageNumber,
      totalPages,
      isWithTom: hasTom,
      sceneType: storyBeat,
      previousPose: undefined // Could be stored and passed from previous page
    };
    
    // Find the best matching poses and background
    const maddiePoseMatch = findBestPose(description, 'maddie', context);
    const tomPoseMatch = hasTom ? findBestPose(description, 'tom', context) : null;
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

      // Analyze the interaction from the scene description
      const interaction = analyzeInteraction(description);
      console.log('\n=== Interaction Analysis ===');
      console.log('Detected interaction:', interaction);

      // Calculate character positions based on interaction
      const characterPositions = calculateCharacterPositions(
        bgMetadata.width,
        bgMetadata.height,
        maddieWidth,
        maddieTargetHeight,
        tomWidth,
        tomHeight,
        interaction
      );

      // Resize Maddie's image
      const resizedMaddie = await maddieImage
        .resize(maddieWidth, maddieTargetHeight, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer();

      // Update composite array with new positions
      const compositeArray = [{
        input: resizedMaddie,
        top: characterPositions.maddie.position.top,
        left: characterPositions.maddie.position.left
      }];

      if (tomPosePath && tomImage && characterPositions.tom) {
        const resizedTom = await tomImage
          .resize(characterPositions.tom.width, characterPositions.tom.height, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toBuffer();

        compositeArray.push({
          input: resizedTom,
          top: characterPositions.tom.position.top,
          left: characterPositions.tom.position.left
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
            maddie: characterPositions.maddie
          }
        }
      };

      // Add Tom's metadata if present
      if (characterPositions.tom && tomPoseMatch !== null) {
        metadata.dimensions.characters.tom = characterPositions.tom;
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