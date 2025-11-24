import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, FileText, Eye, Car, Calendar, ClipboardCheck, Award } from "lucide-react";

const Guide = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: FileText,
      title: "Required Documents",
      content: (
        <div className="space-y-3">
          <p className="text-sm">For international and graduate students, you'll need:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Valid passport with I-94</li>
            <li>I-20 or DS-2019</li>
            <li>Proof of Illinois address (utility bill, lease)</li>
            <li>Social Security Number OR letter explaining why you don't have one</li>
            <li>Payment for fees (check current DMV rates)</li>
          </ul>
        </div>
      ),
    },
    {
      icon: FileText,
      title: "Written Test",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Prepare for the Illinois Rules of the Road exam:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Study the Illinois Driver's Manual (available online)</li>
            <li>Take practice tests online (many free resources)</li>
            <li>Test covers traffic signs, signals, and driving rules</li>
            <li>Must pass with 80% or higher (28 out of 35 questions)</li>
            <li>Available in multiple languages</li>
          </ul>
        </div>
      ),
    },
    {
      icon: Eye,
      title: "Vision Test",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Quick and straightforward:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Bring glasses or contacts if you wear them</li>
            <li>Test is usually done on-site at the DMV</li>
            <li>Must meet minimum acuity standards</li>
          </ul>
        </div>
      ),
    },
    {
      icon: Car,
      title: "Learning to Drive & Practice",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Get comfortable behind the wheel:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Practice with a licensed driver in their car</li>
            <li>Always confirm you're covered by their insurance</li>
            <li>Practice parallel parking, highway merging, and basic maneuvers</li>
            <li>Be familiar with the test vehicle before test day</li>
          </ul>
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-4">
            <p className="text-sm font-semibold text-accent">Safety First!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Always get explicit permission from car owners and verify insurance coverage before practicing.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Calendar,
      title: "Booking Your Road Test",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Schedule your driving test:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Visit the Illinois DMV website to book</li>
            <li>Appointments can fill up quickly—check often</li>
            <li>Choose a location convenient for you (Champaign or Urbana)</li>
            <li>Bring all required documents and the test vehicle</li>
          </ul>
        </div>
      ),
    },
    {
      icon: ClipboardCheck,
      title: "Test Day Checklist",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Make sure the car is ready:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>All lights (headlights, brake lights, turn signals) working</li>
            <li>Horn functional</li>
            <li>Parking brake operational</li>
            <li>Valid registration and proof of insurance in the car</li>
            <li>Clean windshield and mirrors</li>
          </ul>
          <p className="text-sm mt-4">Documents to bring:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Your permit</li>
            <li>Proof of identity</li>
            <li>Vehicle registration and insurance</li>
          </ul>
        </div>
      ),
    },
    {
      icon: Award,
      title: "After Passing",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Congratulations! Next steps:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Update your address if you move</li>
            <li>Consider getting a Real ID (requires additional documents)</li>
            <li>Keep your license in a safe place</li>
            <li>Remember to renew before expiration</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          <h1 className="text-3xl font-bold">Step-by-Step License Guide</h1>
          <p className="text-primary-foreground/80 mt-2">
            Everything you need to know to get your Illinois driver's license
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-accent">
                      Step {index + 1}
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <div>{step.content}</div>
                </div>
              </div>
            </Card>
          ))}

          {/* CTA Section */}
          <Card className="p-8 bg-accent/5 border-accent/20">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
              <p className="text-muted-foreground">
                Need help finding a car for practice or your test?
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={() => navigate("/buddies")}
                  className="bg-accent hover:bg-accent/90"
                >
                  Find a DMV Buddy
                </Button>
                <Button
                  onClick={() => navigate("/appointments")}
                  variant="outline"
                >
                  Set Appointment Alerts
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Guide;