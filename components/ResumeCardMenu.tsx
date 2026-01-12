"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { MoreVertical, Pencil, Trash2, FileEdit, X, Check } from "lucide-react";
import Link from "next/link";
import { deleteResume, updateResumeTitle } from "@/actions/resume";
import { useRouter } from "next/navigation";

interface ResumeCardMenuProps {
  resumeId: string;
  currentTitle: string;
}

export default function ResumeCardMenu({
  resumeId,
  currentTitle,
}: ResumeCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // focus input when renaming starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenaming]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    startTransition(async () => {
      await deleteResume(resumeId);
      setIsOpen(false);
    });
  };

  const handleRenameSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (title.trim() === currentTitle) {
      setIsRenaming(false);
      return;
    }

    startTransition(async () => {
      await updateResumeTitle(resumeId, title);
      setIsRenaming(false);
      setIsOpen(false);
    });
  };

  // render rename form
  if (isRenaming) {
    return (
      <form
        onSubmit={handleRenameSubmit}
        className="absolute top-4 right-4 z-20 flex items-center bg-white shadow-lg rounded-md p-1 border animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent card click
      >
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm border-none focus:ring-0 px-2 py-1 w-40 outline-none"
          placeholder="Resume Name"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="p-1 hover:bg-green-50 text-green-600 rounded"
        >
          <Check size={16} />
        </button>
        <button
          type="button"
          onClick={() => setIsRenaming(false)}
          className="p-1 hover:bg-red-50 text-red-500 rounded"
        >
          <X size={16} />
        </button>
      </form>
    );
  }

  // return default menu
  return (
    <div className="absolute top-4 right-4 z-10" ref={menuRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* edit */}
          <Link
            href={`/resumes/${resumeId}`}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <FileEdit size={16} className="mr-2" />
            Edit
          </Link>

          {/* rename */}
          <button
            onClick={() => {
              setIsRenaming(true);
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
          >
            <Pencil size={16} className="mr-2" />
            Rename
          </button>

          <div className="h-px bg-gray-100 my-1" />
          {/* OPTION 3: DELETE */}
          {/* delete */}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
          >
            <Trash2 size={16} className="mr-2" />
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
