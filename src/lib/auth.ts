import { supabase } from "./supabase";
import { Tables } from "@/types/supabase";

export type Profile = Tables<"profiles">;

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (data.user) {
    // Create empty profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: data.user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }
  }

  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: new Error("No user") };

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { data, error };
}

export async function updateProfile(profile: Partial<Profile>) {
  const user = await getCurrentUser();
  if (!user) return { error: new Error("No user") };

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...profile,
      gender: profile.gender,
      age: profile.age,
      country: profile.country,
      languages: profile.languages,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  return { data, error };
}

export async function needsOnboarding(): Promise<boolean> {
  const { data: profile, error } = await getProfile();
  if (error || !profile) return true;

  // Check if essential fields are filled
  const hasEssentialFields =
    profile.name &&
    profile.role?.length > 0 &&
    profile.skills?.length > 0 &&
    profile.interests?.length > 0;

  return !hasEssentialFields;
}
