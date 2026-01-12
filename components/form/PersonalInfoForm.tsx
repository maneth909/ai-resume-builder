"use client";

import { PersonalInfo } from "@/types/resume";
import { updatePersonalInfo } from "@/actions/sections"; // Ensure this path is correct
import { useState } from "react";
import { Loader2, Save } from "lucide-react"; // Optional: Add nice icons

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
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset status when user types so they can save again
    if (status !== "idle") setStatus("idle");
  };

  const handleSave = async () => {
    setLoading(true);
    setStatus("idle");
    try {
      await updatePersonalInfo(resumeId, formData);
      setStatus("success");
      // Optional: Clear success message after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Removed the outer border/shadow and the <h2> Title 
          because ResumeEditor already provides them. */}

      <div className="grid grid-cols-1 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="full_name"
            value={formData.full_name || ""}
            onChange={handleChange}
            placeholder="e.g. Sok Dara"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="+855 12 345 678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Location</label>
          <input
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            placeholder="Phnom Penh, Cambodia"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <textarea
            name="summary"
            value={formData.summary || ""}
            onChange={handleChange}
            rows={5}
            placeholder="Briefly describe your professional background and goals..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          />
          <p className="text-xs text-gray-400 text-right">
            {(formData.summary || "").length} chars
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm">
          {status === "success" && (
            <span className="text-green-600 flex items-center gap-1 animate-in fade-in">
              ✓ Saved successfully
            </span>
          )}
          {status === "error" && (
            <span className="text-red-600 flex items-center gap-1 animate-in fade-in">
              ⚠ Error saving
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading || status === "success"}
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-white transition-all ${
            status === "success"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
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
