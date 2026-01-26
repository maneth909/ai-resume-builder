"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// create new resume
export async function createResume(title: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

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

  return data.id;
}

// delete resume
export async function deleteResume(resumeId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting resume:", error);
    throw new Error("Failed to delete resume");
  }

  revalidatePath("/dashboard");
}

// rename resume title
export async function updateResumeTitle(resumeId: string, newTitle: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("resumes")
    .update({ title: newTitle, updated_at: new Date().toISOString() })
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (error) throw new Error("Failed to update title");

  revalidatePath("/dashboard");
}

export async function duplicateResume(resumeId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // 1. fetch the original resume with ALL relations
  const { data: original, error: fetchError } = await supabase
    .from("resumes")
    .select(
      `
      *,
      personal_info (*),
      work_experience (*),
      education (*),
      skills (*),
      languages (*),
      certifications (*),
      honors_awards (*),
      extra_curricular (*),
      resume_references (*)
    `,
    )
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !original) {
    throw new Error("Failed to fetch original resume");
  }

  // 2. create the new Resume Entry
  const { data: newResume, error: createError } = await supabase
    .from("resumes")
    .insert({
      title: `${original.title} (Copy)`,
      user_id: user.id,
      // let Supabase handle created_at/updated_at and id
    })
    .select()
    .single();

  if (createError) throw new Error("Failed to create copy");

  // 3. helper function to clean data (remove IDs) and insert
  const copyTable = async (tableName: string, data: any[] | any) => {
    if (!data) return;

    // normalize to array (Supabase sometimes returns single object for 1:1)
    const items = Array.isArray(data) ? data : [data];
    if (items.length === 0) return;

    // prepare rows: Remove 'id', 'created_at', 'updated_at' and set new 'resume_id'
    const rowsToInsert = items.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, created_at, updated_at, resume_id, ...rest } = item;
      return {
        ...rest,
        resume_id: newResume.id,
      };
    });

    const { error } = await supabase.from(tableName).insert(rowsToInsert);
    if (error) console.error(`Failed to copy ${tableName}:`, error);
  };

  // copy all related tables in parallel
  await Promise.all([
    copyTable("personal_info", original.personal_info),
    copyTable("work_experience", original.work_experience),
    copyTable("education", original.education),
    copyTable("skills", original.skills),
    copyTable("languages", original.languages),
    copyTable("certifications", original.certifications),
    copyTable("honors_awards", original.honors_awards),
    copyTable("extra_curricular", original.extra_curricular),
    copyTable("resume_references", original.resume_references),
  ]);

  revalidatePath("/dashboard");
  return newResume.id;
}
