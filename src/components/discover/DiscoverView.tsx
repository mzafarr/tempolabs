import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProfileCard from "./ProfileCard";
import EmptyCard from "./EmptyCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

type DiscoverProfile = Profile & {
  match_percentage?: number;
};

export default function DiscoverView() {
  const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfiles = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch profiles and swiped data in parallel
      const [profilesResponse, swipedResponse] = await Promise.all([
        supabase.from("profiles").select("*").neq("id", user.id),
        supabase.from("swipes").select("swiped_id").eq("swiper_id", user.id)
      ]);

      if (profilesResponse.error) throw profilesResponse.error;
      if (swipedResponse.error) throw swipedResponse.error;

      const allProfiles = profilesResponse.data;
      const swipedIds = new Set(swipedResponse.data?.map((s) => s.swiped_id) || []);

      // Filter out swiped profiles
      const filteredProfiles = allProfiles.filter(
        (profile) => !swipedIds.has(profile.id)
      );

      setProfiles(filteredProfiles);
      setCurrentIndex(0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const currentProfile = useMemo(
    () => (currentIndex < profiles.length ? profiles[currentIndex] : null),
    [profiles, currentIndex]
  );

  const handleSwipe = useCallback(async (direction: "left" | "right") => {
    if (!currentProfile || !user) return;

    try {
      // Create swipe record
      const { error: swipeError } = await supabase.from("swipes").insert({
        swiper_id: user.id,
        swiped_id: currentProfile.id,
        direction,
        created_at: new Date().toISOString(),
      });

      if (swipeError) throw swipeError;

      // Check for match if right swipe
      if (direction === "right") {
        const { data: reciprocalSwipe, error: reciprocalError } = await supabase
          .from("swipes")
          .select("*")
          .eq("swiper_id", currentProfile.id)
          .eq("swiped_id", user.id)
          .eq("direction", "right")
          .single();

        if (reciprocalError) throw reciprocalError;

        if (reciprocalSwipe) {
          const { error: matchError } = await supabase.from("matches").insert({
            user1_id: user.id,
            user2_id: currentProfile.id,
            match_percentage: 100,
            created_at: new Date().toISOString(),
          });

          if (matchError) throw matchError;

          toast({
            title: "It's a match!",
            description: `You matched with ${currentProfile.name}`,
          });
        }
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process swipe",
        variant: "destructive",
      });
    }
  }, [currentProfile, user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="flex-1 p-4">
        {currentProfile ? (
          <ProfileCard
            profile={currentProfile}
            onSwipeLeft={() => handleSwipe("left")}
            onSwipeRight={() => handleSwipe("right")}
          />
        ) : (
          <EmptyCard />
        )}
      </div>
    </div>
  );
}
