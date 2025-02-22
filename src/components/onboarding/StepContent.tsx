import React from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import WelcomeStep from "./steps/WelcomeStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import RoleStep from "./steps/RoleStep";
import ExperienceStep from "./steps/ExperienceStep";
import TechInterestsStep from "./steps/TechInterestsStep";
import SkillsStep from "./steps/SkillsStep";
import LookingForStep from "./steps/LookingForStep";
import CollabPrefsStep from "./steps/CollabPrefsStep";
import BioStep from "./steps/BioStep";
// import PhotoStep from "./steps/PhotoStep";
import SocialLinksStep from "./steps/SocialLinksStep";
import ReviewStep from "./steps/ReviewStep";

interface StepContentProps {
  step?:
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
    | "socialLinks"
    | "review";
}

export default function StepContent({ step = "welcome" }: StepContentProps) {
  const { data, updateData } = useOnboarding();

  const renderStepContent = () => {
    switch (step) {
      case "welcome":
        return <WelcomeStep />;

      case "basicInfo":
        return <BasicInfoStep data={data} updateData={updateData} />;

      case "role":
        return <RoleStep data={data} updateData={updateData} />;

      case "experience":
        return <ExperienceStep data={data} updateData={updateData} />;

      case "techInterests":
        return <TechInterestsStep data={data} updateData={updateData} />;

      case "skills":
        return <SkillsStep data={data} updateData={updateData} />;

      case "lookingFor":
        return <LookingForStep data={data} updateData={updateData} />;

      case "collabPrefs":
        return <CollabPrefsStep data={data} updateData={updateData} />;

      case "bio":
        return <BioStep data={data} updateData={updateData} />;

      // case "photo":
      //   return <PhotoStep data={data} updateData={updateData} />;

      case "socialLinks":
        return <SocialLinksStep data={data} updateData={updateData} />;

      case "review":
        return <ReviewStep data={data} />;

      default:
        return (
          <div className="text-center">
            <h2 className="text-xl font-semibold">Unknown Step</h2>
            <p className="text-gray-500 mt-2">Please try again</p>
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      {renderStepContent()}
    </div>
  );
}
