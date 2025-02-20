import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LinkedinStepProps {
  data: {
    linkedinUrl: string;
  };
  updateData: (field: string, value: any) => void;
}

export default function LinkedinStep({ data, updateData }: LinkedinStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Add your LinkedIn profile 🔗</h2>
        <p className="text-gray-600">
          Help others verify your experience and credentials
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <Input
            type="url"
            placeholder="https://linkedin.com/in/your-profile"
            value={data.linkedinUrl}
            onChange={(e) => updateData("linkedinUrl", e.target.value)}
          />
        </div>
      </div>
    </motion.div>
  );
}
