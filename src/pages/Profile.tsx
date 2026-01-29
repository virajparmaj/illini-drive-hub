import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Mail, User as UserIcon, Award, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type Profile = {
  name: string | null;
  email: string;
  has_license: boolean;
};

type BuddyPost = {
  id: string;
  type: string;
  dmv_location: string;
  test_date: string;
  time_window: string;
  details: string | null;
  is_active: boolean;
  created_at: string;
};

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myPosts, setMyPosts] = useState<BuddyPost[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [hasLicense, setHasLicense] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setName(data.name || "");
      setHasLicense(data.has_license);
    } catch (error: any) {
      toast.error("Failed to load profile");
    }
  };

  const fetchMyPosts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from("buddy_posts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyPosts(data || []);
    } catch (error: any) {
      toast.error("Failed to load posts");
    }
  };

  const handleUpdateProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          has_license: hasLicense,
        })
        .eq("user_id", session.user.id);

      if (error) throw error;
      
      toast.success("Profile updated!");
      setEditMode(false);
      fetchProfile();
    } catch (error: any) {
      toast.error("Failed to update profile");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("buddy_posts")
        .update({ is_active: false })
        .eq("id", postId);

      if (error) throw error;
      
      toast.success("Post removed");
      fetchMyPosts();
    } catch (error: any) {
      toast.error("Failed to remove post");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Info */}
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Profile Information</h2>
              {!editMode && (
                <Button onClick={() => setEditMode(true)} variant="outline">
                  Edit
                </Button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Have License?</label>
                    <p className="text-xs text-muted-foreground">
                      Let others know if you've already passed
                    </p>
                  </div>
                  <Switch
                    checked={hasLicense}
                    onCheckedChange={setHasLicense}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleUpdateProfile} className="bg-accent hover:bg-accent/90">
                    Save Changes
                  </Button>
                  <Button onClick={() => setEditMode(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{profile.name || "Not set"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">License Status</p>
                    <p className="font-medium">
                      {profile.has_license ? "Licensed ✓" : "Working on it"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* My Buddy Posts */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Buddy Posts</h2>
            {myPosts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                You haven't created any posts yet
              </p>
            ) : (
              <div className="space-y-4">
                {myPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-4 border rounded-lg ${
                      !post.is_active ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              post.type === "NEED_HELP"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {post.type === "NEED_HELP" ? "Need Help" : "Can Help"}
                          </span>
                          {!post.is_active && (
                            <span className="text-xs text-muted-foreground">(Inactive)</span>
                          )}
                        </div>
                        <p className="text-sm font-medium">
                          {post.dmv_location} • {format(new Date(post.test_date), "MMM d")} •{" "}
                          {post.time_window}
                        </p>
                        {post.details && (
                          <p className="text-sm text-muted-foreground">{post.details}</p>
                        )}
                      </div>
                      {post.is_active && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Links */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/appointments")}
              >
                Manage Appointment Alerts
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/buddies")}
              >
                View Buddy Board
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;