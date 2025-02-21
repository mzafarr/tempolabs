import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultipleSelector } from "@/components/ui/multiple-selector";
import { cn } from "@/lib/utils";
import { countryOptions } from "./constants";
import LocationSelector from "@/components/ui/location-input";

interface BasicInfoStepProps {
  data: {
    basicInfo: {
      name: string;
      gender?: string;
      age?: string;
      country?: string;
      languages?: string[];
    };
    photoUrls?: string[];
  };
  updateData: (field: string, value: any) => void;
}

export default function BasicInfoStep({
  data,
  updateData,
}: BasicInfoStepProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Let's get to know you! 👋</h2>
      <div className="flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl">
          {[0, 1, 2].map((index) => (
            <div key={index} className="relative group aspect-square">
              {data.photoUrls[index] ? (
                <div className="relative w-full h-full">
                  <img
                    src={data.photoUrls[index]}
                    alt={`Profile ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg ring-2 ring-offset-2 ring-gray-200 group-hover:ring-primary transition-all duration-200"
                  />
                  <button
                    onClick={async () => {
                      try {
                        const path = data.photoUrls[index]
                          .split("/")
                          .slice(-2)
                          .join("/");
                        const { error: deleteError } = await supabase.storage
                          .from("profile_photos")
                          .remove([path]);

                        if (deleteError) throw deleteError;
                        const newPhotoUrls = [...data.photoUrls];
                        newPhotoUrls.splice(index, 1);
                        updateData("photoUrls", newPhotoUrls);

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
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        toast({
                          title: "Error",
                          description: "File size must be less than 5MB",
                          variant: "destructive",
                        });
                        return;
                      }

                      try {
                        const fileExt = file.name.split(".").pop();
                        const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

                        const { data: uploadData, error } =
                          await supabase.storage
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

                        const newPhotoUrls = [...data.photoUrls];
                        newPhotoUrls[index] = publicUrl;
                        updateData("photoUrls", newPhotoUrls);

                        toast({
                          title: "Success",
                          description: "Photo uploaded successfully",
                        });
                      } catch (error) {
                        console.error("Error uploading photo:", error);
                        toast({
                          title: "Error",
                          description:
                            "Failed to upload photo. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                  />
                  <div className="text-center p-4">
                    <div className="text-3xl md:text-4xl mb-1">+</div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Photo {index + 1}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                  </div>
                </label>
              )}
            </div>
          ))}
        </div>
        {/* <p className="text-xs text-gray-500 mt-2">
          Recommended: Square images, at least 400x400 pixels
        </p> */}
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">What's your name?</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={data.basicInfo.name}
            onChange={(e) =>
              updateData("basicInfo", {
                ...data.basicInfo,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "male", label: "Male", icon: "👨" },
                { id: "female", label: "Female", icon: "👩" },
              ].map((gender) => (
                <motion.div
                  key={gender.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    className={`w-full p-2 md:py-2 rounded-lg border-2 transition-all ${
                      data.basicInfo.gender === gender.id
                        ? "border-primary bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                    onClick={() =>
                      updateData("basicInfo", {
                        ...data.basicInfo,
                        gender: gender.id,
                      })
                    }
                  >
                    <div className="text-2xl">{gender.icon}</div>
                    <div className="font-medium text-sm">{gender.label}</div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <Label className="text-base font-medium">Age Range</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {ageRanges.map((age) => (
                <button
                  key={age.value}
                  onClick={() =>
                    updateData("basicInfo", {
                      ...data.basicInfo,
                      age: age.value,
                    })
                  }
                  className={cn(
                    "flex flex-col items-center p-3 border rounded-lg transition-colors h-full",
                    data.basicInfo.age === age.value
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary"
                  )}
                >
                  <span className="text-2xl mb-2">{age.emoji}</span>
                  <span className="text-center font-medium text-sm">
                    {age.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Languages You Speak
                </Label>
                <MultipleSelector
                  placeholder="Select languages..."
                  defaultOptions={languageOptions}
                  value={
                    data.basicInfo.languages?.map((lang) => ({
                      value: lang,
                      label: lang,
                    })) || []
                  }
                  groupBy=""
                  onChange={(newValue) =>
                    updateData("basicInfo", {
                      ...data.basicInfo,
                      languages: newValue.map((item) => item.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">Country</Label>
                {/* value={data.basicInfo.country || ""}
                onValueChange={(value) =>
                  updateData("basicInfo", {
                    ...data.basicInfo,
                    country: value,
                  })
                } */}
                <LocationSelector
                  onCountryChange={(value) =>
                    updateData("basicInfo", {
                      ...data.basicInfo,
                      country: value,
                    })
                  }
                  // onStateChange={(value) =>
                  //   updateData("basicInfo", {
                  //     ...data.basicInfo,
                  //     country: value,
                  //   })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const languageOptions = [
  { value: "English", label: "English", category: "Common" },
  { value: "Spanish", label: "Spanish", category: "Common" },
  { value: "Mandarin", label: "Mandarin", category: "Asian" },
  { value: "Hindi", label: "Hindi", category: "Asian" },
  { value: "Arabic", label: "Arabic", category: "Middle Eastern" },
  { value: "French", label: "French", category: "European" },
  { value: "German", label: "German", category: "European" },
  { value: "Japanese", label: "Japanese", category: "Asian" },
  { value: "Korean", label: "Korean", category: "Asian" },
  { value: "Portuguese", label: "Portuguese", category: "European" },
  { value: "Russian", label: "Russian", category: "European" },
  { value: "Italian", label: "Italian", category: "European" },
];

const ageRanges = [
  { value: "Under 18", label: "Under 18", emoji: "👶" },
  { value: "18+", label: "18+", emoji: "🎓" },
  { value: "20s", label: "20s", emoji: "💼" },
  { value: "30s", label: "30s", emoji: "👨‍💼" },
  { value: "40s", label: "40s", emoji: "👨‍💻" },
  { value: "50+", label: "50+", emoji: "🎯" },
];
