import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface PlanProps {
  name: string;
  price: { monthly: string; yearly: string };
  description: string;
  features: string[];
  highlighted?: boolean;
  delay: number;
  isYearly: boolean;
}

const Plan = ({ name, price, description, features, highlighted = false, delay, isYearly }: PlanProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="relative animate-fade-in" style={{ animationDelay: `${delay}s` }}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
            <Sparkles className="h-3.5 w-3.5" />
            Most Popular
          </div>
        </div>
      )}
      <Card 
        className={`relative overflow-hidden h-full transition-all duration-300 hover:-translate-y-1 ${
          highlighted
            ? "border-primary shadow-xl scale-105 bg-gradient-to-b from-primary/5 to-background"
            : "border-border bg-card hover:border-primary/50 hover:shadow-lg"
        }`}
      >
        {highlighted && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        )}
        
        <CardHeader className="p-6 pb-4 relative">
          <h3 className="text-2xl font-bold mb-2 text-foreground">{name}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-foreground">
              {isYearly ? price.yearly : price.monthly}
            </span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="p-6 pt-2">
          <Button
            className={`w-full ${
              highlighted
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            }`}
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: { monthly: "$0", yearly: "$0" },
      description: "Perfect for beginners exploring social media management.",
      features: [
        "3 social media platforms",
        "Basic AI suggestions",
        "10 scheduled posts per month",
        "Basic analytics dashboard",
        "Email support"
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: { monthly: "$9", yearly: "$7" },
      description: "Everything you need to grow your social media presence.",
      features: [
        "10 social media platforms",
        "Advanced AI content generation",
        "Unlimited scheduled posts",
        "Comprehensive analytics",
        "Priority support",
        "Custom branding"
      ],
      highlighted: true,
    },
    {
      name: "Team",
      price: { monthly: "$29", yearly: "$23" },
      description: "Collaborate with your team for maximum impact.",
      features: [
        "Unlimited platforms",
        "Full AI suite",
        "Team collaboration tools",
        "Advanced reporting",
        "Dedicated account manager",
        "API access"
      ],
      highlighted: false,
    }
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${
                isYearly ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  isYearly ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
              <span className="ml-2 text-xs text-primary font-bold">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => (
            <Plan
              key={index}
              {...plan}
              delay={index * 0.1}
              isYearly={isYearly}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;