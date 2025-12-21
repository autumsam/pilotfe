import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Send, 
  Wand2, 
  PenLine, 
  Hash, 
  TrendingUp, 
  Calendar,
  Lightbulb,
  Zap,
  MessageSquare,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const suggestions = [
  { id: 1, icon: PenLine, title: "Write a post", description: "Generate engaging content" },
  { id: 2, icon: Hash, title: "Suggest hashtags", description: "Find trending hashtags" },
  { id: 3, icon: TrendingUp, title: "Analyze trends", description: "Discover what's popular" },
  { id: 4, icon: Calendar, title: "Best posting time", description: "Optimize your schedule" },
];

const chatHistory = [
  { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you create amazing content today?" },
];

const contentIdeas = [
  "Share a behind-the-scenes look at your creative process",
  "Create a poll asking your audience about their preferences",
  "Post a customer testimonial or success story",
  "Share tips related to your industry or niche",
  "Create a before/after showcase of your work",
];

const AiAssistant = () => {
  const [messages, setMessages] = useState(chatHistory);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [contentTopic, setContentTopic] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content: "That's a great idea! Based on your request, I'd suggest creating content that highlights your unique value proposition. Would you like me to draft something specific for you?",
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleGenerateContent = () => {
    if (!contentTopic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setGeneratedContent(`🚀 ${contentTopic}\n\nDid you know that mastering this topic can transform your social media presence? Here are 3 key insights:\n\n1. Consistency is key - post regularly to stay top of mind\n2. Engage authentically - respond to every comment\n3. Provide value - educate, entertain, or inspire\n\nWhat's your biggest challenge with ${contentTopic.toLowerCase()}? Let me know in the comments! 👇\n\n#ContentCreation #SocialMediaTips #GrowthMindset`);
      setIsLoading(false);
      toast.success("Content generated!");
    }, 2000);
  };

  const handleSuggestionClick = (title: string) => {
    setInput(`Help me ${title.toLowerCase()}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground">Your intelligent content creation companion</p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="generate" className="gap-2">
            <Wand2 className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="ideas" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Ideas
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3 border-border/50 shadow-sm">
              <CardContent className="p-0 flex flex-col h-[600px]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles className="h-4 w-4" />
                              <span className="text-sm font-medium">AI Assistant</span>
                            </div>
                          )}
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask me anything about content creation..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={isLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion.id}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-auto py-3"
                      onClick={() => handleSuggestionClick(suggestion.title)}
                    >
                      <suggestion.icon className="h-4 w-4 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-sm">{suggestion.title}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Generate Tab */}
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Content Generator
                </CardTitle>
                <CardDescription>
                  Enter a topic and let AI create engaging content for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter your topic (e.g., 'productivity tips')"
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setContentTopic("Social media growth")}>
                    Social media growth
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setContentTopic("Content marketing")}>
                    Content marketing
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setContentTopic("Brand building")}>
                    Brand building
                  </Badge>
                </div>
                <Button 
                  className="w-full gap-2" 
                  onClick={handleGenerateContent}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  Preview and edit your AI-generated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Your generated content will appear here..."
                  className="min-h-[250px] resize-none"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                />
                {generatedContent && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">
                      Copy
                    </Button>
                    <Button className="flex-1">
                      Use in Post
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ideas Tab */}
        <TabsContent value="ideas">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Content Ideas
              </CardTitle>
              <CardDescription>
                Get inspired with AI-powered content suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentIdeas.map((idea, index) => (
                  <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">{idea}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 gap-2">
                <RefreshCw className="h-4 w-4" />
                Generate More Ideas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiAssistant;
