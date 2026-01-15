// components/AddResumeCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X, FileText } from "lucide-react";
import { createResume } from "@/actions/resume";

export default function AddResumeCard() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newResumeId = await createResume(title.trim() || "Untitled Resume");
      router.push(`/resumes/${newResumeId}`);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create resume");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        // Fixed height to match thumbnails (h-[280px] covers thumb + footer area roughly)
        className="cursor-pointer group flex flex-col items-center justify-center gap-3 h-full min-h-[280px] w-full bg-white dark:bg-secondary/30 border-2 border-dashed border-border dark:border-border rounded-xl hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all duration-200"
      >
        <div className="h-12 w-12 rounded-full bg-muted/10 dark:muted/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-background transition-all shadow-sm shadow-muted/20 dark:hover:shadow-primary/10">
          <Plus
            className="text-muted group-hover:text-primary transition-colors"
            size={24}
          />
        </div>
        <div className="text-center">
          <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
            Create Blank Resume
          </p>
        </div>
      </div>

      {/* Model (pop-upscreen) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-background w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-4 ">
              <h3 className="font-semibold text-lg ">Resume Title</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-tertiary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-4">
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                    <FileText size={18} />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    autoFocus
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent placeholder:text-muted transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-muted hover:bg-secondary hover:text-tertiary rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {isLoading && <Loader2 className="animate-spin" size={16} />}
                  Create Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
