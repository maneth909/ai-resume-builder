"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Resume } from "@/types/resume";

import { ResumeProvider, useResume } from "@/context/ResumeContext";
import SaveStatus from "@/components/editor/SaveStatus";
import { updateResumeTitle } from "@/actions/resume";

import { analyzeResume } from "@/actions/ai";
import { Loader2, RefreshCcw } from "lucide-react";

// --- NEW IMPORTS ---
import { useReactToPrint } from "react-to-print";

import PersonalInfoForm from "@/components/form/PersonalInfoForm";
import WorkExperienceForm from "@/components/form/WorkExperienceForm";
import EducationForm from "@/components/form/EducationForm";
import ResumePreview from "@/components/editor/ResumePreview";
import SkillsForm from "@/components/form/SkillsForm";
import LanguageForm from "@/components/form/LanguageForm";
import CertificationForm from "@/components/form/CertificationForm";
import HonorAwardForm from "@/components/form/HonorAwardForm";
import ExtraCurricularForm from "@/components/form/ExtraCurricularForm";
import ReferenceForm from "@/components/form/ReferenceForm";

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
  Download,
  Sparkles,
  X,
  Bot,
} from "lucide-react";

// --- Sections config ---
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
  {
    key: "personal_info",
    label: "Personal Info",
    icon: <User size={18} />,
    description: "Who you are and how to reach you.",
  },
  {
    key: "work_experience",
    label: "Experience",
    icon: <Briefcase size={18} />,
    description: "Your work story, told in wins.",
  },
  {
    key: "education",
    label: "Education",
    icon: <GraduationCap size={18} />,
    description: "Where you learned your craft.",
  },
  {
    key: "skills",
    label: "Skills",
    icon: <Wrench size={18} />,
    description: "What you’re great at.",
  },
  {
    key: "languages",
    label: "Languages",
    icon: <Globe size={18} />,
    description: "The languages you speak with confidence.",
  },
  {
    key: "certifications",
    label: "Certifications",
    icon: <FileBadge size={18} />,
    description: "Proof of your extra expertise.",
  },
  {
    key: "honors_awards",
    label: "Honors",
    icon: <Award size={18} />,
    description: "Moments you earned applause.",
  },
  {
    key: "extra_curricular",
    label: "Extra-curriculars",
    icon: <Tent size={18} />,
    description: "What you do beyond the job.”",
  },
  {
    key: "resume_references",
    label: "References",
    icon: <Users size={18} />,
    description: "People who’ve got your back.",
  },
];

interface ResumeEditorProps {
  resume: Resume;
}

