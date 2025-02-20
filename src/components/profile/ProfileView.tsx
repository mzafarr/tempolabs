import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Link, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile, Profile } from "@/lib/auth";

export default function ProfileView() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await getProfile();
      if (data) {
        setProfile(data);
      }
    };
    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cover Image and Profile Section */}
        <Card className="relative overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="p-6 pb-8">
            <div className="flex justify-between">
              <div className="flex gap-6">
                <img
                  src={
                    profile.photo_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
                  }
                  alt={profile.name || "Profile"}
                  className="w-32 h-32 rounded-full border-4 border-white -mt-16 bg-white"
                />
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {profile.role?.[0] && (
                    <Badge variant="secondary" className="text-base">
                      {profile.role[0]}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/onboarding")}
              >
                <Pencil className="h-4 w-4" /> Edit Profile
              </Button>
            </div>

            {/* Bio/bio Section */}
            {profile.bio && (
              <div className="mt-6">
                <p className="text-gray-600 whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Links Section */}
            {profile.linkedin_url && (
              <div className="flex gap-4 mt-4">
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <Link className="h-4 w-4" /> LinkedIn
                </a>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Mail className="h-4 w-4" /> Contact
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Skills & Interests Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Skills Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Interests Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests?.map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Looking For Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Looking For</h2>
            <div className="flex flex-wrap gap-2">
              {profile.looking_for
                ?.filter((item) => !item.includes("same_"))
                .map((item) => (
                  <Badge key={item} variant="outline" className="bg-blue-50">
                    {item}
                  </Badge>
                ))}
            </div>
          </Card>

          {/* Stage Section */}
          {profile.stage && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Current Stage</h2>
              <Badge variant="default" className="text-base">
                {profile.stage}
              </Badge>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
