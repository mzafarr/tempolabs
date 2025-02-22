import { motion } from "framer-motion";
import InterestAccordion from "./shared/InterestAccordion";

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
      <InterestAccordion
        selectedInterests={data.interests}
        onInterestToggle={(interest) => {
          const newInterests = data.interests.includes(interest)
            ? data.interests.filter((i) => i !== interest)
            : [...data.interests, interest];
          updateData("interests", newInterests);
        }}
      />
    </motion.div>
  );
}
