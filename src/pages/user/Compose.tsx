import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { 
  Image, 
  Video, 
  Hash, 
  Sparkles, 
  CalendarIcon, 
  Send, 
  Clock,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import postsApi from "@/services/postsApi";
import { aiApi } from "@/services/aiApi";
import AiGenerateTab from "@/components/dashboard/post/AiGenerateTab";

const platforms = [
  { id: "twitter", name: "Twitter/X", icon: Twitter, color: "bg-blue-500", connected: true },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600", connected: true },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-700", connected: true },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-600", connected: false },
];

const Compose = () => {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter", "instagram"]);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("12:00");
  const [isScheduling, setIsScheduling] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [loadingHashtags, setLoadingHashtags] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  // Auto-suggest hashtags when content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.length > 50) {
        loadHashtagSuggestions();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  const loadHashtagSuggestions = async () => {
    if (!content.trim()) return;
    
    setLoadingHashtags(true);
    try {
      const suggestions = await aiApi.suggestHashtags(content);
      const hashtagStrings = suggestions.map(s => s.hashtag).slice(0, 8);
      setSuggestedHashtags(hashtagStrings);
    } catch (error) {
      console.error("Failed to load hashtag suggestions:", error);
    } finally {
      setLoadingHashtags(false);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      // Prepare post data
      const postData: any = {
        content,
        hashtags,
        status: isScheduling && date ? 'scheduled' : 'published',
      };

      // Add scheduled time if scheduling
      if (isScheduling && date) {
        const [hours, minutes] = time.split(':');
        const scheduledDate = new Date(date);
        scheduledDate.setHours(parseInt(hours), parseInt(minutes));
        postData.scheduled_at = scheduledDate.toISOString();
      }

      // Create the post
      const post = await postsApi.createPost(postData);

      // Success message
      if (isScheduling && date) {
        toast.success(`Post scheduled for ${format(date, "PPP")} at ${time}`);
        navigate("/user/scheduled");
      } else {
        toast.success("Post published successfully!");
        navigate("/user/scheduled");
      }

      // Reset form
      setContent("");
      setHashtags([]);
      setSelectedPlatforms(["twitter", "instagram"]);
      setDate(undefined);
      setIsScheduling(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to publish post");
      toast.error("Failed to publish post");
    } finally {
      setIsPublishing(false);
    }
  };

  const addHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      toast.success(`Added ${tag}`);
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(h => h !== tag));
  };

  const characterCount = content.length;
  const maxCharacters = 280;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Compose Post</h1>
        <p className="text-sm text-muted-foreground">Create and schedule your content</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Generate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                  <CardDescription>What would you like to share?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind? Share something amazing..."
                    className="min-h-[250px] resize-none text-base"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" title="Add image">
                        <Image className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Add video">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Get hashtag suggestions"
                        onClick={loadHashtagSuggestions}
                        disabled={loadingHashtags}
                      >
                        {loadingHashtags ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Hash className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <span className={`text-sm ${characterCount > maxCharacters ? "text-destructive" : "text-muted-foreground"}`}>
                      {characterCount} characters
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Hashtags */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    Hashtags
                    {loadingHashtags && <Loader2 className="h-4 w-4 animate-spin" />}
                  </CardTitle>
                  <CardDescription>Add relevant hashtags to increase reach</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 px-3 py-1">
                          {tag}
                          <button onClick={() => removeHashtag(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {suggestedHashtags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">AI Suggested:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedHashtags.map((tag) => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            onClick={() => addHashtag(tag)}
                            disabled={hashtags.includes(tag)}
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Platforms */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Platforms</CardTitle>
                  <CardDescription>Select where to publish</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      } ${!platform.connected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() => platform.connected && togglePlatform(platform.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center text-white`}>
                          <platform.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{platform.name}</span>
                      </div>
                      {platform.connected ? (
                        <Switch 
                          checked={selectedPlatforms.includes(platform.id)} 
                          onCheckedChange={() => togglePlatform(platform.id)}
                        />
                      ) : (
                        <Badge variant="outline">Connect</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Schedule for later</span>
                    </div>
                    <Switch checked={isScheduling} onCheckedChange={setIsScheduling} />
                  </div>

                  {isScheduling && (
                    <>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <div>
                        <Label htmlFor="time" className="text-sm">Time</Label>
                        <input
                          id="time"
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                        />
                      </div>
                    </>
                  )}

                  <Button 
                    className="w-full gap-2" 
                    onClick={handlePublish}
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : isScheduling ? (
                      <>
                        <CalendarIcon className="h-4 w-4" />
                        Schedule Post
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Publish Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-0">
          <Card className="border-border/50 shadow-sm">
            <AiGenerateTab 
              setPostContent={setContent}
              setActiveTab={setActiveTab}
              platforms={platforms}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Compose;
