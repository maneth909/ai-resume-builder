export const dynamic = "force-dynamic";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/button/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import ResumeCardMenu from "@/components/UI/ResumeCardMenu";
import AddResumeCard from "@/components/UI/AddResumeCard";
import ResumeThumbnail from "@/components/UI/ResumeThumbnail";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Resume } from "@/types/resume";
import { LayoutTemplate, FileText } from "lucide-react";
import Image from "next/image";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  // check Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // fetch Data
  const { data: rawResumes } = await supabase
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
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  // transform Data
  const resumes = rawResumes?.map((resume: any) => ({
    ...resume,
    personal_info: Array.isArray(resume.personal_info)
      ? resume.personal_info[0]
      : resume.personal_info,
  })) as Resume[];

  // --- NEW: Calculate count ---
  const resumeCount = resumes ? resumes.length : 0;

  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-300">
      {/* --- top navigation bar --- */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* brand */}
          <div className="flex items-center gap-2 font-bold text-xl text-tertiary">
            <Image src="/logo.png" alt="Logo" width={28} height={28} />
            <span>JDify</span>
          </div>

          {/* right action */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* --- main content --- */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* header section */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-tertiary">Dashboard</h1>
            <p className="text-muted mt-1">All your resumes, chilling here.</p>
          </div>
          {resumes && resumes.length > 0 && (
            <div className="text-sm font-medium text-muted bg-white dark:bg-secondary/40 px-3 py-1 rounded-full border border-border">
              {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"}
            </div>
          )}
        </div>

        {/* --- grid layout --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* add new card (always first) - Pass resumeCount */}
          <div className="h-full">
            <AddResumeCard resumeCount={resumeCount} />
          </div>

          {/* Resume list */}
          {resumes?.map((resume) => (
            <div
              key={resume.id}
              className="group relative bg-white dark:bg-secondary/40 border border-border rounded-xl shadow-sm hover:shadow-md transition-all hover:border-primary/50 overflow-hidden flex flex-col h-full"
            >
              {/* Thumbnail area */}
              <Link
                href={`/resumes/${resume.id}`}
                className="block w-full h-[220px] bg-secondary/5 border-b border-border overflow-hidden relative"
              >
                {!resume.personal_info ? (
                  <div className="w-full h-full flex items-center justify-center text-muted/20">
                    <FileText size={48} />
                  </div>
                ) : (
                  <ResumeThumbnail resume={resume} />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* card footer: Title & Menu */}
              <div className="p-4 bg-white dark:bg-transparent flex justify-between items-start gap-3 mt-auto">
                {/* Title & Date */}
                <Link
                  href={`/resumes/${resume.id}`}
                  className="block flex-1 min-w-0"
                >
                  <h3 className="font-semibold text-base truncate text-tertiary group-hover:text-primary transition-colors">
                    {resume.title || "Untitled Resume"}
                  </h3>
                  <div className="text-xs text-muted mt-1">
                    Edited {formatDistanceToNow(new Date(resume.updated_at))}{" "}
                    ago
                  </div>
                </Link>

                {/* Right: The Menu Button - Pass resumeCount */}
                <div className="flex-shrink-0 -mt-1">
                  <ResumeCardMenu
                    resumeId={resume.id}
                    currentTitle={resume.title || "Untitled Resume"}
                    resumeCount={resumeCount}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!resumes || resumes.length === 0) && (
          <div className="mt-8 text-center text-muted"></div>
        )}
      </main>
    </div>
  );
}
