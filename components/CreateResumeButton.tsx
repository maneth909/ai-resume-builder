"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createResume } from "@/actions/resume";

export default function CreateResumeButton() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!title) return;

    setLoading(true);
    try {
      // Call the Server Action
      const newResumeId = await createResume(title);

      // Redirect to the Edit Page
      router.push(`/resumes/${newResumeId}`);
    } catch (error) {
      alert("Failed to create resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center p-4 border rounded-lg bg-gray-50 max-w-md">
      <input
        type="text"
        placeholder="Resume Name (e.g. My Tech Resume)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded flex-1"
      />
      <button
        onClick={handleCreate}
        disabled={loading || !title}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create New"}
      </button>
    </div>
  );
}
