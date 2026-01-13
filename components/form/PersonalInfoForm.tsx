"use client";

import { PersonalInfo } from "@/types/resume";
import { updatePersonalInfo } from "@/actions/sections";
import { useState } from "react";
import { Loader2, Save, AlertCircle } from "lucide-react";

interface Props {
  resumeId: string;
  initialData: PersonalInfo | null;
}

export default function PersonalInfoForm({ resumeId, initialData }: Props) {
  const [formData, setFormData] = useState<Partial<PersonalInfo>>(
    initialData || {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    }
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof PersonalInfo, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // clear error immediately when user types
    if (errors[name as keyof PersonalInfo]) {
      setErrors({ ...errors, [name]: undefined });
    }
    if (status !== "idle") setStatus("idle");
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof PersonalInfo, string>> = {};

    if (!formData.full_name?.trim())
      newErrors.full_name = "Full Name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("idle");
    try {
      await updatePersonalInfo(resumeId, formData);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const getInputStyles = (fieldName: keyof PersonalInfo) => {
    const hasError = !!errors[fieldName];
    return `w-full px-3 py-2 bg-transparent border rounded-md text-sm text-tertiary placeholder-muted/50 focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-error focus:ring-error"
        : "border-border focus:ring-primary focus:border-transparent"
    }`;
  };

  const labelStyles =
    "block text-xs font-medium text-muted mb-1 uppercase tracking-wider";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Full Name */}
        <div>
          <label className={labelStyles}>
            Full Name <span className="text-error">*</span>
          </label>
          <input
            name="full_name"
            value={formData.full_name || ""}
            onChange={handleChange}
            placeholder="e.g. John Snow"
            className={getInputStyles("full_name")}
          />
          {errors.full_name && (
            <p className="text-error text-xs mt-1">{errors.full_name}</p>
          )}
        </div>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyles}>
              Email <span className="text-error">*</span>
            </label>
            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="name@example.com"
              className={getInputStyles("email")}
            />
            {errors.email && (
              <p className="text-error text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className={labelStyles}>
              Phone <span className="text-error">*</span>
            </label>
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="+855 12 345 678"
              className={getInputStyles("phone")}
            />
            {errors.phone && (
              <p className="text-error text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className={labelStyles}>
            Location <span className="text-error">*</span>
          </label>
          <input
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            placeholder="Phnom Penh, Cambodia"
            className={getInputStyles("location")}
          />
          {errors.location && (
            <p className="text-error text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* Summary (Optional - No Asterisk) */}
        <div>
          <label className={labelStyles}>Professional Summary</label>
          <textarea
            name="summary"
            value={formData.summary || ""}
            onChange={handleChange}
            rows={5}
            placeholder="Briefly describe your professional background..."
            className={`${getInputStyles("summary")} resize-none`}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-error text-xs h-4 block">
              {errors.summary}
            </span>
            <p className="text-xs text-muted text-right">
              {(formData.summary || "").length} chars
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="text-sm">
          {status === "success" && (
            <span className="text-green-600 flex items-center gap-1 animate-in fade-in">
              ✓ Saved successfully
            </span>
          )}
          {status === "error" && (
            <span className="text-error flex items-center gap-1 animate-in fade-in">
              <AlertCircle size={16} />
              Please fix the errors above
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading || status === "success"}
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-white transition-all ${
            status === "success"
              ? "bg-green-600"
              : "bg-primary hover:opacity-90"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          {loading ? "Saving..." : status === "success" ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
