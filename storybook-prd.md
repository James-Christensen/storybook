# Product Requirements Document (PRD)

## 1. Overview

**Product Name**: Storybook

**Summary**: Storybook is a simple web application that allows users to generate a short, illustrated children's story by selecting a main character, a sidekick, and a setting. The story text is generated locally using an Ollama LLM endpoint, and the images are generated using Flux 1.0 models hosted on a local DrawThings HTTP server.

## 2. Objectives and Goals

### 2.1 User-Friendly Generation
- Provide a straightforward interface for users to enter three pieces of information (main character, sidekick, setting)
- Generate both text and corresponding images for a short children's story in a single workflow

### 2.2 Local LLM & Image Generation
- Rely on Ollama for text generation (prompt-based)
- Use Flux 1.0 models on a DrawThings HTTP server for text-to-image generation

### 2.3 Maintainable, Extensible Architecture
- Use the MVVM (Model-View-ViewModel) pattern for clean separation of concerns
- Ensure the application can be easily extended for additional features, styling, or different LLM/image-generation endpoints

## 3. Scope and Features

### 3.1 User Flow

#### Landing / Home Page
- Displays a form requesting:
  - Main Character (e.g., "a brave lion")
  - Sidekick (e.g., "a wise owl")
  - Setting (e.g., "a magical forest")
- A "Generate Story" button that triggers the story creation process

