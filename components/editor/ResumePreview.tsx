"use client";

import { useState, useTransition } from "react";
import { Resume } from "@/types/resume";
import {
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
  Loader2,
} from "lucide-react";
import { updateResumeTemplate } from "@/actions/resume";

// Import Templates
import ModernTemplate from "@/components/templates/ModernTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";

// Template Config
const TEMPLATES = [
  { id: "modern", name: "Modern", component: ModernTemplate },
  { id: "professional", name: "Professional", component: ProfessionalTemplate },
  { id: "minimal", name: "Minimal", component: MinimalTemplate },
];

interface Props {
  resume: Resume;
  enableThemeSwitching?: boolean; // Only enable in editor, disable in thumbnail
}

export default function ResumePreview({
  resume,
  enableThemeSwitching = false,
}: Props) {
  // 1. Determine current index based on DB value or default to 0
  const initialIndex = TEMPLATES.findIndex(
    (t) => t.id === (resume.template_style || "modern"),
  );
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0,
  );
  const [isPending, startTransition] = useTransition();

  const CurrentTemplate = TEMPLATES[currentIndex].component;

  // 2. Handle Switching
  const handleSwitch = (direction: "prev" | "next") => {
    let newIndex = 0;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % TEMPLATES.length;
    } else {
      newIndex = (currentIndex - 1 + TEMPLATES.length) % TEMPLATES.length;
    }

    // Optimistic UI update
    setCurrentIndex(newIndex);

    // Save to DB
    startTransition(async () => {
      await updateResumeTemplate(resume.id, TEMPLATES[newIndex].id);
    });
  };

  return (
    <div className="relative group">
      {/* --- FLOATING SWITCHER (Only visible if enabled) --- */}
      {enableThemeSwitching && (
        <div className="absolute -top-16 left-0 right-0 flex justify-center items-center gap-4 z-50 mt-3 opacity-100 transition-opacity print:hidden">
          <button
            type="button" // CRITICAL: Prevent form submission
            onClick={() => handleSwitch("prev")}
            disabled={isPending}
            className="p-2 bg-white dark:bg-secondary border border-border rounded-full shadow-sm hover:scale-110 transition-transform text-tertiary"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-secondary border border-border rounded-full shadow-sm">
            {isPending ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <LayoutTemplate size={14} className="text-primary" />
            )}
            <span className="text-sm font-semibold text-tertiary w-24 text-center select-none">
              {TEMPLATES[currentIndex].name}
            </span>
          </div>

          <button
            type="button" // CRITICAL: Prevent form submission
            onClick={() => handleSwitch("next")}
            disabled={isPending}
            className="p-2 bg-white dark:bg-secondary border border-border rounded-full shadow-sm hover:scale-110 transition-transform text-tertiary"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* --- THE ACTUAL RESUME --- */}

      <div
        id="resume-preview"
        className="bg-transparent w-[210mm] min-h-[297mm] pb-4 overflow-hidden print:shadow-none print:m-0 print:pb-0"
      >
        <div className=" h-full">
          <CurrentTemplate resume={resume} />
        </div>
      </div>
    </div>
  );
}
