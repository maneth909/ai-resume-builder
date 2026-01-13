"use client";

import { useState } from "react";
import { Language } from "@/types/resume";
import { addLanguage, editLanguage, deleteLanguage } from "@/actions/sections";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  ArrowLeft,
  Globe,
  Check,
} from "lucide-react";

interface Props {
  resumeId: string;
  initialData: Language[];
}

const PROFICIENCY_LEVELS = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Beginner",
];

export default function LanguageForm({ resumeId, initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const [formData, setFormData] = useState<Partial<Language>>({
    name: "",
    proficiency: "Native",
  });

  const resetForm = () => {
    setFormData({ name: "", proficiency: "Native" });
    setErrors({});
    setCurrentId(null);
    setIsEditing(false);
  };

  const handleEdit = (item: Language) => {
    setFormData({
      name: item.name,
      proficiency: item.proficiency || "Native",
    });
    setErrors({});
    setCurrentId(item.id);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      setErrors({ name: "Language name is required" });
      return;
    }

    setLoading(true);
    try {
      if (currentId) {
        await editLanguage(resumeId, currentId, formData);
      } else {
        await addLanguage(resumeId, formData);
      }
      resetForm();
    } catch (error) {
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this language?")) return;
    try {
      await deleteLanguage(resumeId, id);
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- STYLES ---
  const inputStyles = `w-full px-3 py-2 bg-transparent border rounded-md text-sm text-tertiary placeholder-muted/50 focus:outline-none focus:ring-2 transition-all ${
    errors.name
      ? "border-error focus:ring-error"
      : "border-border focus:ring-primary focus:border-transparent"
  }`;

  const labelStyles =
    "block text-xs font-medium text-muted mb-1 uppercase tracking-wider";

  // --- VIEW 1: THE FORM ---
  if (isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={resetForm}
            className="p-1 hover:bg-secondary rounded-full text-muted transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-semibold text-tertiary">
            {currentId ? "Edit Language" : "Add Language"}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Language Name */}
          <div>
            <label className={labelStyles}>
              Language <span className="text-error">*</span>
            </label>
            <input
              value={formData.name || ""}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({});
              }}
              className={inputStyles}
              placeholder="e.g. English, French"
            />
            {errors.name && (
              <p className="text-error text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Proficiency Select */}
          <div>
            <label className={labelStyles}>Proficiency</label>
            <div className="relative">
              <select
                value={formData.proficiency || "Native"}
                onChange={(e) =>
                  setFormData({ ...formData, proficiency: e.target.value })
                }
                className={`${inputStyles} appearance-none cursor-pointer`}
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option
                    key={level}
                    value={level}
                    className="bg-whitecolor dark:bg-secondary"
                  >
                    {level}
                  </option>
                ))}
              </select>
              {/* Custom arrow for consistency */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 1L5 5L9 1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 2: THE LIST ---
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {initialData.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg bg-secondary/30">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-secondary rounded-full text-muted">
              <Globe size={24} />
            </div>
          </div>
          <p className="text-sm text-muted mb-4">No languages added yet.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Add Language
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {initialData.map((item) => (
            <div
              key={item.id}
              className="group p-3 border border-border rounded-lg bg-whitecolor dark:bg-secondary/20 hover:border-primary/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-md text-primary">
                  <Globe size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-tertiary text-sm">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted">{item.proficiency}</p>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-muted hover:text-error hover:bg-error/10 rounded"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg text-muted hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
          >
            <Plus size={16} />
            Add Another Language
          </button>
        </div>
      )}
    </div>
  );
}
