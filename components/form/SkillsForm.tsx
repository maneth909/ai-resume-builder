"use client";

import { useState } from "react";
import { Skill } from "@/types/resume";
import { addSkill, deleteSkill } from "@/actions/sections"; // Ensure path is correct
import { Loader2, Plus, X, Wrench } from "lucide-react";
import { useResume } from "@/context/ResumeContext"; // 1. Import Context

interface Props {
  resumeId: string;
  initialData: Skill[];
}

export default function SkillsForm({ resumeId, initialData }: Props) {
  const { resumeData, updateResumeData, setIsSaving, markSaved } = useResume(); // 2. Use Context

  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false); // Global loading for the add action
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const skillName = newSkill.trim();
    if (!skillName) return;

    // 1. Optimistic Update (Show immediately)
    const tempId = `temp-${Date.now()}`;
    const tempSkill = { id: tempId, name: skillName };

    // Add to context immediately
    // Note: We cast as Skill because 'resume_id' is missing but not needed for display
    updateResumeData("skills", [...resumeData.skills, tempSkill as Skill]);

    // Reset input immediately
    setNewSkill("");
    setIsSaving(true);
    setLoading(true);

    try {
      // 2. Server Call
      const realSkill = await addSkill(resumeId, skillName);

      // 3. Swap Temp ID with Real ID in Context
      // This ensures that if the user deletes it right after, we have the correct DB ID
      const currentSkills = resumeData.skills.map((s) =>
        s.id === tempId ? realSkill : s,
      );
      updateResumeData("skills", currentSkills);

      markSaved();
    } catch (error) {
      console.error(error);
      alert("Failed to add skill");
      // Revert if failed
      const reverted = resumeData.skills.filter((s) => s.id !== tempId);
      updateResumeData("skills", reverted);
      setIsSaving(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    // 1. Optimistic Delete
    const previousSkills = resumeData.skills;
    const filteredSkills = resumeData.skills.filter((s) => s.id !== id);
    updateResumeData("skills", filteredSkills);
    setIsSaving(true);

    try {
      await deleteSkill(resumeId, id);
      markSaved();
    } catch (error) {
      console.error(error);
      alert("Failed to delete skill");
      // Revert on error
      updateResumeData("skills", previousSkills);
      setIsSaving(false);
    } finally {
      setDeletingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
      {/* --- INPUT AREA --- */}
      <div className="relative">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          // Only disable if we are actually waiting on the server strictly
          // But for optimistic UI, we usually let them keep typing.
          // However, to prevent ID collisions, keeping it disabled during the quick add is safer.
          disabled={loading}
          placeholder="Type a skill (e.g. React, Python) and press Enter..."
          className="w-full px-4 py-3 bg-inputboxbg border border-border rounded-lg text-sm text-tertiary placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
          autoFocus
        />
        <button
          onClick={() => handleAdd()}
          disabled={loading || !newSkill.trim()}
          className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:bg-secondary disabled:text-muted transition-all"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Plus size={16} />
          )}
        </button>
      </div>

      {/* --- TAG LIST --- */}
      <div className="min-h-[100px]">
        {resumeData.skills.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg bg-secondary/10">
            <p className="text-sm text-muted">No skills added yet.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <div
                key={skill.id}
                className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-inputboxbg border border-border rounded-full text-sm text-tertiary hover:border-primary/50 transition-colors shadow-sm animate-in zoom-in-95 duration-200"
              >
                <span>{skill.name}</span>
                <button
                  onClick={() => handleDelete(skill.id)}
                  disabled={deletingId === skill.id}
                  className="p-0.5 rounded-full hover:bg-error/10 text-muted hover:text-error transition-colors"
                >
                  {deletingId === skill.id ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <X size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
