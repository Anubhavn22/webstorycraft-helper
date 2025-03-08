import { StoryData, StorySlide } from "../types";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const createEmptyStory = (): StoryData => {
  return {
    id: generateId(),
    title: "Untitled Story",
    slides: [],
    createdAt: Date.now(),
  };
};

export const createNewSlide = (imageUrl: string): StorySlide => {
  return {
    id: generateId(),
    imageUrl,
    title: "",
    description: "",
  };
};

export const generateEmbedCode = (storyId: string, isLandscape: boolean = false) => {
  const baseUrl = window.location.origin;
  const orientation = isLandscape ? '&orientation=landscape' : '';
  
  return `<iframe 
  src="${baseUrl}?embed=true&storyId=${storyId}${orientation}" 
  frameborder="0" 
  width="100%" 
  height="500px" 
  style="max-width: 100%; ${isLandscape ? 'aspect-ratio: 16/9;' : 'aspect-ratio: 4/5;'}" 
  allowfullscreen
></iframe>`;
};

export const moveSlide = (
  slides: StorySlide[],
  fromIndex: number,
  toIndex: number
): StorySlide[] => {
  const result = [...slides];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

// Simple storage utils using localStorage
export const saveStory = (story: StoryData): void => {
  const storiesJson = localStorage.getItem("webStories");
  let stories: Record<string, StoryData> = {};
  
  if (storiesJson) {
    stories = JSON.parse(storiesJson);
  }
  
  stories[story.id] = story;
  localStorage.setItem("webStories", JSON.stringify(stories));
};

export const getStory = (storyId: string): StoryData | null => {
  const storiesJson = localStorage.getItem("webStories");
  
  if (!storiesJson) return null;
  
  const stories: Record<string, StoryData> = JSON.parse(storiesJson);
  return stories[storyId] || null;
};

export const getAllStories = (): StoryData[] => {
  const storiesJson = localStorage.getItem("webStories");
  
  if (!storiesJson) return [];
  
  const stories: Record<string, StoryData> = JSON.parse(storiesJson);
  return Object.values(stories).sort((a, b) => b.createdAt - a.createdAt);
};

export const deleteStory = (storyId: string): void => {
  const storiesJson = localStorage.getItem("webStories");
  
  if (!storiesJson) return;
  
  const stories: Record<string, StoryData> = JSON.parse(storiesJson);
  delete stories[storyId];
  localStorage.setItem("webStories", JSON.stringify(stories));
};
