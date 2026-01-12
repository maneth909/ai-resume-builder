"use client";

import { PersonalInfo } from "@/types/resume";
import { updatePersonalInfo } from "@/actions/resume";
import { useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      await updatePersonalInfo(resumeId, formData);
      setMessage("✅ Saved successfully!");
    } catch (error) {
      setMessage("❌ Error saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold">Personal Information</h2>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          name="full_name"
          value={formData.full_name || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="e.g. Manet"
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium">
          Professional Summary
        </label>
        <textarea
          name="summary"
          value={formData.summary || ""}
          onChange={handleChange}
          rows={4}
          className="w-full border p-2 rounded"
          placeholder="Briefly describe your experience..."
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">{message}</span>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
