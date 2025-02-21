import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { getProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Globe, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsView() {
  const { data, updateData } = useOnboarding();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: profile } = await getProfile();
      if (profile) {
        updateData("basicInfo", {
          name: profile.name || "",
          email: profile.email || "",
        });
        updateData("roles", profile.role || []);
        updateData("stage", profile.stage || "");
        updateData("interests", profile.interests || []);
        updateData("skills", profile.skills || []);
        updateData("lookingFor", profile.looking_for || []);
        updateData("bio", profile.bio || "");
        updateData("photoUrls", profile.photo_urls || []);
        updateData("linkedinUrl", profile.linkedin_url || "");
      }
    };
    loadProfile();
  }, []);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </h2>
          <div className="space-y-4">
            {["New matches", "Messages", "Profile views", "App updates"].map(
              (item) => (
                <div key={item} className="flex items-center justify-between">
                  <Label htmlFor={item}>{item}</Label>
                  <Switch id={item} />
                </div>
              ),
            )}
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" /> Privacy
          </h2>
          <div className="space-y-4">
            {[
              "Show online status",
              "Show profile to matches only",
              "Allow profile indexing",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <Label htmlFor={item}>{item}</Label>
                <Switch id={item} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" /> Profile
          </h2>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/onboarding")}
            >
              Edit Profile Information
            </Button>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" /> Account
          </h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Email
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Card>

        <Card className="p-6 space-y-6 bg-red-50">
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
          <div className="space-y-4">
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
