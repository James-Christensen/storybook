# Storybook Implementation Instructions
## Rules
Always include debugging and good console.log statements
Build in small steps and focus on simplicity

## 1. Project Overview

### 1.1 Purpose
Storybook is a web application allowing users to create short illustrated stories for children. Users can:
- Select a main character and customize their description
- Choose a pet sidekick
- Choose a story setting
- Generate text via a local Large Language Model (LLM) (powered by Ollama)
- Generate accompanying illustrations via a DrawThings HTTP API using Flux Models

### 1.2 Objectives
Provide a simple, child-friendly user interface in React and Next.js for creating illustrated stories. Leverage local AI models to ensure offline or private on-device generation when possible. Ensure the design is maintainable and easily extendable.

### 1.3 Key Users
- Children interested in creating and reading short stories
- Parents guiding children in interactive storytelling

### 1.4 Technical Overview
- Web application using Next.js, React, and Tailwind CSS
- Text generation with Ollama (local LLM)
- Image generation with the DrawThings HTTP API and Flux Models

## 2. Features

### 2.1 Character Selection
- Users select between presets for main characters and customize their descriptions

### 2.2 Pet Sidekick Selection
- Users choose from predefined pet options (e.g., dog, cat, rabbit)

### 2.3 Setting Selection
- Users select a story setting (e.g., Beach, Forest, City)

### 2.4 Story Generation (Text)
- Generate story text with user inputs sent to the Ollama endpoint

### 2.5 Illustration Generation
- Generate story illustrations for each segment via the DrawThings HTTP API

### 2.6 Story Display and Editing
- Display generated story text and illustrations side by side

### 2.7 Story Saving
- Save the final story locally in a structured format for offline access

## 3. Technical Requirements

### 3.1 Tech Stack
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: React state or context API
- **Data Models**: TypeScript interfaces for structured data handling
- **API Integration**: `axios` or `fetch` for HTTP requests

### 3.2 MVVM Architecture
- **Model**: TypeScript interfaces for Story, StoryRequest, and related data
- **ViewModel**: Functions for handling API calls and logic
- **View**: React components for input forms and displaying results

### 3.3 APIs

#### Ollama Endpoint
- URL: `http://localhost:11411/generate`
- Method: POST
- Input:
```json
{
  "prompt": "",
  "model": "",
  "format": "json",
  "stream": false
}
```
- Output: JSON with story paragraphs

#### DrawThings HTTP API
- URL: `http://localhost:5000/draw`
- Method: POST
- Input:
```json
{
  "prompt": "",
  "style": "cartoon",
  "size": "768x768"
}
```
- Output: Base64 or image URL

## 4. Implementation Details

### 4.1 Folder Structure
```
storybook/
├─ pages/
│  ├─ index.tsx
├─ components/
│  ├─ StoryForm.tsx
│  ├─ StoryDisplay.tsx
├─ models/
│  └─ story.ts
├─ viewmodels/
│  └─ storyViewModel.ts
├─ styles/
└─ ...
```

### 4.2 Story Data Models
```typescript
export interface StoryRequest {
  mainCharacter: string;
  sidekick: string;
  setting: string;
}

export interface Story {
  title: string;
  paragraphs: string[];
  images: string[];
}
```

### 4.3 ViewModel Functions
```typescript
async function generateStoryText(request: StoryRequest): Promise<string[]> {
  // Fetch paragraphs from Ollama.
  console.log("Generating Story")
}

async function generateImagesForStory(paragraphs: string[]): Promise<string[]> {
  // Fetch images from DrawThings.
  console.log("Generating Image")
}

async function createStory(request: StoryRequest): Promise<Story> {
  // Combine text and images into a Story object.
  console.log("Create Story")
}
```

## 5. Features and Flow

### 5.1 User Flow
1. **Landing Page**:
   - Input form for Main Character, Sidekick, and Setting
   - "Generate Story" button
2. **Story Generation**:
   - Fetch story text and illustrations sequentially
3. **Display**:
   - Display text and corresponding illustrations in a readable format

### 5.2 Error Handling
- Show loading spinners during requests
- Display error messages for failed API calls

### 5.3 Performance Considerations
- Optimize prompts for minimal latency
- Handle timeouts gracefully with retries

## 6. Additional Notes
- The initial MVP will focus on a single language and style for simplicity
- Future iterations may include enhanced localization and advanced image styles

## 7. Project Milestones

### Milestone 1: Basic Next.js Setup
- Create Next.js project with recommended folder structure
- Add basic placeholders for StoryForm and StoryDisplay components

### Milestone 2: MVVM + Basic Integration
- Implement storyViewModel.ts with mock or placeholder data for both text and image generation to confirm the end-to-end flow works
- Improve UI, create a modern React app that simulates reading a book. Once the users story is generated they should be abe to navigate from one page to another. Each page should be the entire view and contain an image, 2-3 sentences of story text, and a page number. 

### Milestone 3: API Integration
- Connect to the local Ollama endpoint for real text generation
- Connect to the local DrawThings endpoint for real image generation

### Milestone 4: Testing & Polish
- Add loading states, error handling, and minimal styling
- Confirm the final user experience is smooth and meets acceptance criteria


To do:
Image Lazy Loading
Can be implemented using Next.js's built-in Image component or react-lazy-load-image-component
Minimal code changes required
Immediate performance benefits
Loading States
Already have some loading states, just need to extend to other async operations
Mostly UI work with existing LoadingOverlay component
Straightforward state management
Swipe Gestures
Can be implemented using react-swipeable or similar library
Simple integration with existing page navigation
Minimal state management needed
Medium Complexity (4-8 hours):
Page Turn Animations
Can be implemented using CSS transitions/animations
Requires careful timing and state management
Need to handle both directions and edge cases
Progress Indicator
Requires modifications to the story generation process
Need to track and report progress from the API
UI implementation is straightforward
6. Local Story Persistence
Using localStorage or IndexedDB
Need to implement save/load functionality
Basic library view implementation
No backend required
Error Boundaries
React feature but requires careful implementation
Need to identify key areas for boundary placement
Requires good error handling and recovery strategies