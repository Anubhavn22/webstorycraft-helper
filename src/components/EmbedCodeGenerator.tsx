
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateEmbedCode } from "@/utils/storyUtils";
import { Check, Copy } from "lucide-react";
import { StoryData } from "@/types";
import { toast } from "sonner";

interface EmbedCodeGeneratorProps {
  story: StoryData;
}

const EmbedCodeGenerator = ({ story }: EmbedCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const embedCode = generateEmbedCode(story.id);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
      <div className="embed-code">
        {embedCode}
      </div>
      <p className="text-sm text-muted-foreground">
        Paste this code into your Webflow site to embed this web story.
      </p>
    </div>
  );
};

export default EmbedCodeGenerator;
