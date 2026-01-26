"use client";

import { useState } from "react";
import { Language } from "@/types/resume";
import { addLanguage, editLanguage, deleteLanguage } from "@/actions/sections";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  Globe,
  Check,
} from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { useDebouncedCallback } from "use-debounce";

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
  const { resumeData, updateResumeData, setIsSaving, markSaved } = useResume();

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<Language>>({
    name: "",
    proficiency: "Native",
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  const debouncedUpdate = useDebouncedCallback(
    async (id: string, data: Partial<Language>) => {
      try {
        await editLanguage(resumeId, id, data);
        markSaved();
      } catch (error) {
        console.error(error);
        setIsSaving(false);
      }
    },
    2000,
  );

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      // end "New Language" instead of "" to pass backend validation
      const newLang = await addLanguage(resumeId, {
        name: "New Language",
        proficiency: "Native",
      });

      // Guard clause in case the server action fails/returns null
      if (!newLang) throw new Error("Failed to create language record");

      updateResumeData("languages", [...resumeData.languages, newLang]);

      // This line ensures the user sees an empty input box to start typing immediately
      setFormData({ name: "", proficiency: "Native" });

      setErrors({});
      setCurrentId(newLang.id);
      setIsEditing(true);
    } catch (error) {
      console.error(error);
      alert("Failed to create language");
    } finally {
      setIsCreating(false);
    }
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

  const handleChange = (field: keyof Language, value: string) => {
    if (!currentId) return;

    if (field === "name" && !value.trim()) {
      setErrors({ name: "Language name is required" });
    } else {
      if (errors.name) setErrors({});
    }

    const newData = { ...formData, [field]: value };
    setFormData(newData);

    const updatedList = resumeData.languages.map((item) =>
      item.id === currentId ? { ...item, ...newData } : item,
    );
    updateResumeData("languages", updatedList as Language[]);

    setIsSaving(true);
    debouncedUpdate(currentId, newData);
  };

  const handleDelete = async (id: string) => {
    const isJustCreated = currentId === id && !formData.name;
    if (!isJustCreated && !confirm("Remove this language?")) return;

    try {
      await deleteLanguage(resumeId, id);
      const filteredList = resumeData.languages.filter(
        (item) => item.id !== id,
      );
      updateResumeData("languages", filteredList);

      if (currentId === id) {
        setIsEditing(false);
        setCurrentId(null);
      }
    } catch (error) {
      alert("Failed to delete");
    }
  };

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
        <div className="border-t border-border mb-6" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentId(null);
              }}
              className="p-1 hover:bg-secondary rounded-full text-muted transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h3 className="font-semibold text-tertiary">
              {currentId ? "Edit Language" : "Add Language"}
            </h3>
          </div>

          <button
            onClick={() => currentId && handleDelete(currentId)}
            className="text-muted hover:text-error transition-colors p-2 rounded-md hover:bg-error/10"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelStyles}>
              Language <span className="text-error">*</span>
            </label>
            <input
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputStyles}
              placeholder="e.g. English, French"
              autoFocus
            />
            {errors.name && (
              <p className="text-error text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={labelStyles}>Proficiency</label>
            <div className="relative">
              <select
                value={formData.proficiency || "Native"}
                onChange={(e) => handleChange("proficiency", e.target.value)}
                className={`${inputStyles} appearance-none cursor-pointer`}
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option
                    key={level}
                    value={level}
                    className="bg-whitecolor dark:bg-secondary text-tertiary"
                  >
                    {level}
                  </option>
                ))}
              </select>
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
            onClick={handleCreate}
            disabled={isCreating}
            className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {isCreating && <Loader2 className="animate-spin" size={14} />}
            Add Language
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resumeData.languages.map((item) => {
            // 2. CHECK VALIDITY
            const isInvalid = !item.name?.trim();

            return (
              <div
                key={item.id}
                onClick={() => handleEdit(item)}
                // 3. APPLY INVALID STYLES
                className={`group p-3 border rounded-lg bg-whitecolor dark:bg-secondary/20 transition-all flex items-center justify-between cursor-pointer ${
                  isInvalid
                    ? "border-error/50 hover:border-error bg-error/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-md text-tertiary">
                    <Globe size={16} />
                  </div>
                  <div>
                    {/* RED TEXT IF MISSING */}
                    <h4
                      className={`font-semibold text-sm ${
                        !item.name ? "text-error italic" : "text-tertiary"
                      }`}
                    >
                      {item.name || "(Missing Language)"}
                    </h4>
                    <p className="text-xs text-muted">{item.proficiency}</p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="p-2 text-muted hover:text-error hover:bg-error/10 rounded"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg text-muted hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium disabled:opacity-50"
          >
            {isCreating ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Plus size={16} />
            )}
            Add Another Language
          </button>
        </div>
      )}
    </div>
  );
}
