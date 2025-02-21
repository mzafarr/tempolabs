import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/lib/auth";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ProfileDialogProps {
  profile: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SECTIONS = [
  {
    title: "Roles",
    emoji: "💼",
    key: "role",
    color: "bg-primary/20 text-white",
  },
  {
    title: "Skills",
    emoji: "🛠️",
    key: "skills",
    color: "bg-purple-500/20 text-white",
  },
  {
    title: "Interests",
    emoji: "⭐",
    key: "interests",
    color: "bg-yellow-500/20 text-white",
  },
  {
    title: "Bio",
    emoji: "📝",
    key: "bio",
    color: "bg-green-500/20 text-white",
  },
];

export default function ProfileDialog({
  profile,
  open,
  onOpenChange,
}: ProfileDialogProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[480px] h-[600px] p-0 gap-0 overflow-hidden bg-gray-950/95 text-white border-none">
        <div className="h-full overflow-y-auto">
          <div className="relative h-64">
            <img
              src={
                profile.photo_urls?.[0] ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
              }
              alt={profile.name || "Profile"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950/90" />
            <div className="absolute bottom-4 left-4">
              <h2 className="text-2xl font-bold text-white">
                {profile.name || "Anonymous"}
              </h2>
              {profile.roles && profile.roles[0] && (
                <Badge
                  variant="secondary"
                  className="mt-2 bg-primary/80 text-white"
                >
                  {profile.roles[0]}
                </Badge>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {SECTIONS.map((section) => {
              const content =
                section.key === "bio"
                  ? profile[section.key]
                  : (profile[section.key as keyof typeof profile] as string[]);

              return (
                content && (
                  <div key={section.title} className="space-y-2">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="flex items-center justify-between w-full text-left font-semibold text-white/90 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{section.emoji}</span>
                        <span>{section.title}</span>
                      </span>
                      <ChevronDown
                        className="h-5 w-5 transition-transform duration-200"
                        style={{
                          transform: expandedSections.includes(section.title)
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${expandedSections.includes(section.title) ? "max-h-96" : "max-h-0"}`}
                    >
                      <div className="pt-2">
                        {section.key === "bio" ? (
                          <p className="text-white/80">{content}</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {(content as string[]).map((item) => (
                              <Badge
                                key={item}
                                variant="secondary"
                                className={section.color}
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
