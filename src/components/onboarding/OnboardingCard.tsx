import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import StepContent from "./StepContent";
import ProgressBar from "./ProgressBar";
import NavigationButtons from "./NavigationButtons";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { updateProfile } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type Step =
  | "welcome"
  | "basicInfo"
  | "role"
  | "experience"
  | "techInterests"
  | "skills"
  | "lookingFor"
  | "collabPrefs"
  | "bio"
  | "photo"
  | "linkedin"
  | "review";

interface OnboardingCardProps {
  currentStep?: Step;
  onStepChange?: (step: Step) => void;
}

const steps: Step[] = [
  "welcome",
  "basicInfo",
  "role",
  "experience",
  "techInterests",
  "skills",
  "lookingFor",
  "collabPrefs",
  "bio",
  "photo",
  "linkedin",
  "review",
];

export default function OnboardingCard({
  currentStep = "welcome",
  onStepChange = () => {},
}: OnboardingCardProps) {
  const [step, setStep] = useState<Step>(currentStep);
  const navigate = useNavigate();
  const { data } = useOnboarding();
  const { toast } = useToast();
  const currentStepIndex = steps.indexOf(step);

  const handleNext = async () => {
    if (currentStepIndex === steps.length - 1) {
      // On the last step, save all data
      try {
        await updateProfile({
          name: data.basicInfo.name,
          email: data.basicInfo.email,
          role: data.roles,
          stage: data.stage,
          interests: data.interests,
          skills: data.skills,
          looking_for: data.lookingFor,
          bio: data.bio,
          photo_url: data.photoUrl,
          linkedin_url: data.linkedinUrl,
          website_url: data.websiteUrl,
          twitter_url: data.twitterUrl,
          instagram_url: data.instagramUrl,
          youtube_url: data.youtubeUrl,
        });
        navigate("/discover");
        return;
      } catch (error) {
        console.error("Failed to save profile:", error);
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setStep(nextStep);
      onStepChange(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setStep(prevStep);
      onStepChange(prevStep);
    }
  };

  return (
    <div className="space-y-4">
      <ProgressBar
        currentStep={currentStepIndex + 1}
        totalSteps={steps.length}
      />
      <Card className="w-[480px] bg-white shadow-lg rounded-xl flex flex-col h-[600px] overflow-hidden">
        <div className="flex-1">
          <StepContent step={step} />
        </div>
        <NavigationButtons
          onNext={handleNext}
          onBack={handleBack}
          canGoBack={currentStepIndex > 0}
          canGoNext={true}
          nextLabel={
            currentStepIndex === steps.length - 1 ? "Complete" : "Continue"
          }
        />
      </Card>
    </div>
  );
}
