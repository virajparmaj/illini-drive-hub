import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type AppointmentReport = {
  id: string;
  dmv_location: string;
  appointment_date: string;
  time_observed: string;
  notes: string | null;
  profiles: {
    email: string;
  } | null;
};

const Appointments = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<AppointmentReport[]>([]);
  const [preferences, setPreferences] = useState({
    start_date: "",
    end_date: "",
    receive_emails: true,
  });
  const [hasPreferences, setHasPreferences] = useState(false);
  
  const [reportForm, setReportForm] = useState({
    dmv_location: "",
    appointment_date: "",
    notes: "",
  });
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchPreferences();
  }, []);

  const fetchReports = async () => {
    try {
      const { data: reportsData, error: reportsError } = await supabase
        .from("appointment_reports")
        .select("*")
        .order("time_observed", { ascending: false })
        .limit(20);

      if (reportsError) throw reportsError;

      // Fetch profiles separately
      if (reportsData && reportsData.length > 0) {
        const userIds = reportsData.map(report => report.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("user_id, email")
          .in("user_id", userIds);

        if (profilesError) throw profilesError;

        // Combine data
        const reportsWithProfiles = reportsData.map(report => ({
          ...report,
          profiles: profilesData?.find(p => p.user_id === report.user_id) || null,
        }));

        setReports(reportsWithProfiles);
      } else {
        setReports([]);
      }
    } catch (error: any) {
      toast.error("Failed to load reports");
    }
  };

  const fetchPreferences = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from("appointment_preferences")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setPreferences({
          start_date: data.start_date,
          end_date: data.end_date,
          receive_emails: data.receive_emails,
        });
        setHasPreferences(true);
      }
    } catch (error: any) {
      console.error("Error fetching preferences:", error);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { error } = await supabase
        .from("appointment_preferences")
        .upsert({
          user_id: session.user.id,
          ...preferences,
        });

      if (error) throw error;
      
      toast.success("Preferences saved!");
      setHasPreferences(true);
    } catch (error: any) {
      toast.error("Failed to save preferences");
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { error } = await supabase.from("appointment_reports").insert({
        user_id: session.user.id,
        ...reportForm,
      });

      if (error) throw error;
      
      toast.success("Report submitted!");
      setShowReportForm(false);
      setReportForm({
        dmv_location: "",
        appointment_date: "",
        notes: "",
      });
      fetchReports();
    } catch (error: any) {
      toast.error("Failed to submit report");
    }
  };

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
          <h1 className="text-3xl font-bold">DMV Appointment Alerts</h1>
          <p className="text-primary-foreground/80 mt-2">
            Track when DMV appointments become available
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* My Preferences */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Alert Preferences</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Set your date range to get notified when other students report open appointments
            </p>
            
            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Earliest Date</label>
                  <Input
                    type="date"
                    value={preferences.start_date}
                    onChange={(e) =>
                      setPreferences({ ...preferences, start_date: e.target.value })
                    }
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Latest Date</label>
                  <Input
                    type="date"
                    value={preferences.end_date}
                    onChange={(e) =>
                      setPreferences({ ...preferences, end_date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emails"
                  checked={preferences.receive_emails}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, receive_emails: checked as boolean })
                  }
                />
                <label
                  htmlFor="emails"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email me when someone reports open appointments in this window
                </label>
              </div>

              <Button type="submit" className="bg-accent hover:bg-accent/90">
                {hasPreferences ? "Update Preferences" : "Save Preferences"}
              </Button>
            </form>
          </Card>

          {/* Report Form */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Report Open Appointments</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Help others by sharing when you see open slots
                </p>
              </div>
              {!showReportForm && (
                <Button
                  onClick={() => setShowReportForm(true)}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Report
                </Button>
              )}
            </div>

            {showReportForm && (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">DMV Location</label>
                    <Select
                      value={reportForm.dmv_location}
                      onValueChange={(value) =>
                        setReportForm({ ...reportForm, dmv_location: value })
                      }
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
                    <label className="text-sm font-medium">Appointment Date</label>
                    <Input
                      type="date"
                      value={reportForm.appointment_date}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, appointment_date: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Details</label>
                  <Textarea
                    value={reportForm.notes}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, notes: e.target.value })
                    }
                    placeholder="What did you see? (e.g., Multiple morning slots opened today around 9am)"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    Submit Report
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReportForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Recent Reports */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Reports</h2>
            <div className="space-y-4">
              {reports.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No reports yet. Be the first to share!
                </p>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-wrap gap-4 text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="font-medium">{report.dmv_location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-accent" />
                        <span>
                          {format(new Date(report.appointment_date), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">
                          Reported {format(new Date(report.time_observed), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                    {report.notes && (
                      <p className="text-sm text-muted-foreground">{report.notes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;