import React, { useState } from "react";
import OnboardingCard from "./onboarding/OnboardingCard";
import AuthForm from "./auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

type Step =
  | "welcome"
  | "basicInfo"
  | "role"
  | "experience"
  | "techInterests"
  | "skills"
  | "collabPrefs"
  | "bio"
  | "lookingFor"
  | "photo"
  | "linkedin"
  | "review";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-screen-xl mx-auto w-full flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Tech Founder Matching
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Find your perfect co-founder or mentor match. Complete your profile
            to get started.
          </p>
        </div>

        {user ? (
          <OnboardingCard
            key={user.id} // Add key to force re-render for new user
            currentStep={currentStep}
            onStepChange={(step) => setCurrentStep(step)}
          />
        ) : (
          <AuthForm />
        )}
      </div>
    </div>
  );
}
