import { Check, Sparkles, ChevronRight, Zap, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface PlanProps {
  name: string;
  price: { monthly: string; yearly: string };
  description: string;
  features: string[];
  highlighted?: boolean;
  isYearly: boolean;
  icon?: React.ReactNode;
}

const Plan = ({ name, price, description, features, highlighted = false, isYearly, icon }: PlanProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="relative h-full">
      {highlighted && (
        <div className="absolute -top-3 left-0 right-0 z-10 flex justify-center">
          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg animate-pulse-slow">
            <Sparkles className="h-3.5 w-3.5" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <Card 
        className={`relative overflow-hidden h-full transition-all duration-500 hover:shadow-2xl border-2 ${
          highlighted
            ? "border-primary bg-gradient-to-b from-primary/5 via-background to-background shadow-xl md:scale-[1.02]"
            : "border-border/50 bg-card hover:border-primary/30"
        } group`}
      >
        {/* Gradient Background Effect */}
        {highlighted && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        )}
        
        {/* Glow Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          highlighted ? "bg-gradient-to-r from-primary/10 to-accent/10" : "bg-gradient-to-r from-primary/5 to-primary/2"
        }`} />

        <CardHeader className="p-6 pb-4 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {icon}
            </div>
            {isYearly && (
              <Badge variant="outline" className="bg-primary/10 text-primary text-xs font-semibold">
                Save 20%
              </Badge>
            )}
          </div>
          
          <h3 className="text-2xl font-bold mb-3 text-foreground">{name}</h3>
          
          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">
                {isYearly ? price.yearly : price.monthly}
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            {isYearly && price.yearly !== price.monthly && (
              <p className="text-sm text-muted-foreground mt-1">
                billed annually • ${parseInt(price.yearly.replace('$', '')) * 12}/year
              </p>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </CardHeader>

        <CardContent className="p-6 pt-2 relative z-10">
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm mb-2">Features include:</h4>
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 group/feature">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/feature:scale-110 transition-transform">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover/feature:text-foreground transition-colors">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-4 relative z-10">
          <Button
            className={`w-full h-12 group/btn ${
              highlighted
                ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:border-primary/50"
            } transition-all duration-300`}
            onClick={() => navigate("/login")}
          >
            <span>Get Started</span>
            <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const plans = [
    {
      name: "Starter",
      price: { monthly: "$0", yearly: "$0" },
      description: "Perfect for individuals just starting with social media management.",
      features: [
        "3 social media platforms",
        "Basic AI content suggestions",
        "Up to 50 scheduled posts per month",
        "Basic analytics dashboard",
        "Community support",
        "7-day data retention"
      ],
      highlighted: false,
      icon: <Zap className="h-5 w-5 text-primary" />
    },
    {
      name: "Pro",
      price: { monthly: "$19", yearly: "$15" },
      description: "For growing businesses and serious content creators.",
      features: [
        "10 social media platforms",
        "Advanced AI content generation",
        "Unlimited scheduled posts",
        "Comprehensive analytics & insights",
        "Priority email & chat support",
        "Custom branding",
        "Advanced scheduling",
        "30-day data retention"
      ],
      highlighted: true,
      icon: <Crown className="h-5 w-5 text-primary" />
    },
    {
      name: "Team",
      price: { monthly: "$49", yearly: "$39" },
      description: "Collaborate with your team for maximum social impact.",
      features: [
        "Unlimited platforms & accounts",
        "Full AI suite with custom models",
        "Team collaboration tools",
        "White-label reporting",
        "Dedicated account manager",
        "API access & webhooks",
        "Custom integrations",
        "90-day data retention",
        "Advanced security features"
      ],
      highlighted: false,
      icon: <Users className="h-5 w-5 text-primary" />
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 md:w-[500px] md:h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 md:w-[500px] md:h-[500px] bg-accent/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Pricing Plans</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Simple, Transparent
            <span className="block text-primary mt-2">Pricing for Everyone</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Start with our free plan and upgrade as you grow. All paid plans include a 14-day free trial.
            No credit card required to start.
          </p>

          {/* Billing Toggle - Mobile Optimized */}
          <div className="pt-6 md:pt-8">
            <div className="inline-flex items-center justify-between md:justify-center bg-muted/50 backdrop-blur-sm rounded-2xl p-1.5 w-full max-w-xs mx-auto">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  !isYearly 
                    ? "bg-background shadow-lg text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isYearly 
                    ? "bg-background shadow-lg text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <Badge className="bg-primary text-primary-foreground text-xs py-0.5 px-2">
                  Save 20%
                </Badge>
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Switch between monthly and yearly billing. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`transition-all duration-500 ${
                index === 1 
                  ? "lg:-translate-y-4" 
                  : "lg:translate-y-4"
              }`}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <Plan
                {...plan}
                isYearly={isYearly}
              />
            </div>
          ))}
        </div>

        {/* FAQ/Additional Info */}
        <div className="mt-16 md:mt-24 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>No setup fees</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>14-day free trial</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Free migration assistance</span>
            </div>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            Need a custom plan?{" "}
            <Button variant="link" className="text-primary p-0 h-auto font-semibold">
              Contact our sales team
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;