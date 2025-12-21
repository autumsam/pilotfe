
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ChevronUp, ChevronDown, Eye, Maximize, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBreakpoint } from "@/hooks/use-mobile";
import PostPreview, { MediaItem } from "./post/PostPreview";
import ContentInput from "./post/ContentInput";
import MediaSelector from "./post/MediaSelector";
import MediaPreview from "./post/MediaPreview";
import HashtagSuggestions from "./post/HashtagSuggestions";
import PlatformSelector, { PlatformType } from "./post/PlatformSelector";
import PostActions from "./post/PostActions";
import AiGenerateTab from "./post/AiGenerateTab";

const SOCIAL_PLATFORMS: PlatformType[] = [
  { id: 'twitter', name: 'Twitter/X', color: '#1DA1F2', checked: true },
  { id: 'instagram', name: 'Instagram', color: '#E1306C', checked: true },
  { id: 'facebook', name: 'Facebook', color: '#4267B2', checked: true },
  { id: 'linkedin', name: 'LinkedIn', color: '#0077B5', checked: false },
  { id: 'tiktok', name: 'TikTok', color: '#000000', checked: false },
];

const HASHTAG_SUGGESTIONS = ['#TrendingNow', '#Viral', '#ContentCreator', '#SocialMedia', '#Marketing'];

const MEDIA_BACKGROUNDS = [
  'bg-gradient-to-r from-purple-500 to-pink-500',
  'bg-gradient-to-r from-yellow-400 to-orange-500',
  'bg-gradient-to-r from-green-400 to-blue-500',
  'bg-gradient-to-r from-pink-400 to-red-500',
  'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
];

const AUDIO_TRACKS = [
  { id: 'trending1', name: 'Trending Hit #1', artist: 'Popular Artist', duration: '0:30' },
  { id: 'trending2', name: 'Viral Sound', artist: 'TikTok Famous', duration: '0:15' },
  { id: 'trending3', name: 'Epic Background', artist: 'Social Media Tracks', duration: '0:45' },
];

