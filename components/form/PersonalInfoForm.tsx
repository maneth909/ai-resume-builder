"use client";

import { PersonalInfo } from "@/types/resume";
import { updatePersonalInfo } from "@/actions/sections";
import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  resumeId: string;
  initialData: PersonalInfo | null;
}

export default function PersonalInfoForm({ resumeId, initialData }: Props) {
  const { updateResumeData, setIsSaving, markSaved } = useResume();

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

  // 2. The Debounced Saver (2 SECONDS)
  // We allow saving even with errors so user data is safe
  const debouncedSave = useDebouncedCallback(
    async (data: Partial<PersonalInfo>) => {
      try {
        await updatePersonalInfo(resumeId, data);
        markSaved();
      } catch (error) {
        console.error(error);
        setIsSaving(false);
      }
    },
    2000
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // 1. REAL-TIME VALIDATION (Visual Only)
    // We check if required fields are empty and set visual errors immediately
    let newError = undefined;

    if (name === "full_name" && !value.trim()) {
      newError = "Full Name is required";
    } else if (name === "email" && !value.trim()) {
      newError = "Email is required";
    } else if (name === "phone" && !value.trim()) {
      newError = "Phone is required";
    } else if (name === "location" && !value.trim()) {
      newError = "Location is required";
    }

    // Update Error State
    if (newError) {
      setErrors((prev) => ({ ...prev, [name]: newError }));
    } else {
      // Only clear error if one existed
      if (errors[name as keyof PersonalInfo]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }

    // 2. Immediate Updates
    const newData = { ...formData, [name]: value };
    setFormData(newData); // Update Input

    // Update Preview (Context)
    updateResumeData("personal_info", {
      ...initialData,
      ...newData,
    } as PersonalInfo);

    // 3. Set Status
    setIsSaving(true);

    // 4. Queue DB Call (Save regardless of errors)
    debouncedSave(newData);
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
    <div className="space-y-6 animate-in fade-in duration-300">
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

        {/* Summary */}
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
            <span className="text-error text-xs h-4 block"></span>
            <p className="text-xs text-muted text-right">
              {(formData.summary || "").length} chars
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
