import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewModeChange("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewModeChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}