const PostComposer = () => {
  const breakpoint = useBreakpoint();
  const [postContent, setPostContent] = useState('');
  const [platforms, setPlatforms] = useState(SOCIAL_PLATFORMS);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('19:00');
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('compose');
  const [mediaTab, setMediaTab] = useState<'photo' | 'video' | 'audio' | 'text'>('photo');
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [showAudioSelection, setShowAudioSelection] = useState(false);
  const [selectedBackgroundIdx, setSelectedBackgroundIdx] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [brandName, setBrandName] = useState("Your Brand Name");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const composerRef = useRef<HTMLDivElement>(null);

  const togglePlatform = (platformId: string) => {
    setPlatforms(platforms.map(platform => 
      platform.id === platformId 
        ? { ...platform, checked: !platform.checked }
        : platform
    ));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMediaFile = {
          id: `media-${Date.now()}`,
          type,
          file,
          preview: event.target?.result as string,
          background: type === 'audio' ? MEDIA_BACKGROUNDS[selectedBackgroundIdx] : undefined
        };
        setMediaFiles([...mediaFiles, newMediaFile]);
        
        // Close audio selection if open
        if (type === 'audio') {
          setShowAudioSelection(false);
        }

        // Show preview after adding media
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAudioTrack = (trackName: string) => {
    // Simulate adding an audio track
    const newAudio = {
      id: `audio-${Date.now()}`,
      type: 'audio' as const,
      file: null,
      preview: '',
      background: MEDIA_BACKGROUNDS[selectedBackgroundIdx]
    };
    setMediaFiles([...mediaFiles, newAudio]);
    setShowAudioSelection(false);
    toast.success(`Added track: ${trackName}`);
    setShowPreview(true);
  };

  const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    setMediaFiles(mediaFiles.map(media => 
      media.id === id ? { ...media, ...updates } : media
    ));
  };

  const removeMedia = (id: string) => {
    setMediaFiles(mediaFiles.filter(media => media.id !== id));
    
    // Hide preview if all media is removed
    if (mediaFiles.length <= 1) {
      setShowPreview(false);
    }
  };

  const handleSchedulePost = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    const selectedPlatforms = platforms.filter(p => p.checked).map(p => p.name).join(", ");
    toast.success(`Post scheduled for ${format(date, 'PPP')} at ${time} on ${selectedPlatforms}`);
  };

  const handlePostNow = () => {
    if (!postContent.trim() && mediaFiles.length === 0) {
      toast.error("Please add content to your post");
      return;
    }
    
    const selectedPlatforms = platforms.filter(p => p.checked).map(p => p.name).join(", ");
    if (selectedPlatforms) {
      toast.success(`Post successfully sent to ${selectedPlatforms}`);
      setPostContent("");
      setMediaFiles([]);
      setShowPreview(false);
    } else {
      toast.error("Please select at least one platform");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Apply fullscreen styling to the card
    if (composerRef.current) {
      if (!isFullscreen) {
        composerRef.current.classList.add('fixed', 'inset-0', 'z-50', 'bg-background', 'm-0', 'rounded-none');
        document.body.style.overflow = 'hidden';
      } else {
        composerRef.current.classList.remove('fixed', 'inset-0', 'z-50', 'bg-background', 'm-0', 'rounded-none');
        document.body.style.overflow = '';
      }
    }
  };

  // Clean up fullscreen on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <Card className={cn("border shadow-md transition-all mx-0", 
      isFullscreen ? "fixed inset-0 z-50 rounded-none" : "")} 
      id="post-composer" 
      ref={composerRef}>
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-postpulse-blue to-postpulse-blue/80 text-white border-b cursor-pointer p-3 sm:p-4" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
          <Send className="h-4 w-4 md:h-5 md:w-5" />
          Create New Post
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              setShowPreview(!showPreview);
            }}
            title={showPreview ? "Hide preview" : "Show preview"}
          >
            <Eye className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
          >
            <Maximize className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:text-white/80" size="sm">
            {isExpanded ? <ChevronUp className="h-3 w-3 md:h-4 md:w-4" /> : <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-0">
          <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full rounded-none border-b">
              <TabsTrigger value="compose" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-postpulse-blue">
                <Send className="h-4 w-4 mr-2" /> Compose
              </TabsTrigger>
              <TabsTrigger value="generate" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-postpulse-blue">
                <Sparkles className="h-4 w-4 mr-2" /> AI Generate
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="compose" className="p-0 animate-fade-in">
              <div className="flex flex-col lg:flex-row">
                {/* Main Composer Area */}
                <div className={cn("flex-1 p-3 sm:p-4 lg:p-6", showPreview ? "lg:w-1/2" : "w-full")}>
                  {/* User Info and Content Input */}
                  <ContentInput 
                    postContent={postContent}
                    setPostContent={setPostContent}
                    brandName={brandName}
                    platforms={platforms}
                  />
                  
                  {/* Media Type Selector */}
                  <MediaSelector 
                    mediaTab={mediaTab}
                    setMediaTab={setMediaTab}
                    mediaFiles={mediaFiles}
                    setMediaFiles={setMediaFiles}
                    handleMediaUpload={handleMediaUpload}
                    setShowAudioSelection={setShowAudioSelection}
                    showAudioSelection={showAudioSelection}
                    audioTracks={AUDIO_TRACKS}
                    selectedBackgroundIdx={selectedBackgroundIdx}
                    setSelectedBackgroundIdx={setSelectedBackgroundIdx}
                    mediaBackgrounds={MEDIA_BACKGROUNDS}
                    setShowPreview={setShowPreview}
                    addAudioTrack={addAudioTrack}
                  />
                  
                  {/* Media Preview */}
                  <MediaPreview 
                    mediaFiles={mediaFiles}
                    removeMedia={removeMedia}
                  />
                  
                  {/* Hashtag Suggestions */}
                  <HashtagSuggestions 
                    postContent={postContent}
                    setPostContent={setPostContent}
                    hashtagSuggestions={HASHTAG_SUGGESTIONS}
                  />
                  
                  {/* Platform Selection */}
                  <PlatformSelector 
                    platforms={platforms}
                    togglePlatform={togglePlatform}
                  />
                  
                  {/* Action Buttons */}
                  <PostActions 
                    date={date}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                    handleSchedulePost={handleSchedulePost}
                    handlePostNow={handlePostNow}
                    setActiveTab={setActiveTab}
                    setPostContent={setPostContent}
                  />
                </div>
                
                {/* Post Preview Side Panel */}
                {showPreview ? (
                  <div className={cn(
                    "lg:w-1/2 border-t lg:border-t-0 lg:border-l p-3 sm:p-4 flex flex-col justify-center items-center",
                    mediaFiles.length === 0 && "bg-gray-50 dark:bg-gray-800"
                  )}>
                    {mediaFiles.length > 0 ? (
                      <div className="w-full max-w-md mx-auto">
                        <h3 className="text-sm font-medium mb-4 text-center">Post Preview</h3>
                        <PostPreview 
                          brandName={brandName}
                          postContent={postContent}
                          mediaFiles={mediaFiles}
                          onUpdateMediaItem={updateMediaItem}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-10">
                        <ArrowDown className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Add media to see a preview of your post</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* AI Suggestions Sidebar */
                  <div className="lg:w-64 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 border-t lg:border-t-0 lg:border-l hidden lg:block">
                    <h3 className="font-medium mb-3 flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-postpulse-orange" />
                      AI Suggestions
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="text-sm bg-white dark:bg-gray-700 border p-2 rounded-md">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">CHARACTER COUNT</p>
                        <p className="dark:text-white">{postContent.length} characters</p>
                        {postContent.length > 280 && (
                          <p className="text-red-500 text-xs mt-1">Too long for Twitter/X (280 max)</p>
                        )}
                      </div>
                      
                      <div className="text-sm bg-white dark:bg-gray-700 border p-2 rounded-md">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">TRENDING HASHTAGS</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {HASHTAG_SUGGESTIONS.slice(0, 3).map((tag) => (
                            <Badge 
                              key={tag}
                              variant="secondary" 
                              className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 cursor-pointer"
                              onClick={() => setPostContent(prev => `${prev} ${tag}`)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-sm bg-white dark:bg-gray-700 border p-2 rounded-md">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">BEST POSTING TIME</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="dark:text-white">Today at 7:00 PM</p>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-postpulse-blue">
                            Use
                          </Button>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full text-sm" onClick={() => setActiveTab('generate')}>
                        <Sparkles className="mr-2 h-3 w-3" /> Get More AI Ideas
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="generate">
              <AiGenerateTab 
                setPostContent={setPostContent} 
                setActiveTab={setActiveTab}
                platforms={platforms}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default PostComposer;

// Add the format function from date-fns since it's used in the component
function format(date: Date, formatString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
