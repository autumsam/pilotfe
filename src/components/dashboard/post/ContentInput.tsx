
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AtSign, Hash, MapPin, Smile } from "lucide-react";

interface ContentInputProps {
  postContent: string;
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
  brandName: string;
  platforms: Array<{id: string, name: string, color: string, checked: boolean}>;
}

const EMOJI_SUGGESTIONS = ['😊', '🎉', '👍', '🔥', '💯', '⭐', '❤️', '😂'];

const ContentInput: React.FC<ContentInputProps> = ({
  postContent,
  setPostContent,
  brandName,
  platforms
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const addEmoji = (emoji: string) => {
    setPostContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  return (
    <>
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-postpulse-blue rounded-full flex items-center justify-center text-white font-bold">
          {brandName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-sm">{brandName}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {platforms.filter(p => p.checked).map((platform) => (
              <div 
                key={platform.id}
                className="px-1.5 py-0.5 text-xs border rounded-sm"
                style={{ borderColor: platform.color }}
              >
                {platform.id === 'twitter' ? 'X' : platform.id.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content Input */}
      <div className="mb-4 relative">
        <Textarea
          placeholder="What would you like to share today?"
          className="min-h-[120px] text-base resize-none border-gray-200 focus:border-postpulse-blue w-full"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        
        <div className="flex justify-between items-center text-xs text-gray-500 mt-1.5">
          <div>
            {postContent.length > 0 && (
              <span className={cn(
                postContent.length > 280 ? "text-red-500" : "text-gray-500"
              )}>
                {postContent.length}/280
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:text-postpulse-blue">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" side="top">
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {EMOJI_SUGGESTIONS.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:text-postpulse-blue"
              onClick={() => setPostContent(prev => prev + ' #')}
            >
              <Hash className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:text-postpulse-blue"
              onClick={() => setPostContent(prev => prev + ' @')}
            >
              <AtSign className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:text-postpulse-blue"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentInput;
