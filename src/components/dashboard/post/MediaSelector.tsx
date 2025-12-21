
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video, Music, Palette, X } from "lucide-react";
import { MediaItem } from "./PostPreview";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-mobile";

interface MediaSelectorProps {
  mediaTab: 'photo' | 'video' | 'audio' | 'text';
  setMediaTab: (tab: 'photo' | 'video' | 'audio' | 'text') => void;
  mediaFiles: MediaItem[];
  setMediaFiles: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  handleMediaUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => void;
  setShowAudioSelection: React.Dispatch<React.SetStateAction<boolean>>;
  showAudioSelection: boolean;
  audioTracks: Array<{id: string, name: string, artist: string, duration: string}>;
  selectedBackgroundIdx: number;
  setSelectedBackgroundIdx: React.Dispatch<React.SetStateAction<number>>;
  mediaBackgrounds: string[];
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  addAudioTrack: (trackName: string) => void;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  mediaTab,
  setMediaTab,
  mediaFiles,
  setMediaFiles,
  handleMediaUpload,
  setShowAudioSelection,
  showAudioSelection,
  audioTracks,
  selectedBackgroundIdx,
  setSelectedBackgroundIdx,
  mediaBackgrounds,
  setShowPreview,
  addAudioTrack
}) => {
  const breakpoint = useBreakpoint();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="mb-2 border-t border-b py-2">
      <div className="flex justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap">
          <Button 
            variant={mediaTab === 'photo' ? "secondary" : "ghost"} 
            size="sm" 
            className="rounded-full px-3 whitespace-nowrap"
            onClick={() => setMediaTab('photo')}
          >
            <Camera className="h-4 w-4 mr-1" /> Photo
          </Button>
          
          <Button 
            variant={mediaTab === 'video' ? "secondary" : "ghost"} 
            size="sm" 
            className="rounded-full px-3 whitespace-nowrap"
            onClick={() => setMediaTab('video')}
          >
            <Video className="h-4 w-4 mr-1" /> Video
          </Button>
          
          <Button 
            variant={mediaTab === 'audio' ? "secondary" : "ghost"} 
            size="sm" 
            className="rounded-full px-3 whitespace-nowrap"
            onClick={() => setMediaTab('audio')}
          >
            <Music className="h-4 w-4 mr-1" /> Audio
          </Button>
          
          {breakpoint !== 'mobile' && (
            <Button 
              variant={mediaTab === 'text' ? "secondary" : "ghost"} 
              size="sm" 
              className="rounded-full px-3 whitespace-nowrap"
              onClick={() => setMediaTab('text')}
            >
              <Palette className="h-4 w-4 mr-1" /> Text Style
            </Button>
          )}
        </div>
        
        {mediaFiles.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setMediaFiles([]);
              setShowPreview(false);
            }}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 whitespace-nowrap"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div className="mt-3">
        {mediaTab === 'photo' && (
          <div className="flex flex-col items-center border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-postpulse-blue transition-colors cursor-pointer" 
            onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => handleMediaUpload(e, 'image')}
            />
            <Camera className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium">Click to upload photos</p>
            <p className="text-xs text-gray-500">or drag and drop</p>
          </div>
        )}
        
        {mediaTab === 'video' && (
          <div className="flex flex-col items-center border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-postpulse-blue transition-colors cursor-pointer" 
            onClick={() => videoInputRef.current?.click()}>
            <input 
              type="file" 
              ref={videoInputRef} 
              className="hidden" 
              accept="video/*" 
              onChange={(e) => handleMediaUpload(e, 'video')}
            />
            <Video className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium">Click to upload videos</p>
            <p className="text-xs text-gray-500">or drag and drop (max 60 seconds)</p>
          </div>
        )}
        
        {mediaTab === 'audio' && (
          <div className="space-y-3">
            <div className="flex flex-col items-center border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-postpulse-blue transition-colors cursor-pointer" 
              onClick={() => audioInputRef.current?.click()}>
              <input 
                type="file" 
                ref={audioInputRef} 
                className="hidden" 
                accept="audio/*" 
                onChange={(e) => handleMediaUpload(e, 'audio')}
              />
              <Music className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium">Click to upload audio</p>
              <p className="text-xs text-gray-500">or select from trending</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAudioSelection(!showAudioSelection)}
            >
              <Music className="mr-2 h-4 w-4" /> 
              Select Trending Track
            </Button>
            
            {showAudioSelection && (
              <div className="border rounded-lg mt-2 max-h-[200px] overflow-y-auto">
                {audioTracks.map((track) => (
                  <div 
                    key={track.id}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => addAudioTrack(track.name)}
                  >
                    <div>
                      <p className="text-sm font-medium">{track.name}</p>
                      <p className="text-xs text-gray-500">{track.artist}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs">{track.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">Select background</p>
              <div className="flex flex-wrap gap-2">
                {mediaBackgrounds.map((bg, idx) => (
                  <button 
                    key={idx}
                    className={cn(
                      "h-8 w-8 rounded-full border-2", 
                      bg,
                      selectedBackgroundIdx === idx ? "border-black" : "border-transparent"
                    )}
                    onClick={() => setSelectedBackgroundIdx(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {mediaTab === 'text' && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Style your post text</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {mediaBackgrounds.map((bg, idx) => (
                <button 
                  key={idx}
                  className={cn(
                    "h-12 rounded-lg text-white font-medium flex items-center justify-center",
                    bg,
                  )}
                >
                  Text Style {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSelector;
