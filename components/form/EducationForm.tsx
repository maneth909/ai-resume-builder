"use client";

import { useState } from "react";
import { Education } from "@/types/resume";
import {
  addEducation,
  editEducation,
  deleteEducation,
} from "@/actions/sections"; // Update path if needed
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { format } from "date-fns";
import { useResume } from "@/context/ResumeContext";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  resumeId: string;
  initialData: Education[];
}

export default function EducationForm({ resumeId, initialData }: Props) {
  const { resumeData, updateResumeData, setIsSaving, markSaved } = useResume();

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof Education, string>>
  >({});

  const [formData, setFormData] = useState<Partial<Education>>({
    school: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
  });

  const debouncedUpdate = useDebouncedCallback(
    async (id: string, data: Partial<Education>) => {
      try {
        await editEducation(resumeId, id, data);
        markSaved();
      } catch (error) {
        console.error(error);
        setIsSaving(false);
      }
    },
    2000
  );

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      // Create empty to trigger validation styling immediately
      const newEdu = await addEducation(resumeId, {
        school: "",
        degree: "",
      });

      updateResumeData("education", [...resumeData.education, newEdu]);

      setFormData({
        school: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      });
      setErrors({});
      setCurrentId(newEdu.id);
      setIsEditing(true);
    } catch (error) {
      alert("Failed to create new entry");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (item: Education) => {
    setFormData({
      school: item.school || "",
      degree: item.degree || "",
      field_of_study: item.field_of_study || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      is_current: item.is_current || false,
      description: item.description || "",
    });
    setErrors({});
    setCurrentId(item.id);
    setIsEditing(true);
  };

  const handleChange = (field: keyof Education, value: string | boolean) => {
    if (!currentId) return;

    // 1. Validation Logic
    if (field === "school" && value === "") {
      setErrors((prev) => ({ ...prev, school: "School is required" }));
    } else if (field === "degree" && value === "") {
      setErrors((prev) => ({ ...prev, degree: "Degree is required" }));
    } else {
      if (errors[field as keyof Education]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    }

    // 2. Update Local State
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // 3. Update Preview
    const updatedList = resumeData.education.map((item) =>
      item.id === currentId ? { ...item, ...newData } : item
    );
    updateResumeData("education", updatedList as Education[]);

    // 4. Autosave
    setIsSaving(true);
    debouncedUpdate(currentId, newData);
  };

  const handleDelete = async (id: string) => {
    const isJustCreated = currentId === id && !formData.school;
    if (!isJustCreated && !confirm("Delete this education entry?")) return;

    try {
      await deleteEducation(resumeId, id);
      const filteredList = resumeData.education.filter(
        (item) => item.id !== id
      );
      updateResumeData("education", filteredList);

      if (currentId === id) {
        setIsEditing(false);
        setCurrentId(null);
      }
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const getInputStyles = (fieldName: keyof Education) => {
    const hasError = !!errors[fieldName];
    return `w-full px-3 py-2 bg-transparent border rounded-md text-sm text-tertiary placeholder-muted/50 focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-error focus:ring-error"
        : "border-border focus:ring-primary focus:border-transparent"
    }`;
  };

  const labelStyles =
    "block text-xs font-medium text-muted mb-1 uppercase tracking-wider";

  // --- VIEW 1: EDIT MODE ---
  if (isEditing) {
    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-300">
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
            <h3 className="font-semibold text-tertiary">Edit Education</h3>
          </div>

          <button
            onClick={() => currentId && handleDelete(currentId)}
            className="text-muted hover:text-error transition-colors p-2 rounded-md hover:bg-error/10"
            title="Delete this entry"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* School */}
          <div>
            <label className={labelStyles}>
              School / University <span className="text-error">*</span>
            </label>
            <input
              value={formData.school || ""}
              onChange={(e) => handleChange("school", e.target.value)}
              className={getInputStyles("school")}
              placeholder="e.g. Harvard University"
              autoFocus
            />
            {errors.school && (
              <p className="text-error text-xs mt-1">{errors.school}</p>
            )}
          </div>

          {/* Degree & Field */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>
                Degree <span className="text-error">*</span>
              </label>
              <input
                value={formData.degree || ""}
                onChange={(e) => handleChange("degree", e.target.value)}
                className={getInputStyles("degree")}
                placeholder="e.g. Bachelor's"
              />
              {errors.degree && (
                <p className="text-error text-xs mt-1">{errors.degree}</p>
              )}
            </div>
            <div>
              <label className={labelStyles}>Field of Study</label>
              <input
                value={formData.field_of_study || ""}
                onChange={(e) => handleChange("field_of_study", e.target.value)}
                className={getInputStyles("field_of_study")}
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Start Date</label>
              <input
                type="date"
                value={formData.start_date || ""}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className={getInputStyles("start_date")}
              />
            </div>
            <div>
              <label className={labelStyles}>End Date</label>
              <input
                type="date"
                disabled={formData.is_current}
                value={formData.end_date || ""}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className={`${getInputStyles("end_date")} ${
                  formData.is_current
                    ? "opacity-50 cursor-not-allowed bg-secondary/50"
                    : ""
                }`}
              />
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={formData.is_current}
                  onChange={(e) => handleChange("is_current", e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="is_current"
                  className="text-xs text-tertiary select-none cursor-pointer"
                >
                  I currently study here
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelStyles}>Description</label>
            <textarea
              rows={4}
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${getInputStyles("description")} resize-none`}
              placeholder="Additional details, honors, etc..."
            />
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
              <GraduationCap size={24} />
            </div>
          </div>
          <p className="text-sm text-muted mb-4">No education added yet.</p>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {isCreating && <Loader2 className="animate-spin" size={14} />}
            Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resumeData.education.map((item) => {
            // Check for missing required fields
            const isInvalid = !item.school?.trim() || !item.degree?.trim();

            return (
              <div
                key={item.id}
                onClick={() => handleEdit(item)}
                // Dynamic border styling based on validity
                className={`group p-4 border rounded-lg bg-whitecolor dark:bg-secondary/20 transition-all cursor-pointer relative ${
                  isInvalid
                    ? "border-error/50 hover:border-error bg-error/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    {/* School Name - Red if missing */}
                    <h4
                      className={`font-semibold ${
                        !item.school ? "text-error italic" : "text-tertiary"
                      }`}
                    >
                      {item.school || "(Missing School Name)"}
                    </h4>

                    {/* Degree - Red if missing */}
                    <p
                      className={`text-sm ${
                        !item.degree ? "text-error" : "text-muted"
                      }`}
                    >
                      {item.degree || "(Missing Degree)"}{" "}
                      {item.field_of_study ? `• ${item.field_of_study}` : ""}
                    </p>

                    <p className="text-xs text-muted mt-1">
                      {item.start_date
                        ? format(new Date(item.start_date), "MMM yyyy")
                        : ""}{" "}
                      -
                      {item.is_current
                        ? " Present"
                        : item.end_date
                        ? format(new Date(item.end_date), " MMM yyyy")
                        : ""}
                    </p>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-2 text-muted hover:text-error hover:bg-error/10 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
            Add Another School
          </button>
        </div>
      )}
    </div>
  );
}
