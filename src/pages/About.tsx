import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Zap, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Mission-Driven",
      description: "We're committed to empowering creators with tools that make social media management effortless.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User-Focused",
      description: "Every feature we build is designed with our users' needs and feedback at the forefront.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Innovation First",
      description: "We continuously evolve our platform with cutting-edge AI and automation technologies.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Community Powered",
      description: "We believe in building strong relationships and supporting our creator community.",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                About PostPulse
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                We're on a mission to simplify social media management for creators, brands, and businesses of all sizes.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  PostPulse was born from a simple observation: managing multiple social media accounts shouldn't be complicated. 
                  In 2023, our founders—experienced content creators themselves—recognized the growing challenge of maintaining 
                  a consistent and engaging presence across various platforms.
                </p>
                <p>
                  What started as a side project to automate their own workflows quickly evolved into a comprehensive platform 
                  that now serves thousands of creators worldwide. We've built PostPulse to be the tool we wished existed when 
                  we were struggling with scattered spreadsheets and multiple platform logins.
                </p>
                <p>
                  Today, PostPulse combines powerful AI technology with intuitive design to help creators focus on what they 
                  do best: creating amazing content. We're proud to be part of your journey to social media success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Join Our Growing Community
              </h2>
              <p className="text-lg text-muted-foreground">
                Start your journey with PostPulse today and experience the future of social media management.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full"
                onClick={() => navigate("/login")}
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
