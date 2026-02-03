"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Resume } from "@/types/resume";

import { ResumeProvider, useResume } from "@/context/ResumeContext";
import SaveStatus from "@/components/editor/SaveStatus";
import { updateResumeTitle } from "@/actions/resume";

import { analyzeResume, getAiMode } from "@/actions/ai";
import {
  getRecentAnalyses,
  saveAnalysis,
  deleteAnalysis,
} from "@/actions/analysis";

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

import ApiKeyInput from "@/components/ApiKeyInput";
import ApiKeyModal from "@/components/ApiKeyModal";

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
  Settings,
  Copy,
  RefreshCcw,
  Loader2,
  Check,
  Key,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  AlertTriangle,
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
    description: "What you do beyond the job.",
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
  const { resumeData } = useResume();

  const activeSection =
    (searchParams.get("section") as SectionKey) || "personal_info";
  const isAIOpen = searchParams.get("ai") === "true";
  const activeSectionData = SECTIONS.find((s) => s.key === activeSection);

  const updateState = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [resumeTitle, setResumeTitle] = useState(resume.title);
  const handleTitleBlur = async () => {
    if (resumeTitle.trim() === "") setResumeTitle(resume.title);
    else if (resumeTitle !== resume.title)
      await updateResumeTitle(resume.id, resumeTitle);
  };

  // --- AI STATE ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [view, setView] = useState<"history" | "result" | "settings">(
    "history",
  );
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isSystemError, setIsSystemError] = useState(false);

  const [aiMode, setAiMode] = useState("USER");

  // --- DIALOG STATE (NEW) ---
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: "delete_analysis" | "remove_key" | null;
    itemId?: string; // Used if deleting specific history item
  }>({ isOpen: false, type: null });

  useEffect(() => {
    async function init() {
      const mode = await getAiMode(); // Fetch mode from server
      setAiMode(mode);

      const data = await getRecentAnalyses(resume.id);
      setHistory(data);

      // Only load local key if allowed
      if (mode !== "SYSTEM") {
        const storedKey = localStorage.getItem("user_groq_api_key");
        if (storedKey) setApiKey(storedKey);
      }
    }
    init();
  }, [resume.id]);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    if (key.trim()) localStorage.setItem("user_groq_api_key", key);
    else localStorage.removeItem("user_groq_api_key");
  };

  // --- ACTION HANDLERS ---
  const handleRunAnalysis = async (keyOverride?: string) => {
    setIsAnalyzing(true);

    // Use the override key (if provided) or the state key
    const effectiveKey = keyOverride ?? apiKey;

    try {
      const result = await analyzeResume(
        resumeData,
        jobDescription,
        effectiveKey,
      );
      setAnalysisResult(result);
      await saveAnalysis(resume.id, jobDescription, result);
      const updatedHistory = await getRecentAnalyses(resume.id);
      setHistory(updatedHistory);
      setView("result");

      // If successful, close the modal just in case
      setShowApiKeyModal(false);
    } catch (error: any) {
      // 1. Check for System Error (Server Config issue)
      if (error.message.includes("System Error")) {
        setIsSystemError(true);
        setShowApiKeyModal(true);
      }
      // 2. Check for User Error (Invalid Key)
      else if (
        error.message.includes("Invalid API Key") ||
        error.message.includes("add your Groq API Key")
      ) {
        setIsSystemError(false);
        setShowApiKeyModal(true);
      }
      // 3. Other Errors
      else {
        alert(error.message || "Analysis failed");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Unified Confirm Handler
  const executeConfirmation = async () => {
    if (dialog.type === "delete_analysis" && dialog.itemId) {
      // Delete History Item
      await deleteAnalysis(dialog.itemId);
      setHistory((prev) => prev.filter((i) => i.id !== dialog.itemId));
    } else if (dialog.type === "remove_key") {
      // Delete API Key
      handleSaveKey("");
    }
    // Close dialog
    setDialog({ isOpen: false, type: null });
  };

  // --- PRINTING ---
  const [isPrinting, setIsPrinting] = useState(false);
  const printContentRef = useRef<HTMLDivElement>(null);
  const reactToPrintTrigger = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: resumeTitle || "Resume",
    onAfterPrint: () => setIsPrinting(false),
    onPrintError: () => setIsPrinting(false),
    pageStyle: `@page { size: A4 portrait; margin: 0; } @media print { html, body { height: 100%; width: 100%; margin: 0 !important; padding: 0 !important; overflow: visible !important; } }`,
  } as any);
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => reactToPrintTrigger(), 100);
  };

  return (
    <div className="flex flex-col h-screen bg-whitecolor dark:bg-background text-tertiary transition-colors overflow-hidden relative">
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
            />
            <div className="h-4 flex items-center">
              <SaveStatus />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePrint()}
            disabled={isPrinting}
            className="px-3 py-2 text-sm font-medium text-whitecolor dark:text-background bg-tertiary rounded-md hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
          >
            {isPrinting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            <span className="hidden sm:inline">
              {isPrinting ? "Preparing..." : "Download PDF"}
            </span>
          </button>
          <div className="w-px h-8 bg-border mx-1" />
          <button
            onClick={() => updateState("ai", isAIOpen ? null : "true")}
            className={`p-2 rounded-md border transition-all ${
              isAIOpen
                ? "bg-primary text-whitecolor border-primary"
                : "bg-transparent text-primary border-primary hover:bg-primary/10"
            }`}
          >
            <Sparkles size={18} />
          </button>
        </div>
      </header>

      {/* ---------------- LAYOUT ---------------- */}
      <div className="flex flex-1 overflow-hidden">
        {/* NAV */}
        <div
          className={`bg-whitecolor dark:bg-secondary border-r border-border flex flex-col overflow-y-auto shrink-0 transition-[width] duration-300 ${
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

        {/* FORM */}
        <div
          className={`bg-whitecolor dark:bg-secondary border-r border-border overflow-y-auto p-6 scrollbar-hide shrink-0 transition-[width] duration-300 ${
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

        {/* PREVIEW */}
        <div className="flex-1 bg-secondary overflow-y-auto p-8 flex justify-center transition-all duration-300 pt-16 print:p-0 print:bg-white print:overflow-visible">
          <div
            className={`origin-top shadow-2xl transition-all duration-300 print:scale-100 print:shadow-none print:transform-none ${
              isAIOpen ? "scale-[0.75] xl:scale-[0.85]" : "scale-[0.85]"
            }`}
          >
            <div ref={printContentRef}>
              <ResumePreview resume={resumeData} enableThemeSwitching={true} />
            </div>
          </div>
        </div>

        {/* AI SIDEBAR */}
        <div
          className={`bg-whitecolor dark:bg-secondary border-l border-border transition-[width,opacity] duration-300 ease-in-out overflow-hidden flex flex-col ${
            isAIOpen ? "w-[380px] opacity-100" : "w-0 opacity-0"
          }`}
        >
          {/* HEADER */}
          <div className="h-14 border-b border-border flex items-center justify-center px-4 shrink-0 bg-whitecolor/80 dark:bg-secondary/80 backdrop-blur-md z-20 relative">
            {/* LEFT ALIGNED BUTTONS (Absolute) */}
            <div className="absolute left-4 flex items-center gap-3">
              {(view === "result" || view === "settings") && (
                <button
                  onClick={() => {
                    setView("history");
                    if (view === "result") setJobDescription("");
                  }}
                  className="p-1.5 -ml-2 rounded-full text-muted hover:bg-tertiary/5 hover:text-tertiary transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
            </div>

            {/* CENTERED TITLE */}
            <span className="text-base font-bold text-primary tracking-tight">
              {view === "result" && "AI Feedback"}
              {view === "history" && "AI Analysis"}
              {view === "settings" && "AI Settings"}
            </span>

            {/* RIGHT ALIGNED BUTTONS (Absolute) */}
            <div className="absolute right-4 flex items-center gap-1">
              {/* Refresh Button (Only on Result View) */}
              {view === "result" && (
                <button
                  onClick={() => handleRunAnalysis()}
                  disabled={isAnalyzing}
                  className="p-2 rounded-full text-muted hover:bg-tertiary/5 hover:text-tertiary transition-colors"
                  title="Re-analyze"
                >
                  <RefreshCcw
                    size={18}
                    className={isAnalyzing ? "animate-spin" : ""}
                  />
                </button>
              )}

              {/* Settings Button */}
              {aiMode !== "SYSTEM" && view === "history" && (
                <button
                  onClick={() => setView("settings")}
                  className="p-2 rounded-full text-muted hover:bg-tertiary/5 hover:text-tertiary transition-colors"
                  title="Settings"
                >
                  <Settings size={18} />
                </button>
              )}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-hidden relative bg-background/30 flex flex-col">
            {/* HISTORY */}
            {view === "history" && (
              <>
                {history.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="text-center space-y-2 mb-6">
                      <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Sparkles size={28} />
                      </div>
                      <h3 className="text-lg font-bold text-tertiary">
                        New Analysis
                      </h3>
                      <p className="text-xs text-muted max-w-[240px] mx-auto leading-relaxed">
                        Paste a job description below to start matching your
                        resume.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="w-full bg-whitecolor dark:bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm flex flex-col overflow-hidden">
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (!isAnalyzing && jobDescription.trim())
                                handleRunAnalysis();
                            }
                          }}
                          placeholder="Paste the full Job Description here..."
                          maxLength={5000}
                          className="w-full h-40 p-4 text-sm bg-transparent border-none focus:ring-0 resize-none placeholder:text-muted/40 outline-none scrollbar-thin"
                          autoFocus
                        />
                        <div className="flex items-center justify-between px-3 py-2 border-t border-border/40 bg-secondary/10">
                          <span className="text-[10px] text-muted font-medium">
                            {jobDescription.length} / 5000 chars
                          </span>
                          <button
                            onClick={() => handleRunAnalysis()}
                            disabled={isAnalyzing || !jobDescription.trim()}
                            className="bg-primary text-whitecolor px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="animate-spin" size={14} />{" "}
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <span>Analyze</span>
                                <Sparkles
                                  size={14}
                                  className="text-whitecolor"
                                />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-4">
                      <div className="flex items-center justify-between px-1 mb-2">
                        <h4 className="text-xs font-bold text-muted uppercase tracking-wider">
                          Recent ({history.length}/3)
                        </h4>
                      </div>
                      {history.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setAnalysisResult(item.analysis_result);
                            setJobDescription(item.job_description);
                            setView("result");
                          }}
                          className="group relative w-full text-left p-4 rounded-xl bg-whitecolor dark:bg-background border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="pr-6">
                            <div className="font-semibold text-sm text-tertiary truncate mb-1">
                              {item.job_title || "Untitled Analysis"}
                            </div>
                            <span className="text-[10px] text-muted">
                              {new Date(item.created_at).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                          {/* DELETE BUTTON - Opens Dialog */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDialog({
                                isOpen: true,
                                type: "delete_analysis",
                                itemId: item.id,
                              });
                            }}
                            className="absolute top-3 right-3 p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete Analysis"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="shrink-0 p-4 bg-whitecolor dark:bg-secondary border-t border-border z-10">
                      <div className="w-full bg-whitecolor dark:bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm flex flex-col overflow-hidden">
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (!isAnalyzing && jobDescription.trim())
                                handleRunAnalysis();
                            }
                          }}
                          placeholder="Paste new Job Description..."
                          maxLength={5000}
                          className="w-full h-40 p-3 text-sm bg-transparent border-none focus:ring-0 resize-none placeholder:text-muted/40 outline-none scrollbar-thin"
                        />
                        <div className="flex items-center justify-between px-3 py-2 border-t border-border/40 bg-secondary/10">
                          <span className="text-[10px] text-muted font-medium">
                            {jobDescription.length} / 5000 Chars
                          </span>
                          <button
                            onClick={() => handleRunAnalysis()}
                            disabled={isAnalyzing || !jobDescription.trim()}
                            className="p-1.5 bg-primary text-whitecolor rounded-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all shadow-sm"
                            title="Run Analysis"
                          >
                            {isAnalyzing ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Sparkles size={16} className="text-whitecolor" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* RESULT */}
            {view === "result" && (
              <div className="flex-1 overflow-y-auto p-4 pb-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-6 bg-whitecolor dark:bg-background border border-border rounded-xl overflow-hidden shadow-sm group">
                  <div className="flex items-center justify-between p-3 border-b border-border/50 bg-secondary/30">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider">
                      <Briefcase size={14} /> Job Context
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(jobDescription);
                        const icon = document.getElementById("copy-icon");
                        const check = document.getElementById("check-icon");
                        if (icon && check) {
                          icon.style.display = "none";
                          check.style.display = "block";
                          setTimeout(() => {
                            icon.style.display = "block";
                            check.style.display = "none";
                          }, 2000);
                        }
                      }}
                      className="text-muted hover:text-primary transition-colors p-1.5 rounded hover:bg-background"
                      title="Copy Job Description"
                    >
                      <Copy size={14} id="copy-icon" />
                      <Check
                        size={14}
                        id="check-icon"
                        className="hidden text-primary"
                      />
                    </button>
                  </div>
                  <div className="p-3 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent opacity-80 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-muted whitespace-pre-wrap leading-relaxed">
                      {jobDescription}
                    </p>
                  </div>
                </div>
                <div
                  className="text-sm text-muted leading-relaxed [&_h4]:font-bold [&_h4]:text-tertiary [&_h4]:mt-6 [&_h4]:mb-3 [&_h4]:text-base [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:mb-4 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-primary"
                  dangerouslySetInnerHTML={{ __html: analysisResult || "" }}
                />
              </div>
            )}

            {/* SETTINGS */}
            {view === "settings" && (
              <div className="flex-1 p-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-whitecolor dark:bg-background border border-border rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Key size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-tertiary">
                        API Configuration
                      </h3>
                      <p className="text-xs text-muted">
                        Manage your AI model connection.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-tertiary flex items-center gap-2">
                        Groq API Key
                        <span className="text-[10px] font-normal text-muted bg-secondary px-1.5 py-0.5 rounded">
                          Stored Locally
                        </span>
                      </label>
                      <ApiKeyInput
                        value={apiKey}
                        onChange={(val) => handleSaveKey(val)}
                      />

                      <p className="text-[10px] text-muted leading-relaxed">
                        <AlertCircle
                          size={10}
                          className="inline mr-1 mb-0.5 text-primary"
                        />
                        Your key is stored securely in your browser's local
                        storage. It is never saved to our database.
                      </p>
                    </div>
                    {apiKey && (
                      // UPDATED REMOVE KEY BUTTON - Opens Dialog
                      <button
                        onClick={() =>
                          setDialog({ isOpen: true, type: "remove_key" })
                        }
                        className="w-full py-2 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-xs font-medium transition-all"
                      >
                        <Trash2 size={14} /> Remove Key
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        initialKey={apiKey}
        isSystemError={isSystemError}
        onClose={() => setShowApiKeyModal(false)}
        onSave={(newKey) => {
          handleSaveKey(newKey); // Save to state localstorage
          handleRunAnalysis(newKey);
        }}
      />

      {/* ---------------- CUSTOM CONFIRM DIALOG ---------------- */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-whitecolor dark:bg-background border border-border rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 scale-100">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-tertiary">
                  {dialog.type === "remove_key"
                    ? "Remove API Key?"
                    : "Delete Analysis?"}
                </h3>
                <p className="text-sm text-muted mt-2">
                  {dialog.type === "remove_key"
                    ? "You will need to re-enter your key to use AI features again. This cannot be undone."
                    : "This analysis report will be permanently deleted from your history."}
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setDialog({ isOpen: false, type: null })}
                  className="flex-1 px-4 py-2 text-sm font-medium text-tertiary bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeConfirmation}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg shadow-red-500/20"
                >
                  {dialog.type === "remove_key" ? "Remove" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. Wrap in Suspense AND ResumeProvider
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
