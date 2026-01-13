"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  PersonalInfo,
  WorkExperience,
  Education,
  Language,
  Certification,
} from "@/types/resume";
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

// --- EDUCATION ACTIONS ---
// Helper to clean dates
function cleanEducationData(data: Partial<Education>) {
  return {
    ...data,
    start_date: data.start_date === "" ? null : data.start_date,
    end_date: data.is_current || data.end_date === "" ? null : data.end_date,
  };
}

export async function addEducation(resumeId: string, data: Partial<Education>) {
  const supabase = await createSupabaseServerClient();
  const cleanedData = cleanEducationData(data);

  const { error } = await supabase.from("education").insert({
    ...cleanedData,
    resume_id: resumeId,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

export async function editEducation(
  resumeId: string,
  educationId: string,
  data: Partial<Education>
) {
  const supabase = await createSupabaseServerClient();
  const cleanedData = cleanEducationData(data);

  const { error } = await supabase
    .from("education")
    .update(cleanedData)
    .eq("id", educationId);

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

export async function deleteEducation(resumeId: string, educationId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("education")
    .delete()
    .eq("id", educationId);

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

// --- SKILLS ACTIONS ---
export async function addSkill(resumeId: string, name: string) {
  const supabase = await createSupabaseServerClient();

  if (!name.trim()) return;

  const { error } = await supabase.from("skills").insert({
    name: name.trim(),
    resume_id: resumeId,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

export async function deleteSkill(resumeId: string, skillId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("skills").delete().eq("id", skillId);

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

// --- LANGUAGE ACTIONS ---
export async function addLanguage(resumeId: string, data: Partial<Language>) {
  const supabase = await createSupabaseServerClient();

  if (!data.name?.trim()) return;

  const { error } = await supabase.from("languages").insert({
    name: data.name.trim(),
    proficiency: data.proficiency || "Native", // Default if missing
    resume_id: resumeId,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

export async function editLanguage(
  resumeId: string,
  languageId: string,
  data: Partial<Language>
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("languages")
    .update({
      name: data.name?.trim(),
      proficiency: data.proficiency,
    })
    .eq("id", languageId);

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

export async function deleteLanguage(resumeId: string, languageId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("languages")
    .delete()
    .eq("id", languageId);

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

// --- CERTIFICATION ACTIONS ---
function cleanCertificationData(data: Partial<Certification>) {
  return {
    ...data,
    issue_date: data.issue_date === "" ? null : data.issue_date,
    expiration_date: data.expiration_date === "" ? null : data.expiration_date,
  };
}

export async function addCertification(
  resumeId: string,
  data: Partial<Certification>
) {
  const supabase = await createSupabaseServerClient();
  const cleanedData = cleanCertificationData(data);

  const { error } = await supabase.from("certifications").insert({
    ...cleanedData,
    resume_id: resumeId,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

export async function editCertification(
  resumeId: string,
  certId: string,
  data: Partial<Certification>
) {
  const supabase = await createSupabaseServerClient();
  const cleanedData = cleanCertificationData(data);

  const { error } = await supabase
    .from("certifications")
    .update(cleanedData)
    .eq("id", certId);

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}

export async function deleteCertification(resumeId: string, certId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("id", certId);

  if (error) throw new Error(error.message);
  revalidatePath(`/resumes/${resumeId}`);
}
