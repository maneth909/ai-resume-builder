"use client";

import { useState } from "react";
import { Skill } from "@/types/resume";
import { addSkill, deleteSkill } from "@/actions/sections";
import { Loader2, Plus, X, Wrench } from "lucide-react";

interface Props {
  resumeId: string;
  initialData: Skill[];
}

export default function SkillsForm({ resumeId, initialData }: Props) {
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newSkill.trim()) return;

    setLoading(true);
    try {
      await addSkill(resumeId, newSkill);
      setNewSkill(""); // Clear input on success
    } catch (error) {
      alert("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteSkill(resumeId, id);
    } catch (error) {
      alert("Failed to delete skill");
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
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-secondary rounded-full text-muted">
          <Wrench size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-tertiary">Skills</h3>
          <p className="text-xs text-muted">
            Add relevant skills to your profile.
          </p>
        </div>
      </div>

      {/* --- INPUT AREA --- */}
      <div className="relative">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Type a skill (e.g. React, Python) and press Enter..."
          className="w-full px-4 py-3 bg-transparent border border-border rounded-lg text-sm text-tertiary placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
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
        {initialData.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg bg-secondary/10">
            <p className="text-sm text-muted">No skills added yet.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {initialData.map((skill) => (
              <div
                key={skill.id}
                className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-whitecolor dark:bg-secondary border border-border rounded-full text-sm text-tertiary hover:border-primary/50 transition-colors shadow-sm"
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
