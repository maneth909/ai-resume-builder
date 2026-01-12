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
