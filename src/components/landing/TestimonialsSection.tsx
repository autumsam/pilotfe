import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  rating: number;
  avatar?: string;
}

const Testimonial = ({ quote, name, title, rating, avatar }: TestimonialProps) => (
  <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm h-full flex flex-col">
    <CardContent className="p-8 flex flex-col flex-1">
      {/* Modern opening quote decoration – subtle, elegant line */}
      <div className="mb-5 h-1 w-12 bg-primary rounded-full" />

      <p className="text-gray-700 dark:text-gray-200 leading-relaxed flex-1 text-base italic">
        {quote}
      </p>

      <div className="flex gap-1 mt-6">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
            {name.split(" ").map((n) => n[0].toUpperCase()).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TestimonialsSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const testimonials = [
    {
      quote: "PostPulse transformed how we manage our social media. The AI suggestions are spot-on, and scheduling is effortless. Our engagement has increased by 150%.",
      name: "Sarah Johnson",
      title: "Marketing Director, TechCorp",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      quote: "The analytics dashboard gives us insights we never had before. We've increased our follower growth by 200% in just three months.",
      name: "Michael Chen",
      title: "Content Creator, 500K+ followers",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      quote: "Finally, a tool that actually saves time! The multi-platform posting feature saves me hours every week.",
      name: "Emma Davis",
      title: "Social Media Manager, StartupXYZ",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      quote: "The AI content generation understands my brand voice perfectly and creates posts that truly resonate with my audience.",
      name: "James Wilson",
      title: "Founder, DigitalAgency",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
    {
      quote: "Best investment for our social media strategy. The collaboration features make managing multiple clients seamless.",
      name: "Lisa Rodriguez",
      title: "Agency Owner",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1554151228-14d9def65654?w=400&h=400&fit=crop",
    },
    {
      quote: "Our engagement rate has tripled since starting with PostPulse. The results speak for themselves.",
      name: "David Kim",
      title: "E-commerce Entrepreneur",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    },
  ];

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  // Pause auto-scroll on user interaction (hover/touch)
  const handleUserInteraction = () => {
    api?.scrollNext(); // optional: allow one manual advance
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by Creators
            <span className="block text-primary">Worldwide</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Hear from thousands of users transforming their social media presence
          </p>
        </div>

        {/* Clean modern carousel with auto-scroll */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
          onMouseEnter={() => api?.plugins().autoplay?.stop()}
          onMouseLeave={() => api?.plugins().autoplay?.play?.()} // if using autoplay plugin; fallback is our interval
          onTouchStart={() => api?.plugins().autoplay?.stop()}
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                onMouseDown={handleUserInteraction}
                onTouchStart={handleUserInteraction}
              >
                <Testimonial {...testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Minimal arrows – hidden on small screens */}
          <CarouselPrevious className="hidden sm:flex -left-12 h-10 w-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700" />
          <CarouselNext className="hidden sm:flex -right-12 h-10 w-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700" />

          {/* Clean modern dot indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i + 1 === current
                    ? "w-8 bg-primary"
                    : "w-1.5 bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;