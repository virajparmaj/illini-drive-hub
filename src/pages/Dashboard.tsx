import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, User, LogOut } from "lucide-react";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setUserName(profile.name || profile.email.split("@")[0]);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CarlessCrew</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Welcome, {userName}!</h2>
            <p className="text-muted-foreground">
              Choose what you'd like to do today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Guide Card */}
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate("/guide")}>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <BookOpen className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Start License Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow our comprehensive step-by-step guide to getting your Illinois driver's license
                  </p>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90">
                  View Guide
                </Button>
              </div>
            </Card>

            {/* Buddies Card */}
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate("/buddies")}>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Find a DMV Buddy</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with students who have cars or need help for their DMV test
                  </p>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90">
                  Browse Posts
                </Button>
              </div>
            </Card>

            {/* Appointments Card */}
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate("/appointments")}>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">DMV Appointment Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Set preferences and get notified when DMV appointments become available
                  </p>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90">
                  Manage Alerts
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;