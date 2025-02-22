import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Trash2 } from "lucide-react";
import { Profile } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCardProps {
  profile: Profile | undefined;
  subtitle?: string;
  viewMode: "grid" | "list";
  onViewProfile: (profile: Profile) => void;
  onRemove?: () => void;
}

export default function ProfileCard({
  profile,
  subtitle,
  viewMode,
  onViewProfile,
  onRemove,
}: ProfileCardProps) {
  if (!profile) {
    return (
      <Card className={`${viewMode === "grid" ? "p-4" : "p-6"}`}>
        <div className="p-4 text-center text-gray-500">
          Profile not available
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${viewMode === "grid" ? "p-4" : "p-6"}`}>
      <div className="flex items-start gap-4">
        <Avatar className={`w-20 h-20`}>
          <AvatarImage
            className={`w-20 h-20 rounded-full object-cover`}
            src={profile.photo_urls[0] || "/empty-user.jpeg"}
            alt={profile.name || "User"}
          />
          <AvatarFallback>
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{profile.name || "Anonymous"}</h3>
              <p className="text-sm text-gray-500">
                {profile.roles?.[0] || "No role specified"}
              </p>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.interests?.slice(0, 3).map((interest) => (
              <Badge key={interest} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(profile)}
              >
                View Profile
              </Button>
              <Button size="sm" className="gap-2 ml-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      )}
    </Card>
  );
}