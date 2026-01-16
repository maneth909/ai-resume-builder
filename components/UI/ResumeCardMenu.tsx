"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  FileEdit,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { deleteResume, updateResumeTitle } from "@/actions/resume";

interface ResumeCardMenuProps {
  resumeId: string;
  currentTitle: string;
}

export default function ResumeCardMenu({
  resumeId,
  currentTitle,
}: ResumeCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false); // Controls the dropdown
  const [showRenameModal, setShowRenameModal] = useState(false); // Controls the modal
  const [title, setTitle] = useState(currentTitle);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    startTransition(async () => {
      await deleteResume(resumeId);
      setIsOpen(false);
    });
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === currentTitle || !title.trim()) {
      setShowRenameModal(false);
      return;
    }

    startTransition(async () => {
      await updateResumeTitle(resumeId, title);
      setShowRenameModal(false);
      setIsOpen(false);
    });
  };

  return (
    <>
      {/* --- Trigger button --- */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // stop click from triggering parent Link
            setIsOpen(!isOpen);
          }}
          className="p-1.5 text-muted hover:text-tertiary hover:bg-secondary/50 rounded-full transition-colors"
        >
          <MoreVertical size={20} />
        </button>

        {/* --- Dropdown menu --- */}
        {isOpen && (
          <div className="absolute bottom-full right-0 px-1 mb-2 w-32 bg-white dark:bg-background rounded-md shadow-xl border border-border py-1 animate-in fade-in zoom-in-95 duration-200 z-30">
            {/* Edit */}
            <Link
              href={`/resumes/${resumeId}`}
              className="flex items-center w-full rounded-sm px-4 py-2.5 text-sm text-tertiary hover:bg-secondary/50 transition-colors"
            >
              <FileEdit size={16} className="mr-2" />
              Edit
            </Link>

            {/* rename trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTitle(currentTitle); // reset title to current
                setShowRenameModal(true); // Open Modal
                setIsOpen(false); // close Dropdown
              }}
              className="flex items-center w-full rounded-sm px-4 py-2.5 text-sm text-tertiary hover:bg-secondary/50 transition-colors text-left"
            >
              <Pencil size={16} className="mr-2" />
              Rename
            </button>

            <div className="h-px bg-border my-1" />

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isPending}
              className="flex items-center w-full rounded-sm px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors text-left"
            >
              <Trash2 size={16} className="mr-2" />
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* --- Rename model (pop-up) --- */}
      {showRenameModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()} // prevent card click
        >
          <div
            className="bg-white dark:bg-background w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-4">
              <h3 className="font-semibold text-lg text-tertiary">
                Rename Resume
              </h3>
              <button
                onClick={() => setShowRenameModal(false)}
                className="text-muted hover:text-tertiary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRenameSubmit} className="px-6 py-4">
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                    <FileText size={18} />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Resume Title"
                    autoFocus
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent placeholder:text-muted transition-colors text-tertiary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRenameModal(false)}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-muted hover:bg-secondary hover:text-tertiary rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !title.trim()}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {isPending && <Loader2 className="animate-spin" size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
