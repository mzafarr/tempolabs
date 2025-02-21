import React, { useState, lazy, Suspense } from "react";
import { Step } from "./onboarding/OnboardingCard";
import AuthForm from "./auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const OnboardingCard = lazy(() => import("./onboarding/OnboardingCard"));

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const { user } = useAuth();

  return (
    <div className="flex mx-auto px-2 sm:px-4 py-8">
      {user ? (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <OnboardingCard
            key={user.id}
            currentStep={currentStep}
            onStepChange={(step) => setCurrentStep(step)}
          />
        </Suspense>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}
