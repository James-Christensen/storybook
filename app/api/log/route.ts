import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { StoryGenerationLog } from '../../../utils/storyLogger';

function formatTimestamp(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(/,/g, '').replace(/\s+/g, '_');
}

export async function POST(request: Request) {
  try {
    const log: StoryGenerationLog = await request.json();
    
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs', 'stories');
    await fs.mkdir(logsDir, { recursive: true });

    // Create filename with readable timestamp and generation mode
    const timestamp = formatTimestamp(new Date());
    const mode = log.request.generationMode;
    const filename = `story_${mode}_${timestamp}.json`;
    
    // Write log to file with pretty formatting
    await fs.writeFile(
      path.join(logsDir, filename),
      JSON.stringify(log, null, 2),
      'utf-8'
    );

    console.log(`Story generation logged to: ${filename}`);
    return NextResponse.json({ success: true, filename });
    
  } catch (error) {
    console.error('Failed to log story generation:', error);
    return NextResponse.json(
      { error: 'Failed to log story generation' },
      { status: 500 }
    );
  }
} 