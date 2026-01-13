"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PersonalInfo, WorkExperience } from "@/types/resume";
import { revalidatePath } from "next/cache";

// -----Personal Info Section-----

async function saveSectionData(tableName: string, resumeId: string, data: any) {
  const supabase = await createSupabaseServerClient();

  // Check existence
  const { data: existingRow } = await supabase
    .from(tableName)
    .select("id")
    .eq("resume_id", resumeId)
    .single();

  let error;
  if (existingRow) {
    const result = await supabase
      .from(tableName)
      .update(data)
      .eq("resume_id", resumeId);
    error = result.error;
  } else {
    const result = await supabase
      .from(tableName)
      .insert({ ...data, resume_id: resumeId });
    error = result.error;
  }

  if (error) {
    console.error(`Error saving ${tableName}:`, error);
    throw new Error(`Failed to save ${tableName}`);
  }

  revalidatePath(`/resumes/${resumeId}`);
}

// update personal info
export async function updatePersonalInfo(
  resumeId: string,
  data: Partial<PersonalInfo>
) {
  await saveSectionData("personal_info", resumeId, data);
}

// --- WORK EXPERIENCE ACTIONS ---

// --- HELPER TO CLEAN DATES ---
function cleanResumeData(data: Partial<WorkExperience>) {
  return {
    ...data,
    // Convert empty string "" to null for database compatibility
    start_date: data.start_date === "" ? null : data.start_date,
    end_date: data.is_current || data.end_date === "" ? null : data.end_date,
  };
}

export async function addWorkExperience(
  resumeId: string,
  data: Partial<WorkExperience>
) {
  const supabase = await createSupabaseServerClient();

  // 1. Clean the data (convert "" -> null)
  const cleanedData = cleanResumeData(data);

  const { error } = await supabase.from("work_experience").insert({
    ...cleanedData,
    resume_id: resumeId,
  });

  if (error) {
    console.error("Error adding work experience:", error); // Check server terminal for this log if it fails again
    throw new Error(error.message);
  }

  revalidatePath(`/resumes/${resumeId}`);
}

export async function editWorkExperience(
  resumeId: string,
  experienceId: string,
  data: Partial<WorkExperience>
) {
  const supabase = await createSupabaseServerClient();

  // 1. Clean the data
  const cleanedData = cleanResumeData(data);

  const { error } = await supabase
    .from("work_experience")
    .update(cleanedData)
    .eq("id", experienceId);

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

export async function deleteWorkExperience(
  resumeId: string,
  experienceId: string
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("work_experience")
    .delete()
    .eq("id", experienceId);

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}