// main content component
function EditorContent({ resume }: ResumeEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // use 'resumeData' for the Preview so it updates live
  const { resumeData } = useResume();

  // get state from URL
  const activeSection =
    (searchParams.get("section") as SectionKey) || "personal_info";
  const isAIOpen = searchParams.get("ai") === "true";

  const activeSectionData = SECTIONS.find((s) => s.key === activeSection);

  // helper to update URL without reloading
  const updateState = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [resumeTitle, setResumeTitle] = useState(resume.title);
  const handleTitleBlur = async () => {
    if (resumeTitle.trim() === "") {
      setResumeTitle(resume.title);
      return;
    }
    if (resumeTitle !== resume.title) {
      await updateResumeTitle(resume.id, resumeTitle);
    }
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeData, jobDescription);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      alert("AI Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- PRINTING LOGIC START ---
  const [isPrinting, setIsPrinting] = useState(false);
  const printContentRef = useRef<HTMLDivElement>(null);

  // 2. Configure the print hook
  const reactToPrintTrigger = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: resumeTitle || "Resume",
    onAfterPrint: () => {
      // Turn off spinner when done
      setIsPrinting(false);
    },
    onPrintError: (error: any) => {
      console.error("Print failed:", error);
      setIsPrinting(false);
    },
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        html, body {
          height: 100%;
          width: 100%;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  } as any);

  // 3. Create a wrapper function to force the spinner UI
  const handlePrint = () => {
    setIsPrinting(true);

    setTimeout(() => {
      reactToPrintTrigger();
    }, 100);
  };
  // --- PRINTING LOGIC END ---

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
            <input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="font-semibold text-tertiary truncate max-w-[200px] sm:max-w-md bg-transparent border-none focus:ring-0 focus:outline-none p-0 leading-tight hover:underline cursor-text decoration-dashed underline-offset-4 decoration-muted/50"
              title="Click to rename"
            />
            <div className="h-4 flex items-center">
              <SaveStatus />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* DOWNLOAD BUTTON */}
          <button
            onClick={() => handlePrint()}
            disabled={isPrinting}
            className="px-3 py-2 text-sm font-medium text-whitecolor dark:text-background bg-tertiary rounded-md hover:opacity-90 flex items-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPrinting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">Preparing...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span className="hidden sm:inline">Download PDF</span>
              </>
            )}
          </button>

          <div className="w-px h-8 bg-border mx-1" />

          <button
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

      {/* ---------------- Main layout ---------------- */}
      <div className="flex flex-1 overflow-hidden">
        {/* COLUMN 1: side bar navigation */}
        <div
          className={`bg-whitecolor dark:bg-secondary border-r border-border flex flex-col overflow-y-auto shrink-0 transition-[width] duration-300 ease-in-out ${
            isAIOpen ? "w-20 items-center" : "w-51"
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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                {activeSectionData?.icon}
              </div>
              <h2 className="text-xl font-bold text-tertiary truncate">
                {activeSectionData?.label}
              </h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {activeSectionData?.description}
            </p>
          </div>

          {activeSection === "personal_info" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <PersonalInfoForm
                resumeId={resume.id}
                initialData={resume.personal_info || null}
              />
            </div>
          )}
          {activeSection === "work_experience" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <WorkExperienceForm
                resumeId={resume.id}
                initialData={resume.work_experience || []}
              />
            </div>
          )}
          {activeSection === "education" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <EducationForm
                resumeId={resume.id}
                initialData={resume.education || []}
              />
            </div>
          )}
          {activeSection === "skills" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <SkillsForm
                resumeId={resume.id}
                initialData={resume.skills || []}
              />
            </div>
          )}
          {activeSection === "languages" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <LanguageForm
                resumeId={resume.id}
                initialData={resume.languages || []}
              />
            </div>
          )}
          {activeSection === "certifications" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <CertificationForm
                resumeId={resume.id}
                initialData={resume.certifications || []}
              />
            </div>
          )}
          {activeSection === "honors_awards" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <HonorAwardForm
                resumeId={resume.id}
                initialData={resume.honors_awards || []}
              />
            </div>
          )}
          {activeSection === "extra_curricular" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <ExtraCurricularForm
                resumeId={resume.id}
                initialData={resume.extra_curricular || []}
              />
            </div>
          )}
          {activeSection === "resume_references" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <ReferenceForm
                resumeId={resume.id}
                initialData={resume.resume_references || []}
              />
            </div>
          )}
          {activeSection !== "personal_info" &&
            activeSection !== "work_experience" &&
            activeSection !== "education" &&
            activeSection !== "skills" &&
            activeSection !== "languages" &&
            activeSection !== "certifications" &&
            activeSection !== "honors_awards" &&
            activeSection !== "extra_curricular" &&
            activeSection !== "resume_references" && (
              <Placeholder
                name={
                  SECTIONS.find((s) => s.key === activeSection)?.label || ""
                }
              />
            )}
        </div>

        {/* COLUMN 3: PREVIEW AREA */}
        <div className="flex-1 bg-secondary overflow-y-auto p-8 flex justify-center transition-all duration-300 ease-in-out pt-16 print:p-0 print:bg-white print:overflow-visible">
          <div
            className={`origin-top shadow-2xl transition-all duration-300 print:scale-100 print:shadow-none print:transform-none ${
              isAIOpen ? "scale-[0.75] xl:scale-[0.85]" : "scale-[0.85]"
            }`}
          >
            {/* WRAP PREVIEW IN THE REF */}
            <div ref={printContentRef}>
              <ResumePreview resume={resumeData} enableThemeSwitching={true} />
            </div>
          </div>
        </div>

        {/* COLUMN 4: AI Sidebar */}
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
              onClick={() => updateState("ai", null)}
              className="text-muted hover:text-tertiary"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {!analysisResult && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="bg-primary/5 border border-primary/10 rounded-full p-4">
                  <Sparkles size={32} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-tertiary mb-1">
                    AI Resume Review
                  </h4>
                  <p className="text-xs text-muted max-w-[240px] mx-auto">
                    Get instant feedback on grammar, impact, and ATS
                    compatibility using Llama 3 power.
                  </p>
                </div>
                <div className="w-full text-left">
                  <label className="text-xs font-semibold text-muted ml-1">
                    Target Job Description (Optional)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-32 mt-1 p-3 text-xs bg-whitecolor dark:bg-background border border-border rounded-md focus:ring-1 focus:ring-primary focus:outline-none resize-none placeholder:text-muted/50"
                  />
                </div>
                <button
                  onClick={handleRunAnalysis}
                  className="px-6 py-2.5 bg-primary text-whitecolor text-sm font-medium rounded-full hover:opacity-90 transition-all shadow-sm shadow-primary/20 w-full"
                >
                  {jobDescription ? "Compare & Score" : "General Review"}
                </button>
              </div>
            )}
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Loader2 className="animate-spin text-primary" size={32} />
                <p className="text-sm text-muted animate-pulse">
                  Analyzing your resume...
                </p>
              </div>
            )}
            {analysisResult && !isAnalyzing && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-tertiary">
                    Analysis Report
                  </h3>
                  <button
                    onClick={handleRunAnalysis}
                    className="p-1.5 hover:bg-whitecolor dark:hover:bg-background rounded-full text-muted transition-colors"
                    title="Re-analyze"
                  >
                    <RefreshCcw size={16} />
                  </button>
                </div>
                <div
                  className="text-sm text-muted leading-relaxed [&_h4]:font-bold [&_h4]:text-tertiary [&_h4]:mt-6 [&_h4]:mb-3 [&_h4]:text-base [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:mb-4 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-primary"
                  dangerouslySetInnerHTML={{ __html: analysisResult }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Wrap in Suspense AND ResumeProvider (This fixes the error)
export default function ResumeEditor(props: ResumeEditorProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading Editor...
        </div>
      }
    >
      <ResumeProvider initialData={props.resume}>
        <EditorContent {...props} />
      </ResumeProvider>
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
