import { NextResponse } from 'next/server';
import { findBestPose, findBestBackground } from '../../../models/assets';
import sharp from 'sharp';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { description } = await request.json();
    console.log('\n=== Starting Image Composition ===');
    console.log('Processing scene description:', description);
    
    // Find the best matching pose and background based on the description
    const pose = findBestPose(description);
    const background = findBestBackground(description);
    
    console.log('\n=== Asset Selection Summary ===');
    console.log('Selected pose:', {
      id: pose.id,
      name: pose.name,
      description: pose.description
    });
    console.log('Selected background:', {
      id: background.id,
      name: background.name,
      description: background.description
    });
    
    try {
      // Get the absolute paths for the images
      const workspacePath = process.cwd();
      const bgPath = path.join(workspacePath, 'public', background.imageUrl);
      const posePath = path.join(workspacePath, 'public', pose.imageUrl);

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
      
      return NextResponse.json({
        success: true,
        imageData: `data:image/jpeg;base64,${base64Image}`,
        metadata: {
          pose: pose.id,
          background: background.id,
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