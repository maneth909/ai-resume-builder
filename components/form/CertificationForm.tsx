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
  ArrowLeft,
  FileBadge,
  ExternalLink,
  AlertCircle, // 1. Import Alert Icon
} from "lucide-react";
import { format } from "date-fns";
import { useResume } from "@/context/ResumeContext";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  resumeId: string;
  initialData: Certification[];
}

export default function CertificationForm({ resumeId, initialData }: Props) {
  const { resumeData, updateResumeData, setIsSaving, markSaved } = useResume();

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof Certification, string>>
  >({});

  const [formData, setFormData] = useState<Partial<Certification>>({
    name: "",
    issuer: "",
    issue_date: "",
    expiration_date: "",
    url: "",
  });

  const debouncedUpdate = useDebouncedCallback(
    async (id: string, data: Partial<Certification>) => {
      try {
        await editCertification(resumeId, id, data);
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
      // Create empty to trigger validation
      const newCert = await addCertification(resumeId, {
        name: "",
        issuer: "",
      });

      updateResumeData("certifications", [
        ...resumeData.certifications,
        newCert,
      ]);

      setFormData({
        name: "",
        issuer: "",
        issue_date: "",
        expiration_date: "",
        url: "",
      });
      setErrors({});
      setCurrentId(newCert.id);
      setIsEditing(true);
    } catch (error) {
      alert("Failed to create certification");
    } finally {
      setIsCreating(false);
    }
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

  const handleChange = (field: keyof Certification, value: string) => {
    if (!currentId) return;

    // 1. Validation Logic
    if (field === "name" && !value.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
    } else if (field === "issuer" && !value.trim()) {
      setErrors((prev) => ({ ...prev, issuer: "Issuer is required" }));
    } else {
      if (errors[field as keyof Certification]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    }

    // 2. Update Local State
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // 3. Update Preview
    const updatedList = resumeData.certifications.map((item) =>
      item.id === currentId ? { ...item, ...newData } : item,
    );
    updateResumeData("certifications", updatedList as Certification[]);

    // 4. Autosave
    setIsSaving(true);
    debouncedUpdate(currentId, newData);
  };

  const handleDelete = async (id: string) => {
    const isJustCreated = currentId === id && !formData.name;
    if (!isJustCreated && !confirm("Delete this certification?")) return;

    try {
      await deleteCertification(resumeId, id);
      const filteredList = resumeData.certifications.filter(
        (item) => item.id !== id,
      );
      updateResumeData("certifications", filteredList);

      if (currentId === id) {
        setIsEditing(false);
        setCurrentId(null);
      }
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const getInputStyles = (fieldName: keyof Certification) => {
    const hasError = !!errors[fieldName];
    return `w-full px-3 py-2 bg-inputboxbg border rounded-md text-sm text-tertiary placeholder-muted/50 focus:outline-none focus:ring-2 transition-all ${
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
            <h3 className="font-semibold text-tertiary">Edit Certification</h3>
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
          {/* Name */}
          <div>
            <label className={labelStyles}>
              Name <span className="text-error">*</span>
            </label>
            <input
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className={getInputStyles("name")}
              placeholder="e.g. AWS Certified Solutions Architect"
              autoFocus
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
              onChange={(e) => handleChange("issuer", e.target.value)}
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
                onChange={(e) => handleChange("issue_date", e.target.value)}
                className={getInputStyles("issue_date")}
              />
            </div>
            <div>
              <label className={labelStyles}>Expiration Date</label>
              <input
                type="date"
                value={formData.expiration_date || ""}
                onChange={(e) =>
                  handleChange("expiration_date", e.target.value)
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
              onChange={(e) => handleChange("url", e.target.value)}
              className={getInputStyles("url")}
              placeholder="https://..."
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
              <FileBadge size={24} />
            </div>
          </div>
          <p className="text-sm text-muted mb-4">
            No certifications added yet.
          </p>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {isCreating && <Loader2 className="animate-spin" size={14} />}
            Add Certification
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resumeData.certifications.map((item) => {
            // 2. CHECK VALIDITY
            const isInvalid = !item.name?.trim() || !item.issuer?.trim();

            return (
              <div
                key={item.id}
                onClick={() => handleEdit(item)}
                // 3. DYNAMIC BORDER & BG
                className={`group p-4 border rounded-lg bg-inputboxbg transition-all cursor-pointer relative ${
                  isInvalid
                    ? "border-error/50 hover:border-error bg-error/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-6">
                    {/* Name - Red if missing */}
                    <h4
                      className={`font-semibold truncate ${
                        !item.name ? "text-error italic" : "text-tertiary"
                      }`}
                    >
                      {item.name || "(Missing Name)"}
                    </h4>

                    {/* Issuer - Red if missing */}
                    <p
                      className={`text-sm ${
                        !item.issuer ? "text-error" : "text-muted"
                      }`}
                    >
                      {item.issuer || "(Missing Issuer)"}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted mt-1">
                      <span>
                        {item.issue_date
                          ? format(new Date(item.issue_date), "MMM yyyy")
                          : "No Date"}
                      </span>
                      {item.url && (
                        <span className="flex items-center gap-1 text-primary">
                          <ExternalLink size={12} />
                          Credential
                        </span>
                      )}
                    </div>
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
            Add Another Certification
          </button>
        </div>
      )}
    </div>
  );
}
