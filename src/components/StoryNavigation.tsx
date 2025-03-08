
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StorySlide } from "@/types";

interface StoryNavigationProps {
  slides: StorySlide[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  autoPlayInterval?: number;
  isPlaying?: boolean;
}

const StoryNavigation = ({
  slides,
  currentIndex,
  onNavigate,
  autoPlayInterval = 5000,
  isPlaying = false,
}: StoryNavigationProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let animationFrame: number;
    let startTime: number;
    
    if (isPlaying && slides.length > 0) {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const newProgress = Math.min((elapsed / autoPlayInterval) * 100, 100);
        
        setProgress(newProgress);
        
        if (elapsed < autoPlayInterval) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      
      timer = setTimeout(() => {
        if (currentIndex < slides.length - 1) {
          onNavigate(currentIndex + 1);
        } else {
          onNavigate(0);
        }
      }, autoPlayInterval);
    } else {
      setProgress(0);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [currentIndex, slides.length, onNavigate, isPlaying, autoPlayInterval]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  return (
    <>
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 w-full z-10 px-4 pt-4">
        <div className="flex w-full gap-1">
          {slides.map((_, index) => (
            <div 
              key={index}
              className="h-1 bg-story-background/30 backdrop-blur-sm flex-1 rounded-full overflow-hidden"
            >
              {index === currentIndex && (
                <div
                  className="h-full bg-story-accent origin-left transition-transform"
                  style={{ 
                    transform: `scaleX(${progress / 100})`,
                    transition: isPlaying ? 'none' : 'transform 0.3s ease'
                  }}
                />
              )}
              {index < currentIndex && (
                <div className="h-full bg-story-accent w-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    
      {/* Navigation dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`story-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => onNavigate(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    
      {/* Left/Right navigation arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-10 pointer-events-none">
        <button
          className="story-nav-button pointer-events-auto"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="story-nav-button pointer-events-auto"
          onClick={goToNext}
          disabled={currentIndex === slides.length - 1}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </>
  );
};

export default StoryNavigation;
