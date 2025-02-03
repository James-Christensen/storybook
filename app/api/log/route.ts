import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { StoryGenerationLog } from '../../../utils/storyLogger';

function formatTimestamp(date: Date): string {
  // First log the raw date for debugging
  console.log('Formatting timestamp for date:', date);
  
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(/,/g, '').replace(/\s+/g, '_');
  
  // Log the formatted result
  console.log('Formatted timestamp:', formatted);
  return formatted;
}

export async function POST(request: Request) {
  try {
    const log: StoryGenerationLog = await request.json();
    
    // Debug: Log the current working directory
    const cwd = process.cwd();
    console.log('Current working directory:', cwd);
    
    // Create logs directory if it doesn't exist
    const logsDir = path.join(cwd, 'logs', 'stories');
    console.log('Logs directory path:', logsDir);
    
    // Create filename with readable timestamp and generation mode
    const now = new Date();
    console.log('Current time:', now);
    const timestamp = formatTimestamp(now);
    const mode = log.request.generationMode;
    const filename = `story_${mode}_${timestamp}.json`;
    const fullPath = path.join(logsDir, filename);
    
    console.log('Attempting to write to:', fullPath);
    
    // Verify directory exists before writing
    const dirExists = await fs.access(logsDir).then(() => true).catch(() => false);
    console.log('Logs directory exists:', dirExists);
    
    if (!dirExists) {
      console.log('Creating logs directory...');
      await fs.mkdir(logsDir, { recursive: true });
    }

    // Write log to file with pretty formatting
    await fs.writeFile(
      fullPath,
      JSON.stringify(log, null, 2),
      'utf-8'
    );
    
    console.log('Successfully wrote log file');
    return NextResponse.json({ success: true, filename });
    
  } catch (error) {
    console.error('Failed to log story generation:', error);
    console.error('Error details:', error instanceof Error ? error.stack : String(error));
    return NextResponse.json(
      { error: 'Failed to log story generation', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 