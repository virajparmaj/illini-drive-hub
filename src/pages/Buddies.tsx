import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Filter, MapPin, Calendar, Clock, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type BuddyPost = {
  id: string;
  type: string;
  dmv_location: string;
  test_date: string;
  time_window: string;
  details: string | null;
  created_at: string;
  profiles: {
    email: string;
    name: string | null;
  } | null;
};

const Buddies = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BuddyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    type: "NEED_HELP",
    dmv_location: "",
    test_date: "",
    time_window: "",
    details: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("buddy_posts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Fetch profiles separately
      if (postsData && postsData.length > 0) {
        const userIds = postsData.map(post => post.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("user_id, email, name")
          .in("user_id", userIds);

        if (profilesError) throw profilesError;

        // Combine data
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(p => p.user_id === post.user_id) || null,
        }));

        setPosts(postsWithProfiles);
      } else {
        setPosts([]);
      }
    } catch (error: any) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { error } = await supabase.from("buddy_posts").insert({
        user_id: session.user.id,
        ...formData,
      });

      if (error) throw error;
      
      toast.success("Post created successfully!");
      setShowForm(false);
      setFormData({
        type: "NEED_HELP",
        dmv_location: "",
        test_date: "",
        time_window: "",
        details: "",
      });
      fetchPosts();
    } catch (error: any) {
      toast.error("Failed to create post");
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filterType === "all") return true;
    return post.type === filterType;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">DMV Buddy Board</h1>
          <p className="text-primary-foreground/80 mt-2">
            Connect with students who can help or need help
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Disclaimer */}
          <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-100">Important Disclaimer</p>
                <p className="text-amber-800 dark:text-amber-200">
                  This is a peer-to-peer coordination board. CarlessCrew does not verify users, cars, insurance, or driving skills. 
                  Users are solely responsible for their arrangements. No payments should be made through this platform.
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="NEED_HELP">Need Help</SelectItem>
                  <SelectItem value="CAN_HELP">Can Help</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-accent hover:bg-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>

          {/* Create Form */}
          {showForm && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Create New Post</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEED_HELP">I need help / a car</SelectItem>
                      <SelectItem value="CAN_HELP">I can help / have a car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">DMV Location</label>
                    <Select
                      value={formData.dmv_location}
                      onValueChange={(value) => setFormData({ ...formData, dmv_location: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Champaign DMV">Champaign DMV</SelectItem>
                        <SelectItem value="Urbana DMV">Urbana DMV</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Test Date</label>
                    <Input
                      type="date"
                      value={formData.test_date}
                      onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Window</label>
                  <Select
                    value={formData.time_window}
                    onValueChange={(value) => setFormData({ ...formData, time_window: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Afternoon">Afternoon</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Details</label>
                  <Textarea
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Provide additional details..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    Post
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading posts...</p>
            ) : filteredPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No posts yet. Be the first to create one!</p>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.type === "NEED_HELP"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          }`}
                        >
                          {post.type === "NEED_HELP" ? "Need Help" : "Can Help"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Posted {format(new Date(post.created_at), "MMM d, yyyy")}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{post.dmv_location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span>{format(new Date(post.test_date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent" />
                          <span>{post.time_window}</span>
                        </div>
                      </div>

                      {post.details && (
                        <p className="text-sm text-muted-foreground">{post.details}</p>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Mail className="w-4 h-4 text-accent" />
                        <a
                          href={`mailto:${post.profiles?.email}`}
                          className="text-sm text-accent hover:underline"
                        >
                          Contact: {post.profiles?.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buddies;