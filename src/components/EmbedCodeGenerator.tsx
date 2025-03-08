
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateEmbedCode } from "@/utils/storyUtils";
import { Check, Copy } from "lucide-react";
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
      
      <p className="text-sm text-muted-foreground">
        Paste this code into your Webflow site to embed this web story.
      </p>
    </div>
  );
};

export default EmbedCodeGenerator;
