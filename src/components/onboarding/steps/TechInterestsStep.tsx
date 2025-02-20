import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface TechInterestsStepProps {
  data: {
    interests: string[];
  };
  updateData: (field: string, value: any) => void;
}

export default function TechInterestsStep({
  data,
  updateData,
}: TechInterestsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">What excites you? ⚡</h2>
        <p className="text-gray-600">Select your tech interests</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          "AI/ML",
          "Web3",
          "SaaS",
          "Mobile Apps",
          "E-commerce",
          "DevTools",
          "FinTech",
          "Healthcare",
          "EdTech",
          "Social Impact",
        ].map((interest) => (
          <Badge
            key={interest}
            variant={data.interests.includes(interest) ? "default" : "outline"}
            className="cursor-pointer text-sm py-1 px-3"
            onClick={() => {
              const newInterests = data.interests.includes(interest)
                ? data.interests.filter((i) => i !== interest)
                : [...data.interests, interest];
              updateData("interests", newInterests);
            }}
          >
            {interest}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}
