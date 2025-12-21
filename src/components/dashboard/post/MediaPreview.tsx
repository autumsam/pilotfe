
import React from "react";
import { Button } from "@/components/ui/button";
import { MediaItem } from "./PostPreview";
import { cn } from "@/lib/utils";
import { Music, X } from "lucide-react";

interface MediaPreviewProps {
  mediaFiles: MediaItem[];
  removeMedia: (id: string) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ mediaFiles, removeMedia }) => {
  if (!mediaFiles.length) return null;
  
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">Media ({mediaFiles.length})</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {mediaFiles.map((media) => (
          <div key={media.id} className="relative group rounded-lg overflow-hidden aspect-square">
            {media.type === 'image' && (
              <img 
                src={media.preview} 
                alt="Media Preview" 
                className="w-full h-full object-cover" 
              />
            )}
            
            {media.type === 'video' && (
              <div className="bg-gray-900 w-full h-full flex items-center justify-center">
                <video 
                  src={media.preview} 
                  className="max-w-full max-h-full"
                  controls
                />
              </div>
            )}
            
            {media.type === 'audio' && (
              <div className={cn("w-full h-full flex items-center justify-center", media.background)}>
                <Music className="h-12 w-12 text-white" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              <Button 
                variant="destructive"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeMedia(media.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPreview;
