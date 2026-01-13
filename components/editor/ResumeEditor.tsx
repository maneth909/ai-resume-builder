"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Resume } from "@/types/resume";
import PersonalInfoForm from "@/components/form/PersonalInfoForm";
import WorkExperienceForm from "@/components/form/WorkExperienceForm";
import EducationForm from "@/components/form/EducationForm";
import ResumePreview from "@/components/ResumePreview";
import SkillsForm from "@/components/form/SkillsForm";
import LanguageForm from "@/components/form/LanguageForm";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  Award,
  FileBadge,
  Users,
  Tent,
  ArrowLeft,
  Share2,
  Download,
  Sparkles,
  X,
  Bot,
} from "lucide-react";

// --- SECTIONS CONFIG ---
type SectionKey =
  | "personal_info"
  | "work_experience"
  | "education"
  | "skills"
  | "languages"
  | "certifications"
  | "honors_awards"
  | "extra_curricular"
  | "resume_references";

const SECTIONS = [
  { key: "personal_info", label: "Personal Info", icon: <User size={20} /> },
  {
    key: "work_experience",
    label: "Experience",
    icon: <Briefcase size={20} />,
  },
  { key: "education", label: "Education", icon: <GraduationCap size={20} /> },
  { key: "skills", label: "Skills", icon: <Wrench size={20} /> },
  { key: "languages", label: "Languages", icon: <Globe size={20} /> },
  {
    key: "certifications",
    label: "Certifications",
    icon: <FileBadge size={20} />,
  },
  { key: "honors_awards", label: "Honors", icon: <Award size={20} /> },
  { key: "extra_curricular", label: "Activities", icon: <Tent size={20} /> },
  { key: "resume_references", label: "References", icon: <Users size={20} /> },
];

interface ResumeEditorProps {
  resume: Resume;
}

