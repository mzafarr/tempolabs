import React from "react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep?: number;
  totalSteps?: number;
}

const ProgressBar = ({
  currentStep = 1,
  totalSteps = 11,
}: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  const stepsLeft = totalSteps - currentStep;

  const getMessage = () => {
    if (currentStep <= 3) {
      return "Just a few quick steps to get started! 🚀";
    } else if (currentStep === totalSteps) {
      return "Great job, just click complete! 🎉";
    } else if (currentStep === totalSteps - 1) {
      return "I promise this is the last question! ⭐";
    } else if (stepsLeft <= 3) {
      return `Only ${stepsLeft} ${stepsLeft === 1 ? "step" : "steps"} remaining! 🎯`;
    } else {
      return "Almost there, you're doing great! 💪";
    }
  };

  return (
    <div className="w-full bg-white p-4 space-y-2">
      <motion.div
        className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </motion.div>
      <motion.div
        className="flex justify-between items-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-blue-600 font-medium">{getMessage()}</span>
        <span className="text-gray-500">{Math.round(progress)}%</span>
      </motion.div>
    </div>
  );
};

export default ProgressBar;
