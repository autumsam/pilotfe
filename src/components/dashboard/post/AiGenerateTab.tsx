import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Sparkles, Wand2, TrendingUp, History, Loader2, AlertCircle } from "lucide-react";
import { aiApi } from "@/services/aiApi";
import postsApi from "@/services/postsApi";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AiGenerateTabProps {
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  platforms: Array<{id: string, name: string, color: string}>;
}

interface TrendingTopic {
  topic: string;
  description: string;
  engagement: string;
  reason: string;
}

const AiGenerateTab: React.FC<AiGenerateTabProps> = ({ setPostContent, setActiveTab, platforms }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [variants, setVariants] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [platform, setPlatform] = useState("general");
  const [tone, setTone] = useState<"professional" | "casual" | "humorous" | "informative">("professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [usePreviousPosts, setUsePreviousPosts] = useState(false);
  const [useTrending, setUseTrending] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    checkAIAvailability();
  }, []);

  const checkAIAvailability = async () => {
    try {
      const availability = await aiApi.checkAvailability();
      setAiAvailable(availability.available);
      if (!availability.available) {
        setError("AI features are not available. Please configure your OpenAI API key in settings.");
      }
    } catch (error) {
      setAiAvailable(false);
      setError("Failed to check AI availability.");
    }
  };

  const loadTrendingTopics = async () => {
    setLoadingTrending(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ai/trending/?platform=${platform}`,
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem('postpulse-token')}`,
          },
          credentials: 'include',
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setTrendingTopics(data.trending_topics || []);
      }
    } catch (error) {
      console.error("Failed to load trending topics:", error);
    } finally {
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    if (useTrending) {
      loadTrendingTopics();
    }
  }, [useTrending, platform]);
  
  const handleGenerateContent = async () => {
    if (!prompt && !customPrompt) {
      toast.error("Please enter a topic or custom prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await aiApi.generateContent({
        topic: prompt || customPrompt,
        platform: platform,
        tone: tone,
        length: length,
      });
      
      // Also send with additional params via direct API call for advanced features
      const advancedResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ai/generate/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('postpulse-token')}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            topic: prompt || customPrompt,
            platform,
            tone,
            length,
            use_previous_posts: usePreviousPosts,
            use_trending: useTrending,
            custom_prompt: customPrompt || undefined,
          }),
        }
      );

      if (advancedResponse.ok) {
        const data = await advancedResponse.json();
        setGeneratedContent(data.content);
        setVariants(data.variants || []);
        toast.success("AI content generated successfully!");
      } else {
        throw new Error("Failed to generate content");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate content");
      toast.error("Failed to generate AI content");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSelectGeneratedPost = (content: string) => {
    setPostContent(content);
    setActiveTab('compose');
    toast.success("Content applied to composer");
  };

  const applyTrendingTopic = (topic: TrendingTopic) => {
    setPrompt(topic.topic);
    toast.success(`Applied trending topic: ${topic.topic}`);
  };
  
  return (
    <div className="p-4 md:p-6 animate-fade-in space-y-6">
      <div>
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Generate AI Content
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enter a topic or use AI to generate optimized content based on trending topics and your previous posts.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Configuration Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(v: any) => setTone(v)}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
                <SelectItem value="informative">Informative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="length">Length</Label>
            <Select value={length} onValueChange={(v: any) => setLength(v)}>
              <SelectTrigger id="length">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Features */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Use Previous Posts</p>
                <p className="text-xs text-muted-foreground">Analyze your past successful posts</p>
              </div>
            </div>
            <Switch checked={usePreviousPosts} onCheckedChange={setUsePreviousPosts} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Use Trending Topics</p>
                <p className="text-xs text-muted-foreground">Incorporate current trends</p>
              </div>
            </div>
            <Switch checked={useTrending} onCheckedChange={setUseTrending} />
          </div>
        </div>

        {/* Trending Topics */}
        {useTrending && (
          <div className="mb-4">
            <Label className="mb-2 block">Trending Topics</Label>
            {loadingTrending ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {trendingTopics.slice(0, 6).map((topic, idx) => (
                  <Card key={idx} className="p-3 cursor-pointer hover:border-primary transition-colors" onClick={() => applyTrendingTopic(topic)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{topic.topic}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{topic.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">{topic.engagement}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Topic Input */}
        <div className="space-y-2">
          <Label htmlFor="topic">Topic or Custom Prompt</Label>
          <Textarea
            id="topic"
            placeholder="e.g., new product launch, tips for productivity, or a custom AI prompt..."
            className="min-h-[100px] resize-none"
            value={customPrompt || prompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              setPrompt(e.target.value);
            }}
          />
        </div>
        
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-postpulse-blue to-blue-600 text-white hover:opacity-90"
          onClick={handleGenerateContent}
          disabled={isGenerating || !aiAvailable}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating AI Content...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>
      
      {/* Generated Content */}
      {!isGenerating && (generatedContent || variants.length > 0) && (
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generated Content
          </h3>
          
          {/* Main Content */}
          {generatedContent && (
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-primary/5 border-b px-4 py-2 flex justify-between items-center">
                <span className="font-medium text-sm">Primary Version</span>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-xs h-7"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default"
                    className="text-xs h-7 bg-postpulse-blue hover:bg-blue-600"
                    onClick={() => handleSelectGeneratedPost(generatedContent)}
                  >
                    Use This
                  </Button>
                </div>
              </div>
              <div className="p-4 text-sm whitespace-pre-wrap">
                {generatedContent}
              </div>
            </Card>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <>
              <h4 className="text-sm font-medium text-muted-foreground">Alternative Versions</h4>
              {variants.map((variant, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 dark:bg-gray-800 border-b px-4 py-2 flex justify-between items-center">
                    <span className="font-medium text-sm">Variant {idx + 1}</span>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-xs h-7"
                        onClick={() => {
                          navigator.clipboard.writeText(variant);
                          toast.success("Copied to clipboard");
                        }}
                      >
                        Copy
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default"
                        className="text-xs h-7"
                        onClick={() => handleSelectGeneratedPost(variant)}
                      >
                        Use This
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 text-sm whitespace-pre-wrap">
                    {variant}
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AiGenerateTab;
