import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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
  skillsLookingFor?: string[];
  languagesLookingFor?: string[];
  countriesLookingFor?: string[];
  roles: string[];
  stage: string;
  interests: string[];
  skills: string[];
  lookingFor: string[];
  bio: string;
  photoUrls?: string[];
  linkedinUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  otherUrl?: string;
};

type OnboardingContextType = {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
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
  photoUrls: [],
  linkedinUrl: "",
  websiteUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  githubUrl: "",
  otherUrl: "",
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      setData(defaultData);
    }
  }, [user?.id]);

  const updateData = useCallback(<K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const contextValue = useMemo(() => ({ data, updateData }), [data, updateData]);

  return (
    <OnboardingContext.Provider value={contextValue}>
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
