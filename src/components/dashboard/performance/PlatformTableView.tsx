import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PlatformData {
  platform: string;
  total_engagements: number;
  total_impressions: number;
  total_reach: number;
  avg_engagement_rate: number;
}

interface PlatformTableViewProps {
  platformData: PlatformData[];
}

const PLATFORM_COLORS: { [key: string]: string } = {
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#000000',
  threads: '#000000',
};

const PlatformTableView: React.FC<PlatformTableViewProps> = ({ platformData }) => {
  if (platformData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground py-8">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Platform</TableHead>
            <TableHead className="text-right">Engagements</TableHead>
            <TableHead className="text-right">Impressions</TableHead>
            <TableHead className="text-right">Reach</TableHead>
            <TableHead className="text-right">Eng. Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {platformData.map((platform) => (
            <TableRow key={platform.platform} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ 
                      backgroundColor: PLATFORM_COLORS[platform.platform.toLowerCase()] || '#888' 
                    }}
                  />
                  <span className="capitalize">{platform.platform}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {platform.total_engagements.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {platform.total_impressions.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {platform.total_reach.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <span className="font-medium">
                    {(platform.avg_engagement_rate * 100).toFixed(2)}%
                  </span>
                  {platform.avg_engagement_rate > 0.03 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : platform.avg_engagement_rate > 0.01 ? (
                    <TrendingUp className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlatformTableView;
