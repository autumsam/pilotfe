
import React from "react";
import StatCard from "./StatCard";
import { Eye, Heart, Share2, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Reach" 
        value="5,432" 
        change={12} 
        icon={<Eye className="h-5 w-5" />} 
      />
      <StatCard 
        title="Engagement" 
        value="342 likes" 
        subtitle="Top post: 2 hours ago" 
        icon={<Heart className="h-5 w-5" />}
      />
      <StatCard 
        title="Shares" 
        value="89" 
        change={5}
        icon={<Share2 className="h-5 w-5" />}
      />
      <StatCard 
        title="Platforms Active" 
        value="4/5" 
        action={<Button size="sm" variant="outline" className="h-7 px-2 text-xs"><Plus className="h-3 w-3 mr-1" /> Connect TikTok</Button>}
        icon={<ExternalLink className="h-5 w-5" />}
      />
    </div>
  );
};

export default StatsGrid;
