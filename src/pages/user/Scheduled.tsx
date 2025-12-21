import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  List, 
  Clock, 
  Edit, 
  Trash2, 
  Twitter, 
  Instagram, 
  Facebook,
  MoreVertical,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import postsApi, { Post } from "@/services/postsApi";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
};

const platformColors: Record<string, string> = {
  twitter: "bg-blue-500",
  instagram: "bg-pink-600",
  facebook: "bg-blue-700",
};

interface PostEditModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const PostEditModal = ({ post, isOpen, onClose, onUpdate }: PostEditModalProps) => {
  const [content, setContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content);
    }
  }, [post]);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your scheduled post
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] p-3 border rounded-md resize-none"
            placeholder="Post content..."
          />
          <div className="flex justify-end gap-2">
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

const Scheduled = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("list");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadScheduledPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const scheduledPosts = await postsApi.getScheduled();
      setPosts(scheduledPosts);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load posts");
      toast.error("Failed to load scheduled posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const postsForSelectedDate = posts.filter(
    post => post.scheduled_at && date && isSameDay(parseISO(post.scheduled_at), date)
  );

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await postsApi.deletePost(uuid);
      toast.success("Post deleted successfully");
      loadScheduledPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete post");
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Scheduled Posts</h1>
          <p className="text-muted-foreground">Manage your upcoming content</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
            <TabsList>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => navigate("/compose")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : view === "list" ? (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-12 text-center">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">No scheduled posts yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/compose")}
                >
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.uuid} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={post.status === "scheduled" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {post.status}
                        </Badge>
                        {post.scheduled_at && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {format(parseISO(post.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
                          </div>
                        )}
                      </div>
                      <p className="text-foreground mb-3 line-clamp-2">{post.content}</p>
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.hashtags.slice(0, 5).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {post.platforms && post.platforms.length > 0 && (
                        <div className="flex items-center gap-2">
                          {post.platforms.map((platformObj) => {
                            const Icon = platformIcons[platformObj.platform];
                            return Icon ? (
                              <div
                                key={platformObj.id}
                                className={`w-6 h-6 rounded-full ${platformColors[platformObj.platform]} flex items-center justify-center text-white`}
                              >
                                <Icon className="h-3 w-3" />
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(post)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(post.uuid)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-border/50 shadow-sm">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                modifiers={{
                  hasPost: posts.filter(p => p.scheduled_at).map(p => parseISO(p.scheduled_at!)),
                }}
                modifiersClassNames={{
                  hasPost: "bg-primary/20 text-primary font-bold",
                }}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {postsForSelectedDate.map((post) => (
                    <div key={post.uuid} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {post.scheduled_at && format(parseISO(post.scheduled_at), "h:mm a")}
                          </span>
                        </div>
                        {post.platforms && post.platforms.length > 0 && (
                          <div className="flex items-center gap-1">
                            {post.platforms.map((platformObj) => {
                              const Icon = platformIcons[platformObj.platform];
                              return Icon ? (
                                <div
                                  key={platformObj.id}
                                  className={`w-5 h-5 rounded-full ${platformColors[platformObj.platform]} flex items-center justify-center text-white`}
                                >
                                  <Icon className="h-2.5 w-2.5" />
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <p className="text-sm">{post.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No posts scheduled for this date</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/compose")}
                  >
                    Schedule a Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      <PostEditModal 
        post={editingPost}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPost(null);
        }}
        onUpdate={loadScheduledPosts}
      />
    </div>
  );
};

export default Scheduled;