// 1. Create the Main Content Component
function EditorContent({ resume }: ResumeEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 2. Derive state from URL, default to "personal_info" and closed AI
  const activeSection =
    (searchParams.get("section") as SectionKey) || "personal_info";
  const isAIOpen = searchParams.get("ai") === "true";

  // 3. Helper to update URL without reloading
  const updateState = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // scroll: false prevents the page from jumping to top on click
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col h-screen bg-whitecolor dark:bg-background text-tertiary transition-colors overflow-hidden">
      {/* ---------------- APP BAR ---------------- */}
      <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-whitecolor dark:bg-background shrink-0 z-20 transition-all">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-secondary rounded-full text-muted hover:text-tertiary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-semibold text-tertiary truncate max-w-50">
              {resume.title}
            </h1>
            <p className="text-xs text-muted">Last saved just now</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ... existing buttons ... */}
          <button className="px-3 py-2 text-sm font-medium text-tertiary bg-transparent border border-border rounded-md hover:bg-secondary flex items-center gap-2 transition-colors">
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button className="px-3 py-2 text-sm font-medium text-whitecolor dark:text-background bg-tertiary rounded-md hover:opacity-90 flex items-center gap-2 transition-opacity">
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
          </button>

          <div className="w-px h-8 bg-border mx-1" />

          {/* AI TOGGLE BUTTON */}
          <button
            // UPDATE: Toggle URL param
            onClick={() => updateState("ai", isAIOpen ? null : "true")}
            className={`p-2 rounded-md border transition-all ${
              isAIOpen
                ? "bg-primary text-whitecolor border-primary"
                : "bg-transparent text-primary border-primary hover:bg-primary/10"
            }`}
            title="AI Analysis"
          >
            <Sparkles size={18} />
          </button>
        </div>
      </header>

      {/* ---------------- MAIN LAYOUT ---------------- */}
      <div className="flex flex-1 overflow-hidden">
        {/* COLUMN 1: SIDEBAR NAVIGATION */}
        <div
          className={`bg-whitecolor dark:bg-secondary border-r border-border flex flex-col overflow-y-auto shrink-0 transition-[width] duration-300 ease-in-out ${
            isAIOpen ? "w-20 items-center" : "w-48"
          }`}
        >
          <div className="p-4 space-y-1 w-full">
            <p
              className={`px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider transition-opacity duration-200 ${
                isAIOpen ? "opacity-0 h-0 p-0 overflow-hidden" : "opacity-100"
              }`}
            >
              Sections
            </p>

            {SECTIONS.map((section) => {
              const isActive = activeSection === section.key;
              return (
                <button
                  key={section.key}
                  // UPDATE: Set URL param
                  onClick={() => updateState("section", section.key)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all group relative ${
                    isAIOpen ? "justify-center w-full" : "w-full text-left"
                  } ${
                    isActive
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                      : "text-muted hover:bg-secondary hover:text-tertiary"
                  }`}
                  title={isAIOpen ? section.label : undefined}
                >
                  <span
                    className={
                      isActive
                        ? "text-primary"
                        : "text-muted group-hover:text-tertiary"
                    }
                  >
                    {section.icon}
                  </span>

                  <span
                    className={`text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      isAIOpen
                        ? "w-0 opacity-0 overflow-hidden hidden"
                        : "w-auto opacity-100"
                    }`}
                  >
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: FORM AREA */}
        <div
          className={`bg-whitecolor dark:bg-secondary border-r border-border overflow-y-auto p-6 scrollbar-hide shrink-0 transition-[width] duration-300 ease-in-out ${
            isAIOpen ? "w-[380px]" : "w-[500px]"
          }`}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-tertiary truncate">
              {SECTIONS.find((s) => s.key === activeSection)?.label}
            </h2>
            <p className="text-sm text-muted">Add details to your resume.</p>
          </div>

          {/* 1. PERSONAL INFO */}
          {activeSection === "personal_info" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <PersonalInfoForm
                resumeId={resume.id}
                initialData={resume.personal_info || null}
              />
            </div>
          )}

          {/* 2. WORK EXPERIENCE */}
          {activeSection === "work_experience" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <WorkExperienceForm
                resumeId={resume.id}
                initialData={resume.work_experience || []}
              />
            </div>
          )}

          {/* 3. EDUCATION */}
          {activeSection === "education" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <EducationForm
                resumeId={resume.id}
                initialData={resume.education || []}
              />
            </div>
          )}

          {/* 4. SKILLS */}
          {activeSection === "skills" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <SkillsForm
                resumeId={resume.id}
                initialData={resume.skills || []}
              />
            </div>
          )}

          {/* 5. LANGUAGES */}
          {activeSection === "languages" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <LanguageForm
                resumeId={resume.id}
                initialData={resume.languages || []}
              />
            </div>
          )}

          {activeSection !== "personal_info" &&
            activeSection !== "work_experience" &&
            activeSection !== "education" &&
            activeSection !== "skills" &&
            activeSection !== "languages" && (
              <Placeholder
                name={
                  SECTIONS.find((s) => s.key === activeSection)?.label || ""
                }
              />
            )}
        </div>

        {/* COLUMN 3: PREVIEW AREA */}
        <div className="flex-1 bg-secondary overflow-y-auto p-8 flex justify-center transition-all duration-300 ease-in-out">
          <div
            className={`origin-top shadow-2xl transition-all duration-300 ${
              isAIOpen ? "scale-[0.75] xl:scale-[0.85]" : "scale-[0.85]"
            }`}
          >
            <ResumePreview resume={resume} />
          </div>
        </div>

        {/* COLUMN 4: AI Analysis Sidebar */}
        <div
          className={`bg-whitecolor dark:bg-secondary border-l border-border transition-[width,opacity] duration-300 ease-in-out overflow-hidden flex flex-col ${
            isAIOpen ? "w-[350px] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Bot size={20} />
              <span>AI Assistant</span>
            </div>
            <button
              // UPDATE: Close AI via URL
              onClick={() => updateState("ai", null)}
              className="text-muted hover:text-tertiary"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-sm mb-2 text-tertiary">
                Analysis Ready
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                I can analyze your resume for keywords, grammar, and formatting
                issues.
              </p>
            </div>
            <div className="mt-8 text-center">
              <button className="px-4 py-2 bg-tertiary text-whitecolor text-xs rounded-full hover:opacity-90 transition-opacity">
                Analyze Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Wrap in Suspense (Required for useSearchParams in Next.js 14+)
export default function ResumeEditor(props: ResumeEditorProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading Editor...
        </div>
      }
    >
      <EditorContent {...props} />
    </Suspense>
  );
}

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg bg-background/50 text-muted">
      <p className="text-sm font-medium">{name} Form Coming Soon</p>
    </div>
  );
}
