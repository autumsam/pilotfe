import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertCircle, TrendingUp, Clock, Hash, RefreshCw } from "lucide-react";
import { aiApi, type AIInsight } from "@/services/aiApi";
import { toast } from "sonner";

interface AiInsightsProps {
  onRefresh?: (refreshFn: () => Promise<void>) => void;
}

const AiInsights: React.FC<AiInsightsProps> = ({ onRefresh }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    loadInsights();
    checkAIAvailability();
    
    // Set up refresh callback once on mount
    if (onRefresh) {
      onRefresh(handleRefresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAIAvailability = async () => {
    try {
      const availability = await aiApi.checkAvailability();
      setAiAvailable(availability.available);
    } catch (error) {
      console.error("Error checking AI availability:", error);
      setAiAvailable(false);
    }
  };

  const loadInsights = async (showToast = false) => {
    try {
      const isRefreshing = refreshing || loading;
      if (!isRefreshing) setLoading(true);
      
      const data = await aiApi.getInsights({ timeframe: 'year', limit: 5 });
      setInsights(data || []);
      
      if (showToast) {
        toast.success("Insights refreshed successfully!");
      }
    } catch (error) {
      console.error("Error loading AI insights:", error);
      setInsights([]);
      
      if (showToast) {
        toast.error("Failed to refresh insights");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInsights(true);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'timing':
        return Clock;
      case 'hashtag':
        return Hash;
      case 'engagement':
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'medium':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'low':
        return 'bg-gray-50 dark:bg-gray-900/20';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  if (!aiAvailable) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 p-3 md:p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <h4 className="font-medium text-xs md:text-sm text-amber-800 dark:text-amber-200">AI Features Not Available</h4>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 break-words">
              Configure AI API keys in Admin Settings to enable AI-powered insights and recommendations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 md:py-12">
        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-6 md:py-8 px-3 md:px-4">
        <Sparkles className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">No insights yet</p>
        <p className="text-xs text-muted-foreground break-words">
          Connect your social accounts and start posting to get AI-powered insights based on your real performance data!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {insights.map((insight) => {
        const Icon = getInsightIcon(insight.type);
        const colorClass = getImpactColor(insight.impact);

        return (
          <div key={insight.id} className={`p-3 rounded-lg border border-border ${colorClass}`}>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="bg-primary/10 rounded-full p-1.5 md:p-2 mt-0.5 flex-shrink-0">
                <Icon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-xs md:text-sm text-foreground break-words">
                    {insight.title}
                  </h4>
                  {insight.impact && (
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      insight.impact === 'high' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      insight.impact === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {insight.impact}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 md:mt-2 break-words">
                  {insight.description}
                </p>
                {insight.action && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 mt-2 text-xs text-primary hover:text-primary/80"
                    onClick={() => toast.info(insight.action)}
                  >
                    {insight.action}
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AiInsights;