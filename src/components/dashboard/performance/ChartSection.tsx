
import React from "react";
import EngagementLineChart from "./EngagementLineChart";
import AiInsights from "./AiInsights";

const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div className="lg:col-span-2 w-full bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
        <EngagementLineChart />
      </div>
      <div className="w-full bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
        <AiInsights />
      </div>
    </div>
  );
};

export default ChartSection;
