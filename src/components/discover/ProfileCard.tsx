import React, { useState } from "react";
import ProfileDialog from "./ProfileDialog";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, X, Heart } from "lucide-react";
import { Profile } from "@/lib/auth";

interface ProfileCardProps {
  profile: Profile;
  onSwipeLeft: () => Promise<void>;
  onSwipeRight: () => Promise<void>;
  onSuperLike?: () => Promise<void>;
  onBoost?: () => void;
  onInfo?: () => void;
}

export default function ProfileCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
}: ProfileCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const [showDetails, setShowDetails] = useState(false);

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -50 || velocity < -500) {
      handleAction("left");
    } else if (offset > 50 || velocity > 500) {
      handleAction("right");
    } else {
      x.set(0, { type: "spring", stiffness: 300, damping: 20 } as any);
    }
  };

  const handleAction = async (direction: "left" | "right") => {
    // Move in the direction with a smooth animation
    await x.set(direction === "left" ? -200 : 200, {
      type: "spring",
      stiffness: 75,
      damping: 50,
    } as any);

    // Trigger the callback
    if (direction === "left") {
      onSwipeLeft?.();
    } else {
      onSwipeRight?.();
    }

    // Reset position smoothly
    x.set(0, {
      type: "spring",
      stiffness: 175,
      damping: 20,
    } as any);
  };

  return (
    <>
      <motion.div
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="w-full max-w-md mx-auto cursor-grab active:cursor-grabbing"
        whileTap={{ scale: 1.02 }}
        transition={{ type: "spring", bounce: 0.2 }}
      >
        <Card className="w-full max-w-md mx-auto overflow-hidden bg-black text-white relative h-[600px]">
          <motion.div className="absolute inset-0" style={{ opacity, scale }}>
            <img
              src={
                profile.photo_urls[0] ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
              }
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
          </motion.div>

          <motion.div
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-500/90 text-white p-4 rounded-full"
            style={{ opacity: useTransform(x, [-50, 0], [1, 0]) }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: x.get() < 0 ? -x.get() / 50 : 0 }}
          >
            <X className="h-8 w-8" />
          </motion.div>
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500/90 text-white p-4 rounded-full"
            style={{ opacity: useTransform(x, [0, 50], [0, 1]) }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: x.get() > 0 ? x.get() / 50 : 0 }}
          >
            <Heart className="h-8 w-8" />
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">
                {profile.name || "Anonymous"}
              </h2>
              {profile.roles && profile.roles.length > 0 && (
                <Badge variant="secondary" className="bg-primary">
                  {profile.roles[0]}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.interests?.slice(0, 3).map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="bg-black/50 text-white border-white/20"
                >
                  {interest}
                </Badge>
              ))}
              {(profile.interests?.length || 0) > 3 && (
                <Badge
                  variant="outline"
                  className="bg-black/50 text-white border-white/20"
                >
                  +{(profile.interests?.length || 0) - 3} more
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 border-destructive bg-white/10 hover:bg-destructive hover:text-white"
                  onClick={() => handleAction("left")}
                >
                  <X className="h-8 w-8" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 border-primary bg-white/10 hover:bg-primary hover:text-white"
                  onClick={() => setShowDetails(true)}
                >
                  <Info className="h-8 w-8" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 border-green-500 bg-white/10 hover:bg-green-500 hover:text-white"
                  onClick={() => handleAction("right")}
                >
                  <Heart className="h-8 w-8" />
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <ProfileDialog
            profile={profile}
            open={showDetails}
            onOpenChange={setShowDetails}
          />
        )}
      </AnimatePresence>
    </>
  );
}
