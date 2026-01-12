"use client";

import { deleteResume } from "@/actions/resume";
import { useState, useTransition } from "react";

export default function DeleteResumeButton({ resumeId }: { resumeId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume? This cannot be undone."
    );
    if (!confirmed) return;

    // call server action
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
      } catch (error) {
        alert("Failed to delete resume");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title="Delete Resume"
    >
      {isPending ? (
        // loading Spinner
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        // trash Icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      )}
    </button>
  );
}
