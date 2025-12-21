import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BarChart3, Zap, Users, Sparkles, Target, Globe, Clock } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="group border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card hover:-translate-y-1">
    <CardContent className="p-6 space-y-4">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <Calendar className="h-7 w-7" />,
      title: "Smart Scheduling",
      description: "Plan and schedule your content across multiple platforms with AI-powered timing suggestions for maximum engagement.",
    },
    {
      icon: <BarChart3 className="h-7 w-7" />,
      title: "Advanced Analytics",
      description: "Track performance metrics in real-time and gain actionable insights to optimize your content strategy.",
    },
    {
      icon: <Sparkles className="h-7 w-7" />,
      title: "AI Content Assistant",
      description: "Generate engaging captions, hashtags, and content ideas powered by cutting-edge AI technology.",
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Audience Insights",
      description: "Understand your audience with detailed demographic data, engagement patterns, and growth metrics.",
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: "Multi-Platform Publishing",
      description: "Post to all your social media accounts simultaneously with platform-specific optimizations.",
    },
    {
      icon: <Target className="h-7 w-7" />,
      title: "Campaign Tracking",
      description: "Monitor your campaigns end-to-end and measure ROI with comprehensive tracking and reporting tools.",
    },
    {
      icon: <Clock className="h-7 w-7" />,
      title: "Optimal Timing",
      description: "AI analyzes your audience behavior to suggest the best times to post for maximum reach and engagement.",
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Instant Publishing",
      description: "One-click publishing across all connected platforms with automatic format optimization.",
    },
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Everything You Need to
            <span className="block text-primary">Succeed on Social</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools designed to streamline your workflow and amplify your social media presence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;