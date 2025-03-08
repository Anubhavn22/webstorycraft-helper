
import { useState, useEffect } from "react";
import { StoryData, StorySlide } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import StoryUploader from "@/components/StoryUploader";
import StoryViewer from "@/components/StoryViewer";
import EmbedCodeGenerator from "@/components/EmbedCodeGenerator";
import { createEmptyStory, saveStory, moveSlide } from "@/utils/storyUtils";
import { Trash2, X, GripVertical, Save } from "lucide-react";

const StoryCreator = () => {
  const [story, setStory] = useState<StoryData>(createEmptyStory());
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Select the first slide when slides are added
  useEffect(() => {
    if (story.slides.length > 0 && selectedSlideIndex === null) {
      setSelectedSlideIndex(0);
    } else if (story.slides.length === 0) {
      setSelectedSlideIndex(null);
    } else if (selectedSlideIndex !== null && selectedSlideIndex >= story.slides.length) {
      setSelectedSlideIndex(story.slides.length - 1);
    }
  }, [story.slides.length, selectedSlideIndex]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStory((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleAddSlide = (slide: StorySlide) => {
    setStory((prev) => ({
      ...prev,
      slides: [...prev.slides, slide],
    }));
  };

  const handleRemoveSlide = (index: number) => {
    setStory((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index),
    }));
  };

  const handleSlideSelect = (index: number) => {
    setSelectedSlideIndex(index);
  };

  const handleSlideTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedSlideIndex === null) return;

    setStory((prev) => {
      const newSlides = [...prev.slides];
      newSlides[selectedSlideIndex] = {
        ...newSlides[selectedSlideIndex],
        title: e.target.value,
      };
      return { ...prev, slides: newSlides };
    });
  };

  const handleSlideDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedSlideIndex === null) return;

    setStory((prev) => {
      const newSlides = [...prev.slides];
      newSlides[selectedSlideIndex] = {
        ...newSlides[selectedSlideIndex],
        description: e.target.value,
      };
      return { ...prev, slides: newSlides };
    });
  };

  const handleSaveStory = () => {
    if (story.slides.length === 0) {
      toast.error("Please add at least one slide to your story");
      return;
    }

    setIsSaving(true);

    try {
      saveStory(story);
      toast.success("Story saved successfully");
      setPreviewMode(true);
    } catch (error) {
      toast.error("Failed to save story");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= story.slides.length ||
      toIndex < 0 ||
      toIndex >= story.slides.length
    ) {
      return;
    }

    setStory((prev) => ({
      ...prev,
      slides: moveSlide(prev.slides, fromIndex, toIndex),
    }));

    if (selectedSlideIndex === fromIndex) {
      setSelectedSlideIndex(toIndex);
    }
  };

  const handlePreviewToggle = () => {
    setPreviewMode((prev) => !prev);
  };

  const selectedSlide = selectedSlideIndex !== null ? story.slides[selectedSlideIndex] : null;

  return (
    <div className="w-full flex flex-col md:flex-row md:gap-8">
      {/* Left panel (editor) */}
      <div className={`w-full ${previewMode ? "hidden md:block md:w-1/3" : "md:w-1/2"}`}>
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Story Details</h2>
            <Input
              placeholder="Story Title"
              value={story.title}
              onChange={handleTitleChange}
              className="text-lg"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload Images</h3>
            <StoryUploader onImageUploaded={handleAddSlide} isLoading={isSaving} />
          </div>

          {story.slides.length > 0 && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Slides</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {story.slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`relative group cursor-pointer rounded-md overflow-hidden border-2 aspect-[3/4] transition-all duration-200 ${
                        selectedSlideIndex === index ? "border-story-accent ring-1 ring-story-accent" : "border-transparent hover:border-story-accent/50"
                      }`}
                      onClick={() => handleSlideSelect(index)}
                    >
                      <img
                        src={slide.imageUrl}
                        alt={slide.title || `Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                      
                      {/* Slide number badge */}
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-sm">
                        {index + 1}
                      </div>
                      
                      {/* Delete button */}
                      <button
                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSlide(index);
                        }}
                        aria-label="Remove slide"
                      >
                        <X size={14} />
                      </button>
                      
                      {/* Move up/down buttons */}
                      <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          className="bg-black/60 text-white p-1 rounded-full disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(index, index - 1);
                          }}
                          disabled={index === 0}
                          aria-label="Move slide up"
                        >
                          <GripVertical size={14} className="rotate-90" />
                        </button>
                        <button
                          className="bg-black/60 text-white p-1 rounded-full disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(index, index + 1);
                          }}
                          disabled={index === story.slides.length - 1}
                          aria-label="Move slide down"
                        >
                          <GripVertical size={14} className="rotate-90" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedSlide && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Slide Content</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Slide Title (optional)"
                    value={selectedSlide.title || ""}
                    onChange={handleSlideTitleChange}
                  />
                  <Textarea
                    placeholder="Slide Description (optional)"
                    value={selectedSlide.description || ""}
                    onChange={handleSlideDescriptionChange}
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handlePreviewToggle}
            >
              {previewMode ? "Edit" : "Preview"}
            </Button>
            <Button 
              onClick={handleSaveStory} 
              disabled={story.slides.length === 0 || isSaving}
              className="gap-1.5"
            >
              <Save size={16} />
              Save Story
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right panel (preview) */}
      <div className={`w-full mt-8 md:mt-0 ${previewMode ? "md:w-2/3" : "md:w-1/2"}`}>
        {story.slides.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Preview</h2>
            </div>
            
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <StoryViewer story={story} height="100%" />
                </div>
              </CardContent>
            </Card>
            
            {previewMode && (
              <EmbedCodeGenerator story={story} />
            )}
          </div>
        ) : (
          <div className="h-64 border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">
              Add slides to preview your story
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryCreator;
