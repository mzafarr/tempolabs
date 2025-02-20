import React, { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import EmptyCard from "./EmptyCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/lib/auth";

type DiscoverProfile = Profile & {
  match_percentage?: number;
};

export default function DiscoverView() {
  const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) {
        console.log("No user found");
        return;
      }

      console.log("Fetching profiles for user:", user.id);

      // First get all profiles except current user
      const { data: allProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
      }

      // Then get all swiped profiles
      const { data: swipedData } = await supabase
        .from("swipes")
        .select("swiped_id")
        .eq("swiper_id", user.id);

      const swipedIds = new Set(swipedData?.map((s) => s.swiped_id) || []);

      // Filter out swiped profiles
      const filteredProfiles = allProfiles.filter(
        (profile) => !swipedIds.has(profile.id),
      );

      if (filteredProfiles.length > 0) {
        console.log("Setting profiles:", filteredProfiles);
        setProfiles(filteredProfiles);
        setCurrentIndex(0);
      } else {
        console.log("No profiles found");
      }
      setLoading(false);
    };

    fetchProfiles();
  }, [user]);

  const currentProfile =
    currentIndex < profiles.length ? profiles[currentIndex] : null;

  const handleSwipe = async (direction: "left" | "right" | "superlike") => {
    if (!currentProfile || !user) return;

    // Save the swipe
    console.log("[Swipe Creation] Creating new swipe:", {
      swiper_id: user.id,
      swiped_id: currentProfile.id,
      direction: direction
    });

    const { data: newSwipe, error: swipeError } = await supabase.from("swipes").insert({
      swiper_id: user.id,
      swiped_id: currentProfile.id,
      direction: direction,
      created_at: new Date().toISOString(),
    }).select();

    console.log("[Swipe Creation] Result:", { newSwipe, swipeError });

    if (swipeError) {
      console.error("Error saving swipe:", swipeError);
      return;
    }

    // If it's a right swipe or superlike, check if there's a mutual match
    if (direction === "right" || direction === "superlike") {
      console.log("[Match Check] Starting mutual match check:", {
        currentUser: user.id,
        swipedProfile: currentProfile.id,
        direction: direction,
        timestamp: new Date().toISOString()
      });

      try {
        // Check if the other person has already swiped right on us
        console.log("[Match Check] Checking for existing swipes with params:", {
          swiper_id: currentProfile.id,
          swiped_id: user.id,
          directions: ["right", "superlike"]
        });

        const { data: existingSwipes, error: existingSwipesError } = await supabase
          .from("swipes")
          .select("*, profiles!swipes_swiper_id_fkey(*)")
          .eq("swiper_id", currentProfile.id)
          .eq("swiped_id", user.id)
          .in("direction", ["right", "superlike"]);

        // Log the raw response for debugging
        console.log("[Match Check] Raw swipes query response:", {
          existingSwipes,
          existingSwipesError,
          queryTime: new Date().toISOString()
        });

        if (existingSwipesError) {
          throw new Error(`Error checking existing swipes: ${existingSwipesError.message}`);
        }

        console.log("[Match Check] Found existing swipes:", {
          currentUserId: user.id,
          otherUserId: currentProfile.id,
          swipeCount: existingSwipes?.length || 0,
          swipes: existingSwipes,
          timestamp: new Date().toISOString()
        });

        // If they have, check for existing match first
        if (existingSwipes && existingSwipes.length > 0) {
          console.log("[Match Check] Found mutual swipe, checking for existing match...");
          // Check if match already exists
          const { data: existingMatch, error: existingMatchError } = await supabase
            .from("matches")
            .select("*")
            .or(`and(user1_id.eq.${user.id},user2_id.eq.${currentProfile.id}),and(user1_id.eq.${currentProfile.id},user2_id.eq.${user.id}))`)
            .single();

          if (existingMatchError) {
            console.error("[Match Check] Error checking existing match:", existingMatchError);
            return;
          }

          if (existingMatch) {
            console.log("[Match Check] Match already exists:", {
              match: existingMatch,
              timestamp: new Date().toISOString()
            });
            return;
          }

          console.log("[Match Creation] Creating new match:", {
            user1: user.id,
            user2: currentProfile.id,
            matchTrigger: "mutual swipe",
            timestamp: new Date().toISOString()
          });

          const { data: newMatch, error: matchError } = await supabase
            .from("matches")
            .insert({
              user1_id: user.id,
              user2_id: currentProfile.id,
              status: "matched",
              match_percentage: 0,
              created_at: new Date().toISOString(),
            })
            .select();

          if (matchError) {
            console.error("[Match Creation] Error creating match:", {
              error: matchError,
              timestamp: new Date().toISOString()
            });
            throw new Error(`Error creating match: ${matchError.message}`);
          }

          console.log("[Match Creation] Successfully created match:", {
            match: newMatch,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("[Match Check] Error in match checking process:", {
          error,
          timestamp: new Date().toISOString()
        });
      }

      // Move to next profile
      setCurrentIndex((prev) => prev + 1);
    }

    // Move to next profile
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBoost = () => {
    console.log("Boosting profile visibility");
  };

  const handleInfo = () => {
    console.log("Showing more info");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex gap-4">
          <button className="text-red-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <button className="text-gray-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </button>
          <button className="text-gray-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
          <button className="text-gray-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex-1 p-4">
        {currentProfile ? (
          <ProfileCard
            profile={currentProfile}
            onSwipeLeft={() => handleSwipe("left")}
            onSwipeRight={() => handleSwipe("right")}
            onSuperLike={() => handleSwipe("superlike")}
            onBoost={handleBoost}
            onInfo={handleInfo}
          />
        ) : (
          <EmptyCard />
        )}
      </div>
    </div>
  );
}
