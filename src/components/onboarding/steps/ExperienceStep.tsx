import { motion } from "framer-motion";

interface ExperienceStepProps {
  data: {
    stage: string;
  };
  updateData: (field: string, value: any) => void;
}

export default function ExperienceStep({
  data,
  updateData,
}: ExperienceStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Where are you at? 🎯</h2>
        <p className="text-gray-600">
          Select your current stage{" "}
          <span className="text-sm text-muted-foreground">(Optional)</span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            value: "none",
            label: "None",
            icon: "🤔",
            description: "Not building anything yet",
          },
          {
            value: "ideation",
            label: "Just an idea",
            icon: "💡",
            description: "I'm still in the ideation phase",
          },
          {
            value: "mvp",
            label: "Building MVP",
            icon: "🛠️",
            description: "Working on the first version",
          },
          {
            value: "launched",
            label: "Already launched",
            icon: "🚀",
            description: "Product is in the market",
          },
          {
            value: "scaling",
            label: "Scaling up",
            icon: "📈",
            description: "Growing and expanding",
          },
        ].map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              className={`w-full p-4 rounded-lg border-2 transition-all ${data.stage === option.value ? "border-primary bg-blue-50" : "border-gray-200 hover:border-blue-200"}`}
              onClick={() => updateData("stage", option.value)}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-500 mt-1">
                {option.description}
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
