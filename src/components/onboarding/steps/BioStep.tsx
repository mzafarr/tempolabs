import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BioStepProps {
  data: {
    bio: string;
  };
  updateData: (field: string, value: any) => void;
}

export default function BioStep({ data, updateData }: BioStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your Bio ✍️</h2>
        <p className="text-gray-600">Tell others about yourself</p>
      </div>
      <div className="space-y-4">
        <textarea
          className="w-full h-32 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Share your story, experience, and what you're looking for..."
          value={data.bio}
          onChange={(e) => updateData("bio", e.target.value)}
        />
        <div className="space-y-2 text-sm text-gray-500">
          <p>Tips for an effective bio:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Share your professional background and key achievements</li>
            <li>Mention your current projects or startup ideas</li>
            <li>Describe what kind of co-founder/partner you're looking for</li>
            <li>Add your vision and long-term bio</li>
          </ul>
        </div>
        <Button className="w-full mt-4" variant="outline" disabled={true}>
          Generate with AI (Coming Soon)
        </Button>
      </div>
    </motion.div>
  );
}
