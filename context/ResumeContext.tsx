"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Resume } from "@/types/resume";

interface ResumeContextType {
  resumeData: Resume;
  updateResumeData: <K extends keyof Resume>(
    sectionKey: K,
    data: Resume[K]
  ) => void;
  isLoading: boolean;
  // --- NEW: Saving Status ---
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  lastSaved: Date | null;
  markSaved: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: Resume;
}) {
  const [resumeData, setResumeData] = useState<Resume>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW STATES ---
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setResumeData(initialData);
  }, [initialData]);

  const updateResumeData = <K extends keyof Resume>(
    sectionKey: K,
    data: Resume[K]
  ) => {
    setResumeData((prev) => ({
      ...prev,
      [sectionKey]: data,
    }));
  };

  // Helper to update timestamp
  const markSaved = () => {
    setLastSaved(new Date());
    setIsSaving(false);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateResumeData,
        isLoading,
        isSaving,
        setIsSaving,
        lastSaved,
        markSaved,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context)
    throw new Error("useResume must be used within a ResumeProvider");
  return context;
}
