"use client";

import { useState } from "react";
import { WorkExperience } from "@/types/resume";
import {
  addWorkExperience,
  editWorkExperience,
  deleteWorkExperience,
} from "@/actions/sections"; // Ensure you have these actions in actions/sections.ts
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  ArrowLeft,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface Props {
  resumeId: string;
  initialData: WorkExperience[];
}

export default function WorkExperienceForm({ resumeId, initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validation State
  const [errors, setErrors] = useState<
    Partial<Record<keyof WorkExperience, string>>
  >({});

  // Form State
  const [formData, setFormData] = useState<Partial<WorkExperience>>({
    job_title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
  });

  const resetForm = () => {
    setFormData({
      job_title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    });
    setErrors({});
    setCurrentId(null);
    setIsEditing(false);
  };

  const handleEdit = (item: WorkExperience) => {
    setFormData({
      job_title: item.job_title || "",
      company: item.company || "",
      location: item.location || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      is_current: item.is_current || false,
      description: item.description || "",
    });
    setErrors({});
    setCurrentId(item.id);
    setIsEditing(true);
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof WorkExperience, string>> = {};
    if (!formData.job_title?.trim())
      newErrors.job_title = "Job Title is required";
    if (!formData.company?.trim()) newErrors.company = "Company is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (currentId) {
        await editWorkExperience(resumeId, currentId, formData);
      } else {
        await addWorkExperience(resumeId, formData);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this position?")) return;
    try {
      await deleteWorkExperience(resumeId, id);
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- STYLES (Themed) ---
  const getInputStyles = (fieldName: keyof WorkExperience) => {
    const hasError = !!errors[fieldName];
    return `w-full px-3 py-2 bg-transparent border rounded-md text-sm text-tertiary placeholder-muted/50 focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-error focus:ring-error"
        : "border-border focus:ring-primary focus:border-transparent"
    }`;
  };

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
            {currentId ? "Edit Experience" : "Add Experience"}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelStyles}>
              Job Title <span className="text-error">*</span>
            </label>
            <input
              value={formData.job_title || ""}
              onChange={(e) => {
                setFormData({ ...formData, job_title: e.target.value });
                if (errors.job_title)
                  setErrors({ ...errors, job_title: undefined });
              }}
              className={getInputStyles("job_title")}
              placeholder="e.g. Senior Software Engineer"
            />
            {errors.job_title && (
              <p className="text-error text-xs mt-1">{errors.job_title}</p>
            )}
          </div>

          <div>
            <label className={labelStyles}>
              Company <span className="text-error">*</span>
            </label>
            <input
              value={formData.company || ""}
              onChange={(e) => {
                setFormData({ ...formData, company: e.target.value });
                if (errors.company)
                  setErrors({ ...errors, company: undefined });
              }}
              className={getInputStyles("company")}
              placeholder="e.g. Google"
            />
            {errors.company && (
              <p className="text-error text-xs mt-1">{errors.company}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Start Date</label>
              <input
                type="date"
                value={formData.start_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className={getInputStyles("start_date")}
              />
            </div>
            <div>
              <label className={labelStyles}>End Date</label>
              <input
                type="date"
                disabled={formData.is_current}
                value={formData.end_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
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
                  onChange={(e) =>
                    setFormData({ ...formData, is_current: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="is_current"
                  className="text-xs text-tertiary select-none cursor-pointer"
                >
                  I currently work here
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className={labelStyles}>Location</label>
            <input
              value={formData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className={getInputStyles("location")}
              placeholder="e.g. New York, NY"
            />
          </div>

          <div>
            <label className={labelStyles}>Description</label>
            <textarea
              rows={6}
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`${getInputStyles("description")} resize-none`}
              placeholder="• Developed new features..."
            />
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
              <Briefcase size={24} />
            </div>
          </div>
          <p className="text-sm text-muted mb-4">
            No work experience added yet.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Add your first job
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {initialData.map((item) => (
            <div
              key={item.id}
              className="group p-4 border border-border rounded-lg bg-whitecolor dark:bg-secondary/20 hover:border-primary/50 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-tertiary">
                    {item.job_title}
                  </h4>
                  <p className="text-sm text-muted">
                    {item.company} • {item.location}
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
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-muted hover:text-error hover:bg-error/10 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
            Add Another Position
          </button>
        </div>
      )}
    </div>
  );
}
