"use client";

import { useState } from "react";
import { Certification } from "@/types/resume";
import {
  addCertification,
  editCertification,
  deleteCertification,
} from "@/actions/sections";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  ArrowLeft,
  FileBadge,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

interface Props {
  resumeId: string;
  initialData: Certification[];
}

export default function CertificationForm({ resumeId, initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Certification, string>>
  >({});

  // Form State
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: "",
    issuer: "",
    issue_date: "",
    expiration_date: "",
    url: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      issuer: "",
      issue_date: "",
      expiration_date: "",
      url: "",
    });
    setErrors({});
    setCurrentId(null);
    setIsEditing(false);
  };

  const handleEdit = (item: Certification) => {
    setFormData({
      name: item.name || "",
      issuer: item.issuer || "",
      issue_date: item.issue_date || "",
      expiration_date: item.expiration_date || "",
      url: item.url || "",
    });
    setErrors({});
    setCurrentId(item.id);
    setIsEditing(true);
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof Certification, string>> = {};
    if (!formData.name?.trim())
      newErrors.name = "Certification name is required";
    if (!formData.issuer?.trim()) newErrors.issuer = "Issuer is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (currentId) {
        await editCertification(resumeId, currentId, formData);
      } else {
        await addCertification(resumeId, formData);
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
    if (!confirm("Delete this certification?")) return;
    try {
      await deleteCertification(resumeId, id);
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- STYLES ---
  const getInputStyles = (fieldName: keyof Certification) => {
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
            {currentId ? "Edit Certification" : "Add Certification"}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Name */}
          <div>
            <label className={labelStyles}>
              Name <span className="text-error">*</span>
            </label>
            <input
              value={formData.name || ""}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={getInputStyles("name")}
              placeholder="e.g. AWS Certified Solutions Architect"
            />
            {errors.name && (
              <p className="text-error text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Issuer */}
          <div>
            <label className={labelStyles}>
              Issuing Organization <span className="text-error">*</span>
            </label>
            <input
              value={formData.issuer || ""}
              onChange={(e) => {
                setFormData({ ...formData, issuer: e.target.value });
                if (errors.issuer) setErrors({ ...errors, issuer: undefined });
              }}
              className={getInputStyles("issuer")}
              placeholder="e.g. Amazon Web Services"
            />
            {errors.issuer && (
              <p className="text-error text-xs mt-1">{errors.issuer}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Issue Date</label>
              <input
                type="date"
                value={formData.issue_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, issue_date: e.target.value })
                }
                className={getInputStyles("issue_date")}
              />
            </div>
            <div>
              <label className={labelStyles}>Expiration Date</label>
              <input
                type="date"
                value={formData.expiration_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, expiration_date: e.target.value })
                }
                className={getInputStyles("expiration_date")}
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className={labelStyles}>Credential URL</label>
            <input
              type="url"
              value={formData.url || ""}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className={getInputStyles("url")}
              placeholder="https://..."
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
              <FileBadge size={24} />
            </div>
          </div>
          <p className="text-sm text-muted mb-4">
            No certifications added yet.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Add Certification
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
                  <h4 className="font-semibold text-tertiary">{item.name}</h4>
                  <p className="text-sm text-muted">{item.issuer}</p>

                  <div className="flex items-center gap-3 text-xs text-muted mt-1">
                    <span>
                      {item.issue_date
                        ? format(new Date(item.issue_date), "MMM yyyy")
                        : "No Date"}
                    </span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <ExternalLink size={12} />
                        Credential
                      </a>
                    )}
                  </div>
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
            Add Another Certification
          </button>
        </div>
      )}
    </div>
  );
}
