"use client";

import { useState } from "react";
import { HonorAward } from "@/types/resume";
import {
  addHonorAward,
  editHonorAward,
  deleteHonorAward,
} from "@/actions/sections";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  ArrowLeft,
  Award,
} from "lucide-react";
import { format } from "date-fns";

interface Props {
  resumeId: string;
  initialData: HonorAward[];
}

export default function HonorAwardForm({ resumeId, initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof HonorAward, string>>
  >({});

  // Form State
  const [formData, setFormData] = useState<Partial<HonorAward>>({
    title: "",
    issuer: "",
    award_date: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      award_date: "",
      description: "",
    });
    setErrors({});
    setCurrentId(null);
    setIsEditing(false);
  };

  const handleEdit = (item: HonorAward) => {
    setFormData({
      title: item.title || "",
      issuer: item.issuer || "",
      award_date: item.award_date || "",
      description: item.description || "",
    });
    setErrors({});
    setCurrentId(item.id);
    setIsEditing(true);
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof HonorAward, string>> = {};
    if (!formData.title?.trim()) newErrors.title = "Award title is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (currentId) {
        await editHonorAward(resumeId, currentId, formData);
      } else {
        await addHonorAward(resumeId, formData);
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
    if (!confirm("Delete this award?")) return;
    try {
      await deleteHonorAward(resumeId, id);
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- STYLES ---
  const getInputStyles = (fieldName: keyof HonorAward) => {
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
            {currentId ? "Edit Award" : "Add Award"}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Title */}
          <div>
            <label className={labelStyles}>
              Award Title <span className="text-error">*</span>
            </label>
            <input
              value={formData.title || ""}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              className={getInputStyles("title")}
              placeholder="e.g. Employee of the Month"
            />
            {errors.title && (
              <p className="text-error text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Issuer & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Issuer / Organization</label>
              <input
                value={formData.issuer || ""}
                onChange={(e) =>
                  setFormData({ ...formData, issuer: e.target.value })
                }
                className={getInputStyles("issuer")}
                placeholder="e.g. Google"
              />
            </div>
            <div>
              <label className={labelStyles}>Date Awarded</label>
              <input
                type="date"
                value={formData.award_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, award_date: e.target.value })
                }
                className={getInputStyles("award_date")}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelStyles}>Description</label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`${getInputStyles("description")} resize-none`}
              placeholder="Brief details about the recognition..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-whitecolor rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
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
              <Award size={24} />
            </div>
          </div>
          <p className="text-sm text-muted mb-4">No awards added yet.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Add Award
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
                  <h4 className="font-semibold text-tertiary">{item.title}</h4>
                  <p className="text-sm text-muted">
                    {item.issuer}
                    {item.issuer && item.award_date && " • "}
                    {item.award_date
                      ? format(new Date(item.award_date), "MMM yyyy")
                      : ""}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
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
            Add Another Award
          </button>
        </div>
      )}
    </div>
  );
}
