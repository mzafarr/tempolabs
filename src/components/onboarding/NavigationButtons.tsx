import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface NavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

const NavigationButtons = ({
  onNext = () => {},
  onBack = () => {},
  canGoBack = true,
  canGoNext = true,
  nextLabel = "Continue",
  backLabel = "Back",
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between items-center w-full bg-white p-4">
      <motion.div
        whileHover={{ scale: canGoBack ? 1.02 : 1 }}
        whileTap={{ scale: canGoBack ? 0.98 : 1 }}
      >
        <Button
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack}
          className="flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 cursor-pointer relative z-10"
        >
          {nextLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
        {canGoNext && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md blur pointer-events-none"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default NavigationButtons;
