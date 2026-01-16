"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { createResume } from "@/actions/resume";

export default function AddResumeCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // Create immediately with a default title
      const newResumeId = await createResume("Untitled Resume");
      router.push(`/resumes/${newResumeId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create resume");
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handleCreate}
      className={`cursor-pointer group flex flex-col items-center justify-center gap-3 h-full min-h-[280px] w-full bg-white dark:bg-secondary/30 border-2 border-dashed border-border dark:border-border rounded-xl hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all duration-200 ${
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
      </div>
    </div>
  );
}
