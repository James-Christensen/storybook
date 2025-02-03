import { NextResponse } from 'next/server';
import { findBestPose, findBestBackground } from '../../../models/assets';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const { description } = await request.json();
    
    // Find the best matching pose and background based on the description
    const pose = findBestPose(description);
    const background = findBestBackground(description);
    
    try {
      // Load the background image
      const bgImage = await sharp(background.imageUrl);
      const bgMetadata = await bgImage.metadata();
      
      // Load and resize the character pose to fit the scene
      const poseImage = await sharp(pose.imageUrl)
        .resize({
          width: Math.floor(bgMetadata.width! * 0.4), // Character takes up ~40% of the width
          height: Math.floor(bgMetadata.height! * 0.8), // Character takes up ~80% of the height
          fit: 'inside',
          withoutEnlargement: true
        });
      
      // Composite the images
      const result = await bgImage
        .composite([
          {
            input: await poseImage.toBuffer(),
            gravity: 'center' // Place character in center for MVP
          }
        ])
        .jpeg()
        .toBuffer();
      
      // Convert to base64 for response
      const base64Image = result.toString('base64');
      
      return NextResponse.json({
        success: true,
        imageData: `data:image/jpeg;base64,${base64Image}`,
        metadata: {
          pose: pose.id,
          background: background.id
        }
      });
      
    } catch (imageError) {
      console.error('Image processing error:', imageError);
      return NextResponse.json(
        { error: 'Failed to process images' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Image composition error:', error);
    return NextResponse.json(
      { error: 'Failed to compose image' },
      { status: 500 }
    );
  }
} 