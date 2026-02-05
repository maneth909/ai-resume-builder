"use client";

import { Lock } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeLimitModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white dark:bg-background w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center p-6 pt-8">
          <div className="p-4 bg-tertiary/10 rounded-full mb-4 text-tertiary ring-8 ring-tertiary/5">
            <Lock size={48} />
          </div>

          <h3 className="font-bold text-xl text-tertiary mb-2">
            Resume Limit Reached
          </h3>

          <p className="text-muted text-sm leading-relaxed px-4">
            You have reached the maximum limit of <strong>7 resumes</strong>.
            <br />
            Please delete an existing resume to create a new one.
          </p>
        </div>

        <div className="flex justify-center gap-3 px-6 pb-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-6 py-2.5 text-sm font-medium text-white bg-tertiary hover:bg-tertiary/90 rounded-lg transition-colors shadow-lg"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
