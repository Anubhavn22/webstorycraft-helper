
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateEmbedCode } from "@/utils/storyUtils";
import { Check, Copy, ExternalLink } from "lucide-react";
import { StoryData } from "@/types";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EmbedCodeGeneratorProps {
  story: StoryData;
}

const EmbedCodeGenerator = ({ story }: EmbedCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const embedCode = generateEmbedCode(story.id, isLandscape);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleOrientationChange = (checked: boolean) => {
    setIsLandscape(checked);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Embed Code</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyCode}
          className="gap-1.5"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Code</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <Switch 
          id="landscape-mode" 
          checked={isLandscape} 
          onCheckedChange={handleOrientationChange}
        />
        <Label htmlFor="landscape-mode">Landscape orientation (540x312)</Label>
      </div>
      
      <div className="embed-code bg-muted p-4 rounded-md overflow-x-auto">
        <code className="text-xs font-mono">{embedCode}</code>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm text-blue-800">
        <p className="flex items-center gap-1.5 font-medium mb-1">
          <ExternalLink className="h-4 w-4" />
          <span>Webflow Embedding Instructions</span>
        </p>
        <ol className="list-decimal list-inside space-y-1 ml-1">
          <li>Copy the embed code above</li>
          <li>In Webflow, add an "Embed" element to your page</li>
          <li>Paste the code into the embed element</li>
          <li>Make sure the story has at least one slide before embedding</li>
          <li>Test the embed to verify the story displays correctly</li>
        </ol>
      </div>
    </div>
  );
};

export default EmbedCodeGenerator;
