
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";

interface HashtagSuggestionsProps {
  postContent: string;
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
  hashtagSuggestions: string[];
}

const HashtagSuggestions: React.FC<HashtagSuggestionsProps> = ({
  postContent,
  setPostContent,
  hashtagSuggestions
}) => {
  if (!postContent.includes('#')) return null;
  
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-2 flex items-center">
        <Hash className="h-3.5 w-3.5 mr-1" /> 
        Suggested Hashtags
      </p>
      <div className="flex flex-wrap gap-2">
        {hashtagSuggestions.map((tag) => (
          <Badge 
            key={tag}
            variant="secondary"
            className="cursor-pointer hover:bg-gray-200"
            onClick={() => setPostContent(prev => `${prev} ${tag}`)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default HashtagSuggestions;
