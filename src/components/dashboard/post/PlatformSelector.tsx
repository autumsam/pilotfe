
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PlatformType {
  id: string;
  name: string;
  color: string;
  checked: boolean;
}

interface PlatformSelectorProps {
  platforms: PlatformType[];
  togglePlatform: (platformId: string) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ platforms, togglePlatform }) => {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-medium mb-2">Post to:</h3>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Badge 
            key={platform.id}
            style={{ 
              backgroundColor: platform.checked ? platform.color : 'transparent',
              color: platform.checked ? 'white' : 'inherit',
              borderColor: platform.color
            }}
            className={cn(
              "cursor-pointer border hover:bg-opacity-90 transition-all", 
              !platform.checked && "bg-transparent text-gray-700"
            )}
            onClick={() => togglePlatform(platform.id)}
          >
            {platform.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;
