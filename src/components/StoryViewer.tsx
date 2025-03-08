
import { useState, useEffect } from "react";
import { StoryData } from "@/types";
import StoryNavigation from "@/components/StoryNavigation";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryViewerProps {
  story: StoryData;
  height?: string | number;
  width?: string | number;
  className?: string;
  isEmbedded?: boolean;
}

const StoryViewer = ({ 
  story, 
  height = "100%",
  width = "100%", 
  className, 
  isEmbedded = false 
}: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Preload images
  useEffect(() => {
    story.slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.imageUrl;
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(slide.imageUrl));
      };
    });
  }, [story.slides]);

  const handleNavigate = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const isImageLoaded = (imageUrl: string) => {
    return loadedImages.has(imageUrl);
  };

  return (
    <div 
      className={cn(
        "story-container relative",
        className
      )} 
      style={{ height, width }}
    >
      {/* Story slides */}
      {story.slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`story-image ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={index !== currentIndex}
        >
          {isImageLoaded(slide.imageUrl) ? (
            <img
              src={slide.imageUrl}
              alt={slide.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-story-accent/30 border-t-story-accent rounded-full animate-spin" />
            </div>
          )}
          
          {/* Optional content overlay */}
          {(slide.title || slide.description) && (
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/60 to-transparent">
              {slide.title && (
                <h3 className="text-xl font-semibold mb-1">{slide.title}</h3>
              )}
              {slide.description && (
                <p className="text-sm opacity-90">{slide.description}</p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Play/Pause button (if not embedded) */}
      {!isEmbedded && story.slides.length > 1 && (
        <button
          className="absolute top-4 right-4 story-nav-button z-20"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      )}

      {/* Navigation components */}
      {story.slides.length > 1 && (
        <StoryNavigation
          slides={story.slides}
          currentIndex={currentIndex}
          onNavigate={handleNavigate}
          isPlaying={isPlaying}
          autoPlayInterval={5000}
        />
      )}
    </div>
  );
};

export default StoryViewer;
