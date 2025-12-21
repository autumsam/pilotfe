import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PlatformData {
  platform: string;
  total_engagements: number;
  total_impressions: number;
  total_reach: number;
  avg_engagement_rate: number;
}

interface PlatformLineChartProps {
  platformData: PlatformData[];
  metric?: 'all' | 'engagements' | 'impressions' | 'reach';
}

const PlatformLineChart: React.FC<PlatformLineChartProps> = ({ 
  platformData, 
  metric = 'all' 
}) => {
  // Transform data for line chart
  const data = platformData.map(platform => ({
    name: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
    Engagements: platform.total_engagements,
    Impressions: platform.total_impressions,
    Reach: platform.total_reach,
    platform: platform.platform,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        No data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-2">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toString();
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          iconType="line"
        />
        
        {(metric === 'all' || metric === 'engagements') && (
          <Line 
            type="monotone" 
            dataKey="Engagements" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
        {(metric === 'all' || metric === 'impressions') && (
          <Line 
            type="monotone" 
            dataKey="Impressions" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
        {(metric === 'all' || metric === 'reach') && (
          <Line 
            type="monotone" 
            dataKey="Reach" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PlatformLineChart;
