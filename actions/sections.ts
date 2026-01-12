"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PersonalInfo } from "@/types/resume";
import { revalidatePath } from "next/cache";

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
