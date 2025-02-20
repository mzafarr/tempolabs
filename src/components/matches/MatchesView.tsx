import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, LayoutGrid, List } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/lib/auth";
import ProfileDialog from "@/components/discover/ProfileDialog";
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

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select(
          `
          id,
          status,
          match_percentage,
          created_at,
          user1_id,
          user2_id,
          profiles!matches_user2_id_fkey (*)
        `,
        )
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (matchesError) {
        console.error("Error fetching matches:", matchesError);
        return;
      }

      // Fetch swipes
      const { data: swipesData, error: swipesError } = await supabase
        .from("swipes")
        .select(
          `
          id,
          direction,
          created_at,
          swiped_id,
          profiles!swipes_swiped_id_fkey (id, name, photo_url, role, interests)
        `
        )
        .eq("swiper_id", user.id)
        .order("created_at", { ascending: false });
        console.log("swipesData: ", swipesData)
      if (swipesError) {
        console.error("Error fetching swipes:", swipesError);
        return;
      }

      // Transform matches data
      const transformedMatches = matchesData.map((match) => ({
        id: match.id,
        user: match.profiles[0] as Profile, // Access first element of the array
        status: match.status || "pending",
        match_percentage: match.match_percentage || 0,
        created_at: match.created_at,
      }));

      // Transform swipes data
      const rightSwipes = swipesData
        .filter((swipe) => (swipe.direction === "right" || swipe.direction === "superlike") && swipe.profiles)
        .map((swipe) => ({
          id: swipe.id,
          //@ts-ignore
          profile: swipe.profiles as Profile,
          direction: swipe.direction,
          created_at: swipe.created_at,
        }));

      const leftSwipes = swipesData
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
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const renderProfile = (profile: Profile | undefined, subtitle?: string) => {
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
          <img
            src={
              profile.photo_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
            }
            alt={profile.name || "User"}
            className={`${viewMode === "grid" ? "w-16 h-16" : "w-20 h-20"} rounded-full object-cover`}
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{profile.name || "Anonymous"}</h3>
                <p className="text-sm text-gray-500">
                  {profile.role?.[0] || "No role specified"}
                </p>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
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
            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProfile(profile)}
              >
                View Profile
              </Button>
              <Button size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 md:p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Matches & Swipes</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="matches">
                ✅ Matched Users ({matches.length})
              </TabsTrigger>
              <TabsTrigger value="right">
                ➡️ Swiped Right ({swipedRight.length})
              </TabsTrigger>
              <TabsTrigger value="left">
                ❌ Swiped Left ({swipedLeft.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="space-y-4 mt-4">
              {matches.length === 0 ? (
                <Card className="p-6 text-center">
                  <h2 className="text-xl font-semibold mb-2">No Matches Yet</h2>
                  <p className="text-gray-500 mb-4">
                    Keep swiping to find your perfect match!
                  </p>
                  <Button onClick={() => (window.location.href = "/discover")}>
                    Discover More
                  </Button>
                </Card>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 gap-4"
                      : "space-y-4"
                  }
                >
                  {matches.map((match) =>
                    renderProfile(
                      match.user,
                      `${match.match_percentage}% Match`,
                    ),
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="right" className="space-y-4 mt-4">
              {swipedRight.length === 0 ? (
                <Card className="p-6 text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    No Right Swipes
                  </h2>
                  <p className="text-gray-500 mb-4">
                    You haven't swiped right on anyone yet.
                  </p>
                  <Button onClick={() => (window.location.href = "/discover")}>
                    Start Discovering
                  </Button>
                </Card>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 gap-4"
                      : "space-y-4"
                  }
                >
                  {swipedRight.map((swipe) =>
                    renderProfile(
                      swipe.profile,
                      `Swiped ${swipe.direction} on ${new Date(swipe.created_at).toLocaleDateString()}`,
                    ),
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="left" className="space-y-4 mt-4">
              {swipedLeft.length === 0 ? (
                <Card className="p-6 text-center">
                  <h2 className="text-xl font-semibold mb-2">No Left Swipes</h2>
                  <p className="text-gray-500 mb-4">
                    You haven't passed on anyone yet.
                  </p>
                  <Button onClick={() => (window.location.href = "/discover")}>
                    Start Discovering
                  </Button>
                </Card>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 gap-4"
                      : "space-y-4"
                  }
                >
                  {swipedLeft.map((swipe) =>
                    renderProfile(
                      swipe.profile,
                      `Passed on ${new Date(swipe.created_at).toLocaleDateString()}`,
                    ),
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedProfile && (
        <ProfileDialog
          profile={selectedProfile}
          open={!!selectedProfile}
          onOpenChange={(open) => !open && setSelectedProfile(null)}
        />
      )}
    </>
  );
}
