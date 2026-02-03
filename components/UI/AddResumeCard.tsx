"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { createResume } from "@/actions/resume";
import ResumeLimitModal from "@/components/modals/ResumeLimitModal"; // Import

interface Props {
  resumeCount: number;
}

export default function AddResumeCard({ resumeCount }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleCreate = async () => {
    // 1. Client-side check
    if (resumeCount >= 7) {
      setShowLimitModal(true);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    try {
      const newResumeId = await createResume("Untitled Resume");
      router.push(`/resumes/${newResumeId}`);
    } catch (error: any) {
      if (error.message.includes("LIMIT_REACHED")) {
        setShowLimitModal(true);
      } else {
        console.error(error);
        alert("Failed to create resume");
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={handleCreate}
        className={`cursor-pointer group flex flex-col items-center justify-center gap-3 h-full min-h-[280px] w-full bg-white dark:bg-secondary/40 border-2 border-dashed border-border dark:border-border rounded-xl hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all duration-200 ${
          isLoading ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        <div className="h-12 w-12 rounded-full bg-muted/10 dark:muted/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-background transition-all shadow-sm shadow-muted/20 dark:hover:shadow-primary/10">
          {isLoading ? (
            <Loader2 className="animate-spin text-primary" size={24} />
          ) : (
            <Plus
              className="text-muted group-hover:text-primary transition-colors"
              size={24}
            />
          )}
        </div>
        <div className="text-center">
          <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
            {isLoading ? "Creating..." : "Create Blank Resume"}
          </p>
          {resumeCount >= 7 && (
            <span className="text-[10px] text-muted mt-1 block">
              Limit Reached (7/7)
            </span>
          )}
        </div>
      </div>

      <ResumeLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </>
  );
}
