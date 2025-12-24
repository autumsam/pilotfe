import { ArrowRight, Sparkles, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Calendar, Clock, BarChart3, TrendingUp, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const HowItWorksSection = () => {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState([]);

  useEffect(() => {
    setIsVisible(true);

    // Mobile scroll animation observer
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(entry.target.dataset.stepIndex);
          if (!visibleSteps.includes(stepIndex)) {
            setVisibleSteps((prev) => [...prev, stepIndex]);
            // Auto-show animation on mobile
            if (window.innerWidth < 768) {
              setHoveredStep(stepIndex);
              setTimeout(() => {
                setHoveredStep(null);
              }, 2000);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    const stepElements = document.querySelectorAll('[data-step-index]');
    stepElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [visibleSteps]);

  const socialPlatforms = [
    { icon: Facebook, color: "#1877F2", name: "Facebook" },
    { icon: Twitter, color: "#1DA1F2", name: "Twitter" },
    { icon: Instagram, color: "#E4405F", name: "Instagram" },
    { icon: Linkedin, color: "#0A66C2", name: "LinkedIn" },
    { icon: Youtube, color: "#FF0000", name: "YouTube" },
    { icon: MessageCircle, color: "#25D366", name: "WhatsApp" },
  ];

  const scheduleIcons = [
    { icon: Calendar, name: "Calendar" },
    { icon: Clock, name: "Schedule" },
    { icon: Sparkles, name: "AI Content" },
    { icon: Zap, name: "Quick Post" },
  ];

  const analyticsIcons = [
    { icon: BarChart3, name: "Analytics" },
    { icon: TrendingUp, name: "Growth" },
    { icon: Target, name: "Goals" },
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Your Accounts",
      description: "Link your social media profiles in seconds with our secure integration. We support all major platforms.",
      animation: "social",
    },
    {
      number: "02",
      title: "Analyze & Grow",
      description: "Track performance metrics and refine your strategy with data-driven insights and AI recommendations.",
      animation: "analytics",
    },
    {
      number: "03",
      title: "Create & Schedule",
      description: "Craft engaging content or use AI assistance, then schedule posts for optimal times to maximize reach.",
      animation: "schedule",
    },
  ];

  const renderAnimation = (step, index) => {
    const isHovered = hoveredStep === index;

    if (step.animation === "social") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          {socialPlatforms.map((platform, i) => {
            const angle = (i / socialPlatforms.length) * 2 * Math.PI - Math.PI / 2;
            const radius = isHovered ? 65 : 0;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const Icon = platform.icon;
            
            return (
              <div
                key={i}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${isHovered ? 1 : 0})`,
                  opacity: isHovered ? 1 : 0,
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border border-slate-200"
                  title={platform.name}
                >
                  <Icon 
                    className="h-4 w-4" 
                    style={{ color: platform.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (step.animation === "schedule") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          {scheduleIcons.map((item, i) => {
            const angle = (i / scheduleIcons.length) * 2 * Math.PI - Math.PI / 2;
            const radius = isHovered ? 70 : 0;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const Icon = item.icon;
            
            return (
              <div
                key={i}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${isHovered ? 1 : 0}) rotate(${isHovered ? 0 : -180}deg)`,
                  opacity: isHovered ? 1 : 0,
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center"
                  title={item.name}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (step.animation === "analytics") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          {analyticsIcons.map((item, i) => {
            const angle = (i / analyticsIcons.length) * 2 * Math.PI - Math.PI / 2;
            const radius = isHovered ? 65 : 0;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const Icon = item.icon;
            
            return (
              <div
                key={i}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${isHovered ? 1 : 0})`,
                  opacity: isHovered ? 1 : 0,
                  transitionDelay: `${i * 70}ms`,
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center"
                  title={item.name}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
            );
          })}
          
          {/* Pulsing rings for analytics */}
          {isHovered && [0, 1, 2].map((ring) => (
            <div
              key={ring}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: `pulse-ring 2s ease-out infinite`,
                animationDelay: `${ring * 0.6}s`,
              }}
            >
              <div className="w-20 h-20 rounded-full border-2 border-blue-500/30" />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">How It Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Get Started in
            <span className="text-primary"> Minutes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to transform your social media presence
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary" />
            
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative"
                data-step-index={index}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="text-center space-y-4">
                  {/* Step number with animations */}
                  <div className="relative inline-flex items-center justify-center h-32">
                    {/* Animation layer */}
                    {renderAnimation(step, index)}
                    
                    {/* Main circle */}
                    <div className="relative inline-flex items-center justify-center">
                      <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
                        hoveredStep === index ? 'bg-primary/30 scale-110' : 'bg-primary/20'
                      }`} />
                      <div className={`relative h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg transition-all duration-300 ${
                        hoveredStep === index ? 'scale-110' : 'scale-100'
                      }`}>
                        <span className="text-2xl font-bold text-primary-foreground">{step.number}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="pt-4">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector line for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-8 mb-8">
                    <div className="w-0.5 h-12 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              size="lg"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;