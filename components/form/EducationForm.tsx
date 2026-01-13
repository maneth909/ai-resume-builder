"use client";

import { useState } from "react";
import { Education } from "@/types/resume";
import {
  addEducation,
  editEducation,
  deleteEducation,
} from "@/actions/sections";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { format } from "date-fns";

interface Props {
  resumeId: string;
  initialData: Education[];
}

export default function EducationForm({ resumeId, initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Education, string>>
  >({});

  // Form State
  const [formData, setFormData] = useState<Partial<Education>>({
    school: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
  });

  const resetForm = () => {
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
    setCurrentId(null);
    setIsEditing(false);
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

  const validate = () => {
    const newErrors: Partial<Record<keyof Education, string>> = {};
    if (!formData.school?.trim()) newErrors.school = "School name is required";
    if (!formData.degree?.trim()) newErrors.degree = "Degree is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (currentId) {
        await editEducation(resumeId, currentId, formData);
      } else {
        await addEducation(resumeId, formData);
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
    if (!confirm("Delete this education entry?")) return;
    try {
      await deleteEducation(resumeId, id);
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- STYLES ---
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
            {currentId ? "Edit Education" : "Add Education"}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* School */}
          <div>
            <label className={labelStyles}>
              School / University <span className="text-error">*</span>
            </label>
            <input
              value={formData.school || ""}
              onChange={(e) => {
                setFormData({ ...formData, school: e.target.value });
                if (errors.school) setErrors({ ...errors, school: undefined });
              }}
              className={getInputStyles("school")}
              placeholder="e.g. Harvard University"
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
                onChange={(e) => {
                  setFormData({ ...formData, degree: e.target.value });
                  if (errors.degree)
                    setErrors({ ...errors, degree: undefined });
                }}
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
                onChange={(e) =>
                  setFormData({ ...formData, field_of_study: e.target.value })
                }
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
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`${getInputStyles("description")} resize-none`}
              placeholder="Additional details, honors, etc..."
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
              <GraduationCap size={24} />
            </div>
          </div>
          <p className="text-sm text-muted mb-4">No education added yet.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Add Education
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
                  <h4 className="font-semibold text-tertiary">{item.school}</h4>
                  <p className="text-sm text-muted">
                    {item.degree}{" "}
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
            Add Another School
          </button>
        </div>
      )}
    </div>
  );
}
