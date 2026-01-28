"use client";

import { useState } from "react";
import { Reference } from "@/types/resume";
import {
  addReference,
  editReference,
  deleteReference,
} from "@/actions/sections";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  Users,
  Mail,
  Phone,
  AlertCircle, // 1. Import Alert Icon
} from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  resumeId: string;
  initialData: Reference[];
}

export default function ReferenceForm({ resumeId, initialData }: Props) {
  const { resumeData, updateResumeData, setIsSaving, markSaved } = useResume();

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof Reference, string>>
  >({});

  const [formData, setFormData] = useState<Partial<Reference>>({
    name: "",
    position: "",
    organization: "",
    email: "",
    phone: "",
    relationship: "",
  });

  const debouncedUpdate = useDebouncedCallback(
    async (id: string, data: Partial<Reference>) => {
      try {
        await editReference(resumeId, id, data);
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
      const newRef = await addReference(resumeId, {
        name: "", // Empty triggers Name warning
        organization: "", // Empty triggers Org warning
      });

      updateResumeData("resume_references", [
        ...resumeData.resume_references,
        newRef,
      ]);

      setFormData({
        name: "",
        position: "",
        organization: "",
        email: "",
        phone: "",
        relationship: "",
      });
      setErrors({});
      setCurrentId(newRef.id);
      setIsEditing(true);
    } catch (error) {
      alert("Failed to create reference");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (item: Reference) => {
    setFormData({
      name: item.name || "",
      position: item.position || "",
      organization: item.organization || "",
      email: item.email || "",
      phone: item.phone || "",
      relationship: item.relationship || "",
    });
    setErrors({});
    setCurrentId(item.id);
    setIsEditing(true);
  };

  const handleChange = (field: keyof Reference, value: string) => {
    if (!currentId) return;

    // 1. Validation Logic
    if (field === "name" && !value.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
    } else if (field === "organization" && !value.trim()) {
      setErrors((prev) => ({
        ...prev,
        organization: "Organization is required",
      }));
    } else {
      if (errors[field as keyof Reference]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    }

    // 2. Update Local State
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // 3. Update Preview
    const updatedList = resumeData.resume_references.map((item) =>
      item.id === currentId ? { ...item, ...newData } : item,
    );
    updateResumeData("resume_references", updatedList as Reference[]);

    // 4. Autosave
    setIsSaving(true);
    debouncedUpdate(currentId, newData);
  };

  const handleDelete = async (id: string) => {
    const isJustCreated = currentId === id && !formData.name;
    if (!isJustCreated && !confirm("Delete this reference?")) return;

    try {
      await deleteReference(resumeId, id);
      const filteredList = resumeData.resume_references.filter(
        (item) => item.id !== id,
      );
      updateResumeData("resume_references", filteredList);

      if (currentId === id) {
        setIsEditing(false);
        setCurrentId(null);
      }
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const getInputStyles = (fieldName: keyof Reference) => {
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
            <h3 className="font-semibold text-tertiary">Edit Reference</h3>
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
          {/* Name & Relationship */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>
                Full Name <span className="text-error">*</span>
              </label>
              <input
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className={getInputStyles("name")}
                placeholder="e.g. John Doe"
                autoFocus
              />
              {errors.name && (
                <p className="text-error text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className={labelStyles}>Relationship</label>
              <input
                value={formData.relationship || ""}
                onChange={(e) => handleChange("relationship", e.target.value)}
                className={getInputStyles("relationship")}
                placeholder="e.g. Manager"
              />
            </div>
          </div>

          {/* Position & Organization */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>
                Organization <span className="text-error">*</span>
              </label>
              <input
                value={formData.organization || ""}
                onChange={(e) => handleChange("organization", e.target.value)}
                className={getInputStyles("organization")}
                placeholder="e.g. Google"
              />
              {errors.organization && (
                <p className="text-error text-xs mt-1">{errors.organization}</p>
              )}
            </div>
            <div>
              <label className={labelStyles}>Position</label>
              <input
                value={formData.position || ""}
                onChange={(e) => handleChange("position", e.target.value)}
                className={getInputStyles("position")}
                placeholder="e.g. CTO"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Email</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className={getInputStyles("email")}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className={labelStyles}>Phone</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={getInputStyles("phone")}
                placeholder="+1 234 567 890"
              />
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
              <Users size={24} />
            </div>
          </div>
          <p className="text-sm text-muted mb-4">No references added yet.</p>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {isCreating && <Loader2 className="animate-spin" size={14} />}
            Add Reference
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resumeData.resume_references.map((item) => {
            // 2. CHECK VALIDITY
            const isInvalid = !item.name?.trim() || !item.organization?.trim();

            return (
              <div
                key={item.id}
                onClick={() => handleEdit(item)}
                // 3. DYNAMIC BORDER & BG
                className={`group p-4 border rounded-lg bg-whitecolor dark:bg-secondary/20 transition-all cursor-pointer relative ${
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

                    <p className="text-sm text-muted">
                      {item.position}
                      {item.position && item.organization && " at "}
                      {/* Org - Red if missing */}
                      <span className={!item.organization ? "text-error" : ""}>
                        {item.organization || "(Missing Organization)"}
                      </span>
                    </p>

                    <div className="mt-2 space-y-1">
                      {item.email && (
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <Mail size={12} />
                          <span>{item.email}</span>
                        </div>
                      )}
                      {item.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <Phone size={12} />
                          <span>{item.phone}</span>
                        </div>
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
            Add Another Reference
          </button>
        </div>
      )}
    </div>
  );
}
