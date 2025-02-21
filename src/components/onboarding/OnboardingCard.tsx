import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import StepContent from "./StepContent";
import ProgressBar from "./ProgressBar";
import NavigationButtons from "./NavigationButtons";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { updateProfile } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export type Step =
  | "welcome"
  | "basicInfo"
  | "role"
  | "experience"
  | "techInterests"
  // | "skills"
  | "lookingFor"
  | "collabPrefs"
  | "bio"
  // | "photo"
  | "socialLinks"
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
  // "skills",
  "lookingFor",
  "collabPrefs",
  "bio",
  // "photo",
  "socialLinks",
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
          roles: data.roles,
          stage: data.stage,
          interests: data.interests,
          skills: data.skills,
          skills_looking_for: data.skillsLookingFor,
          languages_looking_for: data.languagesLookingFor,
          countries_looking_for: data.countriesLookingFor,
          bio: data.bio,
          photo_urls: data.photoUrls,

          github_url: data.githubUrl,
          linkedin_url: data.linkedinUrl,
          twitter_url: data.twitterUrl,
          tiktok_url: data.tiktokUrl,
          instagram_url: data.instagramUrl,
          youtube_url: data.youtubeUrl,
          other_url: data.otherUrl,
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
    <div className="space-y-4 max-w-screen mx-auto">
      <ProgressBar
        currentStep={currentStepIndex + 1}
        totalSteps={steps.length}
      />
      <Card className="max-w-[90vw] w-[600px] min-h-[600px] mx-auto bg-white shadow-lg rounded-xl flex flex-col">
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
