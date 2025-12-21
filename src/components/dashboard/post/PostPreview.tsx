
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, MessageCircle, Heart, Send, X, Music, Tag, DollarSign, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  file: File | null;
  preview: string;
  background?: string;
  comments?: string[];
  price?: string;
  description?: string;
}

interface PostPreviewProps {
  brandName?: string;
  userName?: string;
  userAvatar?: string;
  postContent: string;
  mediaFiles: MediaItem[];
  onUpdateMediaItem: (id: string, updates: Partial<MediaItem>) => void;
}

const PostPreview = ({ 
  brandName = "Your Brand Name",
  userName = "janecreates",
  userAvatar = "https://github.com/shadcn.png",
  postContent, 
  mediaFiles,
  onUpdateMediaItem
}: PostPreviewProps) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const { theme } = useTheme();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = mediaFiles[currentMediaIndex];
  const hasMultipleMedia = mediaFiles.length > 1;

  const nextMedia = () => {
    if (currentMediaIndex < mediaFiles.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    const updatedComments = [...(currentMedia.comments || []), comment];
    onUpdateMediaItem(currentMedia.id, { comments: updatedComments });
    setComment("");
    setShowCommentInput(false);
  };

  const handleAddPrice = () => {
    if (!priceInput.trim()) return;
    onUpdateMediaItem(currentMedia.id, { price: priceInput });
    setPriceInput("");
    setEditingPrice(null);
  };

  const handleAddDescription = () => {
    if (!descriptionInput.trim()) return;
    onUpdateMediaItem(currentMedia.id, { description: descriptionInput });
    setDescriptionInput("");
    setEditingDescription(null);
  };

  useEffect(() => {
    // Reset audio/video when changing media items
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [currentMediaIndex]);

  // When there's no media, don't render the preview
  if (mediaFiles.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden max-w-md mx-auto">
      <CardHeader className="bg-white dark:bg-gray-800 p-3 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium">{brandName}</h3>
              <p className="text-xs text-gray-500">@{userName}</p>
            </div>
          </div>
          <div>
            {currentMedia.type === 'image' && currentMedia.price && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                <DollarSign className="h-3 w-3 mr-1" />
                {currentMedia.price}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        {/* Media Content */}
        <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-900">
          {currentMedia.type === 'image' && (
            <img 
              src={currentMedia.preview} 
              alt="Post media" 
              className="w-full h-full object-cover"
            />
          )}

          {currentMedia.type === 'video' && (
            <video 
              ref={videoRef}
              src={currentMedia.preview} 
              controls
              className="w-full h-full object-cover"
              onLoadedMetadata={() => {
                if (videoRef.current) videoRef.current.volume = 0.5;
              }}
            />
          )}

          {currentMedia.type === 'audio' && (
            <div className={cn("w-full h-full flex flex-col items-center justify-center", currentMedia.background)}>
              <Music className="h-16 w-16 text-white mb-4" />
              <audio 
                ref={audioRef}
                src={currentMedia.preview} 
                controls
                className="w-3/4 mt-auto mb-8"
              />
            </div>
          )}

          {/* Navigation Arrows for Multiple Media */}
          {hasMultipleMedia && (
            <>
              <button 
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-1 text-white",
                  currentMediaIndex === 0 && "opacity-50 cursor-not-allowed"
                )}
                onClick={prevMedia}
                disabled={currentMediaIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button 
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-1 text-white",
                  currentMediaIndex === mediaFiles.length - 1 && "opacity-50 cursor-not-allowed"
                )}
                onClick={nextMedia}
                disabled={currentMediaIndex === mediaFiles.length - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Media Indicators */}
          {hasMultipleMedia && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
              {mediaFiles.map((_, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "h-2 rounded-full",
                    index === currentMediaIndex ? "bg-white w-4" : "bg-white/60 w-2"
                  )}
                  onClick={() => setCurrentMediaIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Add Price Button */}
          <Button 
            size="icon" 
            variant="secondary"
            className="absolute top-3 right-3 rounded-full h-8 w-8 opacity-90"
            onClick={() => {
              setPriceInput(currentMedia.price || "");
              setEditingPrice(currentMedia.id);
            }}
          >
            <Tag size={14} />
          </Button>

          {/* Add Description Button */}
          <Button 
            size="icon" 
            variant="secondary"
            className="absolute top-3 right-14 rounded-full h-8 w-8 opacity-90"
            onClick={() => {
              setDescriptionInput(currentMedia.description || "");
              setEditingDescription(currentMedia.id);
            }}
          >
            <Pencil size={14} />
          </Button>
        </div>

        {/* Price Input Modal */}
        {editingPrice === currentMedia.id && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <Card className="w-full max-w-[300px]">
              <CardHeader>
                <CardTitle className="text-center text-base">Add Price Tag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">$</span>
                  <Input
                    placeholder="29.99"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    className="flex-1"
                    autoFocus
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setEditingPrice(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPrice}>
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Description Input Modal */}
        {editingDescription === currentMedia.id && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <Card className="w-full max-w-[300px]">
              <CardHeader>
                <CardTitle className="text-center text-base">Add Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe this product..."
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  className="min-h-[80px]"
                  autoFocus
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setEditingDescription(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddDescription}>
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Caption Area */}
        <div className="p-3">
          <p className="text-sm">
            <span className="font-medium mr-1">{brandName}</span>
            {postContent}
          </p>
          
          {/* Description for current media if it exists */}
          {currentMedia.description && (
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 border-l-2 border-gray-300 pl-2">
              {currentMedia.description}
            </p>
          )}
        </div>

        {/* Comment Section */}
        {currentMedia.comments && currentMedia.comments.length > 0 && (
          <div className="px-3 pb-2">
            <h4 className="text-xs text-gray-500 mb-2">Comments</h4>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {currentMedia.comments.map((comment, index) => (
                <div key={index} className="flex gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <p className="text-xs">
                    <span className="font-medium">user123</span> {comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className={cn(
        "flex items-center justify-between p-3 border-t",
        theme === "dark" ? "bg-gray-800" : "bg-white"
      )}>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setShowCommentInput(!showCommentInput)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>

      {/* Comment Input Section */}
      {showCommentInput && (
        <div className="p-3 border-t flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Input 
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 h-8 text-sm"
          />
          <Button 
            size="icon" 
            className="h-8 w-8"
            onClick={handleAddComment}
            disabled={!comment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8"
            onClick={() => setShowCommentInput(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PostPreview;
