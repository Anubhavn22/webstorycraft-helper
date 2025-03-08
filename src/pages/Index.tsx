
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
  
  const [embedStory, setEmbedStory] = useState<StoryData | null>(null);
  
  useEffect(() => {
    if (isEmbedded && storyId) {
      const story = getStory(storyId);
      if (story) {
        setEmbedStory(story);
      }
    }
  }, [isEmbedded, storyId]);
  
  if (isEmbedded) {
    if (embedStory) {
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
        <div className="w-full h-screen flex items-center justify-center bg-muted">
          <p className="text-muted-foreground">Story not found</p>
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
