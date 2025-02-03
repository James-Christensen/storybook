Help me design a project build order and plan based on the below overviews. I would like to hand a copy to my developers so they can get to work. 

# Technical Overview for Asset-Based Story Generation Implementation

## 1. System Architecture

### Frontend
- Next.js 15.1.4 application with TypeScript
- Tailwind CSS with DaisyUI for styling
- React 19.0.0
- Component-based architecture with shared UI elements
- No global state management (currently using React state/context)

### API Layer
- Next.js API routes for backend functionality
- Two main external integrations:
  1. Ollama endpoint for story text generation
  2. DrawThings HTTP API (Flux) for current image generation

### Data Flow
- Client-side form submission → API routes → External services
- No persistent database (all data handled in-memory)

## 2. Story Generation Pipeline

### Current Process Flow
1. User submits story parameters (character, sidekick, setting)
2. Story text generation:
   - Sends prompt to Ollama endpoint
   - Processes response into structured story format
   - Returns title and page content

3. Image generation (per page):
   - Enhances text descriptions for image prompts
   - Sends to DrawThings API
   - Handles special cases (e.g., Maddie character Lora)
   - Returns image URLs

4. Display handling:
   - Progressive loading of story text
   - Background image generation
   - Real-time UI updates as content generates

### Key Interfaces
- StoryRequest: Handles initial user input (character, sidekick, setting, page count)
- StoryPage: Structures individual page content (text, image description, image URL)
- Story: Top-level structure containing title and array of pages

## 4. Codebase Organization

### Project Structure
- API routes for story and image generation
- Separate models directory for type definitions
- Component-based architecture with clear separation of concerns
- ViewModel layer for business logic

### Key Components
- StoryForm: Handles user input and story generation requests
- StoryBook: Main display component for story content
- StoryDisplay: Renders story text and images
- LoadingOverlay: Manages loading states during generation

### ViewModel Layer
- storyViewModel.ts: Manages story generation logic and state
- Handles image generation and enhancement
- Coordinates between UI and API layers

### Type Definitions
- Located in models directory
- Defines core interfaces for story structure
- Handles type safety for API responses


# Asset-Based Story Generation - Product Overview

## Problem Statement
The current AI image generation approach, while flexible, has several limitations:
- Generation time is slow
- Results can be inconsistent
- Resource intensive
- Higher operational costs

## Solution
Introduce an asset-based illustration system that uses pre-made character poses and backgrounds, selected intelligently by the LLM to match the story narrative.

## Core Value Proposition
- Instant image composition
- Consistent character appearance
- Predictable visual style
- Lower computational requirements
- Faster story generation experience

## Primary Features

### 1. Asset-Based Story Mode
- Pre-defined character poses and background scenes
- LLM-driven asset selection based on story context
- Real-time image composition
- Consistent character representation across scenes

### 2. Story Generation Flow
1. User inputs story parameters (character, setting, etc.)
2. LLM generates story text with specific pose/background selections
3. System composes scenes using selected assets
4. Story displayed with instant image loading

### 3. Asset Management
- Curated set of character poses
- Collection of themed backgrounds
- Metadata system for context-aware selection
- Easy asset addition/management system

## MVP Scope

### Included
- Single main character
- Basic pose set (4-6 poses)
- Limited background collection (4-6 scenes)
- Simple composition system
- Mode toggle between AI and asset-based generation

### Not Included (Future Considerations)
- Multiple characters
- Advanced animations
- Custom pose creation
- User-uploaded assets
- Complex scene compositions

## Success Metrics
- Story generation time
- User satisfaction with visual consistency
- System reliability
- Resource utilization

## Technical Requirements
- Asset storage and delivery system
- Image composition engine
- Enhanced LLM prompt system
- Asset metadata management

## User Experience Goals
- Seamless mode switching
- Clear asset limitations
- Fast loading times
- Consistent visual quality