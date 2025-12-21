import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  rating: number;
  avatar?: string;
}

const Testimonial = ({ quote, name, title, rating, avatar }: TestimonialProps) => (
  <Card className="border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
    <CardContent className="p-6 space-y-4 relative">
      {/* Quote icon */}
      <div className="absolute top-4 right-4">
        <Quote className="h-10 w-10 text-primary/10" />
      </div>
      
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        ))}
      </div>
      
      {/* Quote text */}
      <p className="text-foreground leading-relaxed relative z-10">"{quote}"</p>
      
      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Avatar className="h-11 w-11 border-2 border-primary/20">
          {avatar && <AvatarImage src={avatar} alt={name} />}
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "PostPulse transformed how we manage our social media. The AI suggestions are spot-on, and scheduling is effortless. Our engagement has increased by 150%.",
      name: "Sarah Johnson",
      title: "Marketing Director, TechCorp",
      rating: 5,
    },
    {
      quote: "The analytics dashboard gives us insights we never had before. We've increased our follower growth by 200% in just three months using their recommendations.",
      name: "Michael Chen",
      title: "Content Creator, 500K+ followers",
      rating: 5,
    },
    {
      quote: "Finally, a tool that actually saves time! The multi-platform posting feature alone saves me 10 hours every week. Worth every penny.",
      name: "Emma Davis",
      title: "Social Media Manager, StartupXYZ",
      rating: 5,
    },
    {
      quote: "The AI content generation is incredible. It understands my brand voice perfectly and creates engaging posts that resonate with my audience.",
      name: "James Wilson",
      title: "Founder, DigitalAgency",
      rating: 5,
    },
    {
      quote: "Best investment we've made for our social media strategy. The team collaboration features make managing multiple clients a breeze.",
      name: "Lisa Rodriguez",
      title: "Agency Owner",
      rating: 5,
    },
    {
      quote: "I was skeptical at first, but the results speak for themselves. Our engagement rate has tripled since we started using PostPulse.",
      name: "David Kim",
      title: "E-commerce Entrepreneur",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Loved by Creators
            <span className="block text-primary">Worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied users transforming their social media strategy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Testimonial {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;