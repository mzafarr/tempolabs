import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface PhotoStepProps {
  data: {
    photoUrl: string;
  };
  updateData: (field: string, value: any) => void;
}

export default function PhotoStep({ data, updateData }: PhotoStepProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Profile Photo 📸</h2>
        <p className="text-gray-600">Add a professional photo of yourself</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar className="w-32 h-32 ring-2 ring-offset-2 ring-gray-200 group-hover:ring-blue-500 transition-all duration-200">
            <img
              src={
                data.photoUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "default"}`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </Avatar>
          {data.photoUrl && (
            <button
              onClick={async () => {
                try {
                  // Extract the file path from the URL
                  const path = data.photoUrl.split("/").slice(-2).join("/");

                  // Delete the old photo
                  const { error: deleteError } = await supabase.storage
                    .from("profile_photos")
                    .remove([path]);

                  if (deleteError) throw deleteError;

                  // Update the state
                  updateData("photoUrl", "");

                  toast({
                    title: "Success",
                    description: "Photo removed successfully",
                  });
                } catch (error) {
                  console.error("Error removing photo:", error);
                  toast({
                    title: "Error",
                    description: "Failed to remove photo",
                    variant: "destructive",
                  });
                }
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                // If there's an existing photo, delete it first
                if (data.photoUrl) {
                  const oldPath = data.photoUrl.split("/").slice(-2).join("/");
                  await supabase.storage
                    .from("profile_photos")
                    .remove([oldPath]);
                }

                // Upload new photo
                const fileExt = file.name.split(".").pop();
                const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

                const { data: uploadData, error } = await supabase.storage
                  .from("profile_photos")
                  .upload(fileName, file, {
                    upsert: true,
                  });

                if (error) throw error;

                const {
                  data: { publicUrl },
                } = supabase.storage
                  .from("profile_photos")
                  .getPublicUrl(uploadData.path);

                updateData("photoUrl", publicUrl);

                toast({
                  title: "Success",
                  description: "Photo uploaded successfully",
                });
              } catch (error) {
                console.error("Error uploading photo:", error);
                toast({
                  title: "Error",
                  description: "Failed to upload photo. Please try again.",
                  variant: "destructive",
                });
              }
            }}
            className="max-w-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            Recommended: Square image, at least 400x400 pixels
          </p>
        </div>
      </div>
    </motion.div>
  );
}
