import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Resume } from "@/types/resume";

export async function getResumeWithAllData(id: string): Promise<Resume | null> {
  const supabase = await createSupabaseServerClient();

  // The "Super Query" - Fetches the resume + all 9 related tables
  const { data, error } = await supabase
    .from("resumes")
    .select(
      `
      *,
      personal_info (*),
      work_experience (*),
      education (*),
      skills (*),
      languages (*),
      extra_curricular (*),
      certifications (*),
      honors_awards (*),
      resume_references (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching resume data:", error);
    return null;
  }

  // Force the type
  const resume = data as unknown as Resume;

  // Client-side Sorting
  // Helper function to compare dates
  const sortByDate = (a: any, b: any) => {
    // If 'is_current' is true, it should be at the top
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;

    // Otherwise sort by start_date (Newest -> Oldest)
    const dateA = new Date(a.start_date || 0).getTime();
    const dateB = new Date(b.start_date || 0).getTime();
    return dateB - dateA;
  };

  if (resume.work_experience) {
    resume.work_experience.sort(sortByDate);
  }

  if (resume.education) {
    resume.education.sort(sortByDate);
  }

  if (resume.extra_curricular) {
    resume.extra_curricular.sort(sortByDate);
  }

  return resume;
}
