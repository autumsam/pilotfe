import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PlatformData {
  platform: string;
  total_engagements: number;
  total_impressions: number;
  total_reach: number;
  avg_engagement_rate: number;
}

interface PlatformPieChartProps {
  platformData: PlatformData[];
  metric?: 'engagements' | 'impressions' | 'reach';
}

const PLATFORM_COLORS: { [key: string]: string } = {
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#000000',
  threads: '#000000',
};

const PlatformPieChart: React.FC<PlatformPieChartProps> = ({ 
  platformData, 
  metric = 'engagements' 
}) => {
  // Transform data for pie chart
  const data = platformData.map(platform => ({
    name: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
    value: metric === 'engagements' 
      ? platform.total_engagements 
      : metric === 'impressions'
      ? platform.total_impressions
      : platform.total_reach,
    platform: platform.platform,
  })).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        No data available
      </div>
    );
  }

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
    return `${percent}%`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
          strokeWidth={2}
          stroke="hsl(var(--background))"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={PLATFORM_COLORS[entry.platform.toLowerCase()] || `hsl(${index * 60}, 70%, 50%)`}
              className="hover:opacity-80 transition-opacity"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          formatter={(value: number) => [value.toLocaleString(), 'Total']}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          wrapperStyle={{
            fontSize: '12px',
            paddingTop: '10px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PlatformPieChart;