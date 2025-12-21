
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Brain, Signal } from "lucide-react";
import SocialMediaSection from "./SocialMediaSection";
import AiApiSection from "./AiApiSection";
import PerformanceSection from "./PerformanceSection";
import { useMockData } from "@/hooks/use-api-stats-data";

interface ApiStatsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ApiStatsTabs: React.FC<ApiStatsTabsProps> = ({ activeTab, setActiveTab }) => {
  const { socialApiData, socialPlatformUsage, aiApiData, aiApiUsage, performanceData } = useMockData();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg shadow-sm">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Social Media</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI APIs</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Signal className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Social Media API Usage */}
      <TabsContent value="social">
        <SocialMediaSection socialApiData={socialApiData} socialPlatformUsage={socialPlatformUsage} />
      </TabsContent>
      
      {/* AI API Usage */}
      <TabsContent value="ai">
        <AiApiSection aiApiData={aiApiData} aiApiUsage={aiApiUsage} />
      </TabsContent>
      
      {/* API Performance */}
      <TabsContent value="performance">
        <PerformanceSection performanceData={performanceData} />
      </TabsContent>
    </Tabs>
  );
};

export default ApiStatsTabs;
