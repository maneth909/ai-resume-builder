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
  Save,
  ArrowLeft,
  Users,
  Mail,
  Phone,
} from "lucide-react";

interface Props {
  resumeId: string;
  initialData: Reference[];
}

export default function ReferenceForm({ resumeId, initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Reference, string>>
  >({});

  // Form State
  const [formData, setFormData] = useState<Partial<Reference>>({
    name: "",
    position: "",
    organization: "",
    email: "",
    phone: "",
    relationship: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      organization: "",
      email: "",
      phone: "",
      relationship: "",
    });
    setErrors({});
    setCurrentId(null);
    setIsEditing(false);
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

  const validate = () => {
    const newErrors: Partial<Record<keyof Reference, string>> = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.organization?.trim())
      newErrors.organization = "Organization is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (currentId) {
        await editReference(resumeId, currentId, formData);
      } else {
        await addReference(resumeId, formData);
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
    if (!confirm("Delete this reference?")) return;
    try {
      await deleteReference(resumeId, id);
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- STYLES ---
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
            {currentId ? "Edit Reference" : "Add Reference"}
          </h3>
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
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={getInputStyles("name")}
                placeholder="e.g. John Doe"
              />
              {errors.name && (
                <p className="text-error text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className={labelStyles}>Relationship</label>
              <input
                value={formData.relationship || ""}
                onChange={(e) =>
                  setFormData({ ...formData, relationship: e.target.value })
                }
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
                onChange={(e) => {
                  setFormData({ ...formData, organization: e.target.value });
                  if (errors.organization)
                    setErrors({ ...errors, organization: undefined });
                }}
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
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={getInputStyles("email")}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className={labelStyles}>Phone</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={getInputStyles("phone")}
                placeholder="+1 234 567 890"
              />
            </div>
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
              <Users size={24} />
            </div>
          </div>
          <p className="text-sm text-muted mb-4">No references added yet.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Add Reference
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
                  <p className="text-sm text-muted">
                    {item.position}
                    {item.position && item.organization && " at "}
                    {item.organization}
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
            Add Another Reference
          </button>
        </div>
      )}
    </div>
  );
}
