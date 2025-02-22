import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/lib/auth";
import ProfileDialog from "@/components/discover/ProfileDialog";
import { toast } from "../ui/use-toast";
import ProfileCard from "./components/ProfileCard";
import ViewModeToggle from "./components/ViewModeToggle";
import EmptyTabContent from "./components/EmptyTabContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Match = {
  id: string;
  user: Profile;
  status: string;
  match_percentage: number;
  created_at: string;
};

type SwipedProfile = {
  id: string;
  profile: Profile;
  direction: string;
  created_at: string;
};

export default function MatchesView() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [swipedRight, setSwipedRight] = useState<SwipedProfile[]>([]);
  const [swipedLeft, setSwipedLeft] = useState<SwipedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const { user } = useAuth();

  const handleRemove = async (id: string, type: "match" | "swipeRight" | "swipeLeft") => {
    try {
      if (type === "match") {
        // Get the match details first
        const matchToRemove = matches.find((match) => match.id === id);
        if (!matchToRemove) throw new Error("Match not found");

        // Delete the match record first to avoid referential integrity issues
        const { error: matchError } = await supabase
          .from("matches")
          .delete()
          .eq("id", id);

        if (matchError) throw matchError;

        // Delete both users' swipe records
        const { error: swipeError } = await supabase
          .from("swipes")
          .delete()
          .or(`swiper_id.eq.${user.id},swiped_id.eq.${matchToRemove.user.id}`);


        if (swipeError) throw swipeError;

        // Update local state
        setMatches(matches.filter((match) => match.id !== id));
      } else {
        // For regular swipes
        const { error } = await supabase
          .from("swipes")
          .delete()
          .eq("id", id);

        if (error) throw error;

        // Update local state
        if (type === "swipeRight") {
          setSwipedRight(swipedRight.filter((swipe) => swipe.id !== id));
        } else {
          setSwipedLeft(swipedLeft.filter((swipe) => swipe.id !== id));
        }
      }

      toast({
        title: "Success",
        description: `${type === 'match' ? 'Match' : type === 'swipeRight' ? "Right Swipe" : "Left Swipe"} removed successfully.`,
      });
    } catch (error) {
      console.error("Error removing entry:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [matchesResponse, swipesResponse] = await Promise.all([
          supabase
            .from("matches")
            .select(`
              id, status, match_percentage, created_at, user1_id, user2_id,
              user1:profiles!matches_user1_id_fkey (id, name, photo_urls, roles, interests, age, country, created_at, email, gender, instagram_url, languages, linkedin_url, looking_for, twitter_url, website_url, youtube_url),
              user2:profiles!matches_user2_id_fkey (id, name, photo_urls, roles, interests, age, country, created_at, email, gender, instagram_url, languages, linkedin_url, looking_for, twitter_url, website_url, youtube_url)
            `)
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
            .order("created_at", { ascending: false }),
          supabase
            .from("swipes")
            .select(`
              id, direction, created_at, swiped_id,
              profiles!swipes_swiped_id_fkey (id, name, photo_urls, roles, interests)
            `)
            .eq("swiper_id", user.id)
            .order("created_at", { ascending: false })
        ]);

        if (matchesResponse.error) throw matchesResponse.error;
        if (swipesResponse.error) throw swipesResponse.error;

        const transformedMatches = matchesResponse.data.map((match) => ({
          id: match.id,
          //@ts-ignore
          user: (match.user1_id === user.id ? match.user2 : match.user1) as Profile,
          status: match.status || "pending",
          match_percentage: match.match_percentage || 0,
          created_at: match.created_at,
        }));

        let rightSwipes = swipesResponse.data
          .filter((swipe) => (swipe.direction === "right" || swipe.direction === "superlike") && swipe.profiles)
          .map((swipe) => ({
            id: swipe.id,
            //@ts-ignore
            profile: swipe.profiles as Profile,
            direction: swipe.direction,
            created_at: swipe.created_at,
          }));

        rightSwipes = rightSwipes.filter(
          (swipe) => !transformedMatches.find((match) => match.user.id === swipe.profile.id)
        );

        const leftSwipes = swipesResponse.data
          .filter((swipe) => swipe.direction === "left" && swipe.profiles)
          .map((swipe) => ({
            id: swipe.id,
            //@ts-ignore
            profile: swipe.profiles as Profile,
            direction: swipe.direction,
            created_at: swipe.created_at,
          }));

        setMatches(transformedMatches);
        setSwipedRight(rightSwipes);
        setSwipedLeft(leftSwipes);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load matches and swipes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const renderProfiles = (items: Array<Match | SwipedProfile>, type: "match" | "swipeRight" | "swipeLeft") => (
    <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "space-y-4"}>
      {items.map((item) => {
        const profile = 'user' in item ? item.user : item.profile;
        const subtitle = 'user' in item
          ? `${item.match_percentage}% Match`
          : `${type === 'swipeRight' ? 'Swiped' : 'Passed'} on ${new Date(item.created_at).toLocaleDateString()}`;

        return (
          <div key={item.id} className="relative">
            <ProfileCard
              profile={profile}
              subtitle={subtitle}
              viewMode={viewMode}
              onViewProfile={setSelectedProfile}
              onRemove={() => handleRemove(item.id, type)}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 md:p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Matches & Swipes</h1>
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matches">Matched Users ({matches.length})</TabsTrigger>
            <TabsTrigger value="right">Swiped Right ({swipedRight.length})</TabsTrigger>
            <TabsTrigger value="left">Swiped Left ({swipedLeft.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-4 mt-4">
            {matches.length === 0 ? (
              <EmptyTabContent
                title="No Matches Yet"
                description="Keep swiping to find your perfect match!"
                buttonText="Discover More"
              />
            ) : renderProfiles(matches, "match")}
          </TabsContent>

          <TabsContent value="right" className="space-y-4 mt-4">
            {swipedRight.length === 0 ? (
              <EmptyTabContent
                title="No Right Swipes"
                description="You haven't swiped right on anyone yet."
              />
            ) : renderProfiles(swipedRight, "swipeRight")}
          </TabsContent>

          <TabsContent value="left" className="space-y-4 mt-4">
            {swipedLeft.length === 0 ? (
              <EmptyTabContent
                title="No Left Swipes"
                description="You haven't passed on anyone yet."
              />
            ) : renderProfiles(swipedLeft, "swipeLeft")}
          </TabsContent>
        </Tabs>
      </div>

      {selectedProfile && (
        <ProfileDialog
          profile={selectedProfile}
          open={!!selectedProfile}
          onOpenChange={(open) => !open && setSelectedProfile(null)}
        />
      )}
    </div>
  );
}