#### Story Generation
- Text Generation: Send a prompt to the local Ollama endpoint (e.g., http://localhost:11411/generate) to generate a short children's story
- Image Generation: For each paragraph (or story segment), send a prompt to the local DrawThings HTTP server (Flux 1.0 models) (e.g., http://localhost:5000/draw) to generate a corresponding illustration

#### Story Display
- Show the final story title, each paragraph, and each generated image side by side in a simple layout

#### Error & Loading States
- Show an appropriate message or spinner during text/image generation
- Display errors if text/image generation fails or times out

### 3.2 Non-Functional Requirements
- Performance: Generating multiple images can be time-consuming; the app should provide feedback (loading spinner, progress bar, or status messages) to the user
- Localization (Optional/Future): The story generation and UI may eventually support multiple languages. Not strictly required for the first version, but structure the code so that future localization is possible if needed
- Scalability: Although the current plan is local endpoints, the design should allow for easy switching to remote endpoints or containerized microservices in the future if desired

## 4. Architecture & Implementation

### 4.1 Tech Stack

1. Next.js (React)
   - Provides both server-side rendered (SSR) and client-side rendered components as needed
   - pages/ directory for routing

2. React
   - Core UI library for building the user interface

3. TypeScript (Recommended)
   - Optional but strongly encouraged to ensure type safety for models and viewmodels

4. axios or Built-In fetch
   - For making HTTP requests to local endpoints (Ollama and DrawThings)

5. Styling
   - Optionally use Tailwind, CSS modules, or styled-components. The choice is up to the dev team

### 4.2 MVVM Structure

Use a folder structure similar to:

```
storybook/
├─ pages/
│  ├─ index.tsx     // Main view (Home page)
├─ components/
│  ├─ StoryForm.tsx // Collects user input
│  ├─ StoryDisplay.tsx // Displays the final story text + images
├─ models/
│  └─ story.ts      // Data interfaces/classes (StoryRequest, Story)
├─ viewmodels/
│  └─ storyViewModel.ts // Coordinates text/image generation
├─ styles/          // Global or module CSS
├─ package.json
└─ ...
```

#### Model Layer
- Holds data structures, interfaces, or classes representing the domain (e.g., Story, StoryRequest)

```typescript
// models/story.ts
export interface StoryRequest {
  mainCharacter: string;
  sidekick: string;
  setting: string;
}

export interface Story {
  title: string;
  paragraphs: string[];
  images: string[]; // each index corresponds to a paragraph
}
```

#### ViewModel Layer
- Coordinates application logic, including fetching data from local endpoints
- Functions to include (at minimum):
  - generateStoryText(request: StoryRequest): Promise<string[]>
  - Calls Ollama endpoint to get paragraphs of story text
  - generateImagesForStory(paragraphs: string[]): Promise<string[]>
  - Calls DrawThings endpoint to get images for each paragraph
  - createStory(request: StoryRequest): Promise<Story>
  - Orchestrates the above two functions and returns a complete Story object

```typescript
// viewmodels/storyViewModel.ts
export async function generateStoryText(request: StoryRequest): Promise<string[]> {
  // ...
}

export async function generateImagesForStory(paragraphs: string[]): Promise<string[]> {
  // ...
}

export async function createStory(request: StoryRequest): Promise<Story> {
  // ...
}
```

#### View Layer
- React components:
  - StoryForm: Renders input fields for main character, sidekick, and setting. Calls onGenerate when submitted
  - StoryDisplay: Accepts a Story object, displays paragraphs, and renders images

### 4.3 API Integrations

#### Ollama Endpoint
- URL: http://localhost:11411/generate (adjust as needed)
- Method: POST
- Body: { prompt: "Write a short children's story about..." }
- Response: Should include the generated text

#### DrawThings + Flux 1.0 Endpoint
- URL: http://localhost:5000/draw (adjust as needed)
- Method: POST
- Body:
```json
{
  "prompt": "An illustration for a children's story: [paragraph text]",
  "style": "cartoon",
  "size": "512x512"
}
```
- Response: Should include either a direct image URL or a base64-encoded image

### 4.4 Acceptance Criteria

#### Functional
- Form Submission: User can submit character, sidekick, and setting without errors
- Text Generation: The system must return a coherent, multi-paragraph story via Ollama
- Image Generation: Each paragraph should have a corresponding image or placeholder if generation fails
- Display: The final page must display the story's title, paragraphs, and images in a logical sequence

#### Usability
- Loading State: When generating, display an indication (e.g., "Generating story, please wait…")
- Errors: If text or image generation fails, show an error message to the user

#### Performance
- Multiple Scenes: Handling at least 3–5 paragraphs with unique images per paragraph within a reasonable time (under 1–2 minutes for the entire process)

## 5. Project Milestones

### Milestone 1: Basic Next.js Setup
- Create Next.js project with recommended folder structure
- Add basic placeholders for StoryForm and StoryDisplay components

### Milestone 2: MVVM + Basic Integration
- Implement storyViewModel.ts with mock or placeholder data for both text and image generation to confirm the end-to-end flow works

### Milestone 3: API Integration
- Connect to the local Ollama endpoint for real text generation
- Connect to the local DrawThings endpoint for real image generation

### Milestone 4: Testing & Polish
- Add loading states, error handling, and minimal styling
- Confirm the final user experience is smooth and meets acceptance criteria

## 6. Additional Considerations

### Error Handling & Retries
- If an API call to Ollama or DrawThings fails, the system should handle or retry gracefully

### Security
- Because these are local endpoints, there may be minimal security constraints. However, keep environment variables or local IP addresses properly configured in .env.local if needed

### Future Enhancements
- Add steps or a "wizard" for story creation
- Allow for partial story generation (e.g., paragraph by paragraph)
- Support advanced style options for images (cartoon, watercolor, etc.) via user input

## 7. Timeline and Resource Requirements

### Estimated Development Time
- ~1–2 weeks for a basic MVP, assuming one engineer

### Resources Needed
- A local environment with Ollama and DrawThings installed and running
- Developer familiar with Next.js, React, TypeScript, and basic REST API calls

## Document Approval
- Product Owner: [Name]
- Technical Lead: [Name]
- Date: [Date]

## Summary

Storybook is a straightforward Next.js application that demonstrates local text and image generation for a children's story. By following MVVM principles, the solution will be maintainable, extensible, and clearly separated in terms of data modeling, business logic, and view presentation. Once completed, users will enjoy an intuitive interface for creating short illustrated stories, entirely powered by local AI endpoints.
