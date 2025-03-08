
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StoryCreator from "@/components/StoryCreator";
import StoryViewer from "@/components/StoryViewer";
import { getStory } from "@/utils/storyUtils";
import { StoryData } from "@/types";

const Index = () => {
  const [searchParams] = useSearchParams();
  const isEmbedded = searchParams.get("embed") === "true";
  const storyId = searchParams.get("storyId");
  const isLandscape = searchParams.get("orientation") === "landscape";
  const storyDataParam = searchParams.get("storyData");
  
  const [embedStory, setEmbedStory] = useState<StoryData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isEmbedded && storyId) {
      // First try to get story from URL parameter
      if (storyDataParam) {
        try {
          const storyData = JSON.parse(decodeURIComponent(storyDataParam));
          if (storyData && storyData.slides && Array.isArray(storyData.slides)) {
            // Validate story data has required properties
            if (storyData.slides.length > 0 && storyData.slides[0].imageUrl) {
              setEmbedStory(storyData);
              setLoadError(null);
              return;
            } else {
              setLoadError("Story has no slides");
            }
          } else {
            setLoadError("Invalid story format");
          }
        } catch (e) {
          console.error("Failed to parse story data from URL", e);
          setLoadError("Failed to load story data");
        }
      }
      
      // Fallback to localStorage if URL param doesn't work
      const story = getStory(storyId);
      if (story) {
        setEmbedStory(story);
        setLoadError(null);
      } else {
        setLoadError("Story not found in local storage");
      }
    }
  }, [isEmbedded, storyId, storyDataParam]);
  
  if (isEmbedded) {
    if (embedStory && embedStory.slides && embedStory.slides.length > 0) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <StoryViewer 
            story={embedStory} 
            isEmbedded={true} 
            className={isLandscape ? "webstory-landscape" : "webstory-portrait"}
          />
        </div>
      );
    } else {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-muted gap-2 p-4 text-center">
          <p className="text-muted-foreground font-medium">Story not found</p>
          {loadError && (
            <p className="text-xs text-muted-foreground/70">{loadError}</p>
          )}
        </div>
      );
    }
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="py-8 text-center border-b">
        <h1 className="text-4xl font-bold tracking-tight">WebStory Creator</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Create beautiful, interactive web stories and embed them on your Webflow site
        </p>
      </header>
      
      <main className="container py-12 mx-auto max-w-7xl">
        <StoryCreator />
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} WebStory Creator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
