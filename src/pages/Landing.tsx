import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Users, Calendar } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("uiuc");
  const navigate = useNavigate();

  const handleContinue = () => {
    logger.info("Landing: Continue clicked", { email, school });
    
    if (!email) {
      logger.warn("Landing: Empty email attempt");
      toast.error("Please enter your email");
      return;
    }
    
    if (!email.endsWith("@illinois.edu")) {
      logger.warn("Landing: Invalid email domain", { email });
      toast.error("Only @illinois.edu emails are allowed");
      return;
    }

    logger.info("Landing: Navigating to auth", { email });
    navigate("/auth", { state: { email } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-accent/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent/20">
              <Car className="w-6 h-6 text-accent" />
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                CarlessCrew
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Helping UIUC students get their Illinois driver's license — even without a car
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-accent/50 transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Car className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Step-by-Step Guide</h3>
              <p className="text-muted-foreground text-sm">
                Complete walkthrough from documents to road test
              </p>
            </div>
            
            <div className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-accent/50 transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">DMV Buddy Board</h3>
              <p className="text-muted-foreground text-sm">
                Connect with students who can help or need help
              </p>
            </div>
            
            <div className="bg-card/95 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-accent/50 transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Appointment Alerts</h3>
              <p className="text-muted-foreground text-sm">
                Get notified when DMV appointments open up
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-card/95 backdrop-blur-sm p-8 rounded-2xl border border-border/50 max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Your School</label>
              <Select value={school} onValueChange={setSchool}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uiuc">University of Illinois Urbana-Champaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Enter Your .edu Email</label>
              <Input
                type="email"
                placeholder="netid@illinois.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                className="bg-background"
              />
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg"
            >
              Continue with UIUC Login
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Student-created project · Free to use · Not officially affiliated with UIUC or DMV
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;