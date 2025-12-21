
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ApiStatsTabs from "@/components/api-stats/ApiStatsTabs";

const ApiStats = () => {
  const { category = "social" } = useParams();
  const [activeTab, setActiveTab] = useState<string>(category);
  
  useEffect(() => {
    if (category) {
      setActiveTab(category);
    }
  }, [category]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">API Usage Statistics</h1>
        <p className="text-muted-foreground">
          Monitor your API usage across all platforms and services.
        </p>
      </div>
      
      <ApiStatsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default ApiStats;
