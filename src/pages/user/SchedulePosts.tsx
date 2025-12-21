import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Trash2, Edit, Loader2, AlertCircle, Send } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import postsApi, { Post } from "@/services/postsApi";
import { aiApi } from "@/services/aiApi";

interface PostEditWithAIModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const PostEditWithAIModal = ({ post, isOpen, onClose, onUpdate }: PostEditWithAIModalProps) => {
  const [content, setContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (post) {
      setContent(post.content);
      loadAISuggestions(post);
    }
  }, [post]);

  const loadAISuggestions = async (currentPost: Post) => {
    setIsGeneratingAI(true);
    try {
      // Get AI suggestions based on previous posts
      const response = await aiApi.generateContent({
        topic: currentPost.content.substring(0, 100),
        platform: 'general',
        tone: 'professional',
        length: 'medium'
      });
      
      setAiSuggestions(response.variants || []);
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleUpdate = async () => {
    if (!post) return;
    
    setIsUpdating(true);
    try {
      await postsApi.updatePost(post.uuid, { content });
      toast.success("Post updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update post");
    } finally {
      setIsUpdating(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setContent(suggestion);
    toast.success("AI suggestion applied!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post with AI Assistance</DialogTitle>
          <DialogDescription>
            Edit your post and get AI-powered suggestions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Post</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-none"
              placeholder="Post content..."
            />
          </div>

          {isGeneratingAI ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Generating AI suggestions...</span>
            </div>
          ) : aiSuggestions.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">AI Suggestions</label>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, idx) => (
                  <Card key={idx} className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4" onClick={() => applySuggestion(suggestion)}>
                      <p className="text-sm">{suggestion}</p>
                      <Button size="sm" variant="ghost" className="mt-2">
                        Use This
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SchedulePosts = () => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [posts, setPosts] = useState<Post[]>([]);
  const [draftPosts, setDraftPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const [scheduled, drafts] = await Promise.all([
        postsApi.getScheduled(),
        postsApi.getDrafts()
      ]);
      setPosts(scheduled);
      setDraftPosts(drafts);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load posts");
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await postsApi.deletePost(uuid);
      toast.success("Post deleted successfully");
      loadPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete post");
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handlePublish = async (uuid: string) => {
    if (!confirm("Publish this post now?")) return;
    
    try {
      await postsApi.publishPost(uuid);
      toast.success("Post published successfully!");
      loadPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to publish post");
    }
  };

  // Function to get platform badge color
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "facebook":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "instagram":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      case "linkedin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Schedule Posts</h1>
          <p className="text-muted-foreground">Plan and schedule your social media content</p>
        </div>
        <ThemeToggle />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Scheduled Content</CardTitle>
              <CardDescription>Manage your upcoming posts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setView("list")} variant={view === "list" ? "default" : "outline"} size="sm">
                List
              </Button>
              <Button onClick={() => setView("calendar")} variant={view === "calendar" ? "default" : "outline"} size="sm">
                Calendar
              </Button>
              <Button className="ml-2 bg-postpulse-orange hover:bg-orange-600" onClick={() => navigate("/compose")}>
                Schedule New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                {view === "list" ? (
                  <div className="space-y-4">
                    {posts.length === 0 ? (
                      <div className="p-8 text-center">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Scheduled Posts</h3>
                        <p className="text-muted-foreground">Your upcoming scheduled posts will appear here.</p>
                        <Button className="mt-4" onClick={() => navigate("/compose")}>
                          Schedule Your First Post
                        </Button>
                      </div>
                    ) : (
                      posts.map(post => (
                        <Card key={post.uuid} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                              <div className="sm:w-32 flex-shrink-0">
                                <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                  <Calendar className="h-5 w-5 text-blue-500 mb-1" />
                                  {post.scheduled_at && (
                                    <>
                                      <span className="font-semibold">{format(parseISO(post.scheduled_at), "MMM d, yyyy")}</span>
                                      <span className="text-sm text-muted-foreground">{format(parseISO(post.scheduled_at), "h:mm a")}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                {post.platforms && post.platforms.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {post.platforms.map(platformObj => (
                                      <span 
                                        key={platformObj.id} 
                                        className={`text-xs px-2 py-1 rounded-full ${getPlatformColor(platformObj.platform)}`}
                                      >
                                        {platformObj.platform}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <p className="mb-4">{post.content}</p>
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => handleEdit(post)}>
                                    <Edit className="h-4 w-4" />
                                    <span>Edit</span>
                                  </Button>
                                  <Button size="sm" variant="destructive" className="flex items-center gap-1" onClick={() => handleDelete(post.uuid)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
              ) : (
                <div className="border rounded-lg">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b">
                    <div className="grid grid-cols-7 gap-1 text-center">
                      <div>Sun</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 p-4">
                    {Array.from({ length: 35 }).map((_, i) => {
                      const day = i - 3; // Start from previous month
                      return (
                        <div 
                          key={i}
                          className={`aspect-square p-1 ${
                            day > 0 && day <= 30 
                              ? "bg-white dark:bg-gray-950" 
                              : "bg-gray-50 dark:bg-gray-800 text-gray-400"
                          } border rounded flex flex-col items-center justify-start`}
                        >
                          <span className="text-xs">{day > 0 && day <= 30 ? day : ""}</span>
                          {day === 25 && (
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" title="Scheduled post"></div>
                          )}
                          {day === 26 && (
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" title="Scheduled post"></div>
                          )}
                          {day === 30 && (
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" title="Scheduled post"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              <div className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Past Posts</h3>
                <p className="text-muted-foreground">Your past scheduled posts will appear here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="draft">
              <div className="space-y-4">
                {draftPosts.length === 0 ? (
                  <div className="p-8 text-center">
                    <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Draft Posts</h3>
                    <p className="text-muted-foreground">Your draft posts will appear here.</p>
                  </div>
                ) : (
                  draftPosts.map(post => (
                    <Card key={post.uuid} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="sm:w-32 flex-shrink-0">
                            <div className="flex flex-col items-center justify-center bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                              <span className="font-semibold text-amber-600 dark:text-amber-400">DRAFT</span>
                              <span className="text-sm text-muted-foreground">Not scheduled</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            {post.platforms && post.platforms.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {post.platforms.map(platformObj => (
                                  <span 
                                    key={platformObj.id} 
                                    className={`text-xs px-2 py-1 rounded-full ${getPlatformColor(platformObj.platform)}`}
                                  >
                                    {platformObj.platform}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="mb-4">{post.content}</p>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" className="bg-postpulse-orange hover:bg-orange-600" onClick={() => handlePublish(post.uuid)}>
                                <Send className="h-4 w-4 mr-1" />
                                Publish Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
          )}
        </CardContent>
      </Card>

      <PostEditWithAIModal 
        post={editingPost}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPost(null);
        }}
        onUpdate={loadPosts}
      />
    </div>
  );
};

export default SchedulePosts;
