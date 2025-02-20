import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface BasicInfoStepProps {
  data: {
    basicInfo: {
      name: string;
      gender?: string;
      age?: string;
      country?: string;
      languages?: string[];
    };
  };
  updateData: (field: string, value: any) => void;
}

export default function BasicInfoStep({
  data,
  updateData,
}: BasicInfoStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Let's get to know you! 👋</h2>
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
                    className={`w-full p-4 rounded-lg border-2 transition-all ${data.basicInfo.gender === gender.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"}`}
                    onClick={() =>
                      updateData("basicInfo", {
                        ...data.basicInfo,
                        gender: gender.id,
                      })
                    }
                  >
                    <div className="text-2xl mb-2">{gender.icon}</div>
                    <div className="font-medium">{gender.label}</div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Age Range</Label>
            <div>
              {(() => {
                const ageRanges = [
                  "Under 18",
                  "18+",
                  "20s",
                  "30s",
                  "40s",
                  "50+",
                ];
                const max = ageRanges.length - 1;
                const currentIndex = ageRanges.indexOf(
                  data.basicInfo.age || "20s",
                );

                return (
                  <>
                    <Slider
                      defaultValue={[2]}
                      min={0}
                      max={max}
                      step={1}
                      value={[currentIndex === -1 ? 2 : currentIndex]}
                      onValueChange={(value) =>
                        updateData("basicInfo", {
                          ...data.basicInfo,
                          age: ageRanges[value[0]],
                        })
                      }
                    />
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      {ageRanges.map((label) => (
                        <span
                          key={label}
                          className={
                            data.basicInfo.age === label
                              ? "text-primary font-medium"
                              : ""
                          }
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Languages You Speak</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "English",
                "Spanish",
                "Mandarin",
                "Hindi",
                "Arabic",
                "French",
                "German",
                "Japanese",
                "Korean",
                "Portuguese",
                "Russian",
                "Italian",
              ].map((language) => (
                <Badge
                  key={language}
                  variant={
                    data.basicInfo.languages?.includes(language)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer text-sm py-1 px-3"
                  onClick={() => {
                    const newLanguages = data.basicInfo.languages?.includes(
                      language,
                    )
                      ? data.basicInfo.languages.filter((l) => l !== language)
                      : [...(data.basicInfo.languages || []), language];
                    updateData("basicInfo", {
                      ...data.basicInfo,
                      languages: newLanguages,
                    });
                  }}
                >
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <select
              className="w-full p-2 border rounded-md bg-background text-foreground"
              value={data.basicInfo.country || ""}
              onChange={(e) =>
                updateData("basicInfo", {
                  ...data.basicInfo,
                  country: e.target.value,
                })
              }
            >
              <option value="">Select a country</option>
              {[
                "United States",
                "United Kingdom",
                "Canada",
                "Australia",
                "Germany",
                "France",
                "Spain",
                "Italy",
                "Japan",
                "China",
                "India",
                "Brazil",
                "Mexico",
                "South Africa",
                "Nigeria",
                "Egypt",
                "Saudi Arabia",
                "UAE",
                "Singapore",
                "South Korea",
              ].map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
