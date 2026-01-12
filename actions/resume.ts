"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PersonalInfo } from "@/types/resume";
import { revalidatePath } from "next/cache";

export async function updatePersonalInfo(
  resumeId: string,
  data: Partial<PersonalInfo>
) {
  const supabase = await createSupabaseServerClient();

  // Check if a row already exists for this resume
  const { data: existingRow } = await supabase
    .from("personal_info")
    .select("id")
    .eq("resume_id", resumeId)
    .single();

  let error;

  if (existingRow) {
    // It exists -> UPDATE it
    const result = await supabase
      .from("personal_info")
      .update(data)
      .eq("resume_id", resumeId);
    error = result.error;
  } else {
    // It does not exist -> INSERT it
    const result = await supabase
      .from("personal_info")
      .insert({ ...data, resume_id: resumeId });
    error = result.error;
  }

  if (error) {
    console.error("Error saving personal info:", error);
    throw new Error("Failed to save personal info");
  }

  revalidatePath(`/resumes/${resumeId}`);
}

export async function createResume(title: string) {
  const supabase = await createSupabaseServerClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Insert the new resume
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      title: title,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating resume:", error);
    throw new Error("Failed to create resume");
  }

  return data.id; // Return the UUID of the new resume
}
