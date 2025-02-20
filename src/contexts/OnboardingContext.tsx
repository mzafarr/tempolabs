import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

type OnboardingData = {
  basicInfo: {
    name: string;
    email: string;
    gender?: "male" | "female";
    age?: string;
    country?: string;
    languages?: string[];
  };
  roles: string[];
  stage: string;
  interests: string[];
  skills: string[];
  lookingFor: string[];
  bio: string;
  photoUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
};

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
};

const defaultData: OnboardingData = {
  basicInfo: {
    name: "",
    email: "",
  },
  roles: [],
  stage: "",
  interests: [],
  skills: [],
  lookingFor: [],
  bio: "",
  photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  linkedinUrl: "",
  websiteUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const { user } = useAuth();

  // Reset data when user changes
  useEffect(() => {
    setData(defaultData);
  }, [user?.id]);

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
