
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createNewSlide } from "@/utils/storyUtils";
import { StorySlide } from "@/types";
import { Upload, ImageIcon } from "lucide-react";

interface StoryUploaderProps {
  onImageUploaded: (slide: StorySlide) => void;
  isLoading?: boolean;
}

const StoryUploader = ({ onImageUploaded, isLoading }: StoryUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        toast.error("Please upload an image file (JPEG, PNG, GIF, WEBP)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file is too large (max 5MB)");
        return;
      }
      
      // Create object URL
      const objectUrl = URL.createObjectURL(file);
      
      // Create a new slide with the image
      const newSlide = createNewSlide(objectUrl);
      onImageUploaded(newSlide);
      
      toast.success("Image uploaded successfully");
    },
    [onImageUploaded]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  return (
    <div
      className={`relative w-full h-48 rounded-lg border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 ${
        isDragging
          ? "border-story-accent bg-story-accent-muted/20"
          : "border-story-border hover:border-story-accent/50 hover:bg-story-accent-muted/10"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-story-accent-muted/30 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-story-accent" />
          </div>
          <p className="text-sm font-medium">
            Drag & drop image, or <span className="text-story-accent">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPEG, PNG, GIF up to 5MB
          </p>
        </div>
      </div>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => handleFileUpload(e.target.files)}
        accept="image/jpeg,image/png,image/gif,image/webp"
        disabled={isLoading}
      />
    </div>
  );
};

export default StoryUploader;
