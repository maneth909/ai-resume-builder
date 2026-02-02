//@/actions/analysis.ts

"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveAnalysis(
  resumeId: string,
  jd: string,
  result: string,
) {
  const supabase = await createSupabaseServerClient();

  // 1. ENFORCE LIMIT: Get existing analyses sorted by newest first
  const { data: existing } = await supabase
    .from("resume_analyses")
    .select("id")
    .eq("resume_id", resumeId)
    .order("created_at", { ascending: false });

  // 2. If we have 3 or more, delete the oldest ones (keep top 2, so adding 1 makes 3)
  if (existing && existing.length >= 3) {
    const idsToDelete = existing.slice(2).map((r) => r.id); // Keep index 0 and 1

    if (idsToDelete.length > 0) {
      await supabase.from("resume_analyses").delete().in("id", idsToDelete);
    }
  }

  // 3. Insert the new analysis
  const jobTitle = jd.split("\n")[0].substring(0, 30) || "General Analysis";

  const { data, error } = await supabase
    .from("resume_analyses")
    .insert([
      {
        resume_id: resumeId,
        job_description: jd,
        analysis_result: result,
        job_title: jobTitle,
      },
    ])
    .select(); // Return data so UI updates immediately

  if (error) throw error;
  return data;
}

export async function deleteAnalysis(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("resume_analyses")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function getRecentAnalyses(resumeId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resume_analyses")
    .select("*")
    .eq("resume_id", resumeId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}
