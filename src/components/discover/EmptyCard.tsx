import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function EmptyCard() {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-black/90 text-white relative h-[600px] flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6">
        <div className="rounded-full  p-4 inline-block">
          <RefreshCw className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">No More Profiles</h2>
          <p className="text-gray-400 max-w-sm">
            You've seen all relevant profiles for now. Check back later for new
            matches!
          </p>
        </div>
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Profiles
        </Button>
      </div>
    </Card>
  );
}
