"use client";

import { useResume } from "@/context/ResumeContext";
import { Loader2, CheckCircle2, Cloud } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function SaveStatus() {
  const { isSaving, lastSaved } = useResume();
  const [timeAgo, setTimeAgo] = useState("Just now");

  // Update the "time ago" text every minute
  useEffect(() => {
    if (!lastSaved) return;

    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(lastSaved, { addSuffix: true }));
    }, 60000); // Update every 60 seconds

    // Initial set
    setTimeAgo(formatDistanceToNow(lastSaved, { addSuffix: true }));

    return () => clearInterval(interval);
  }, [lastSaved]);

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
        <Loader2 size={12} className="animate-spin" />
        <span>Saving changes...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted">
        <Cloud size={12} />
        <span>
          Saved {timeAgo === "less than a minute ago" ? "just now" : timeAgo}
        </span>
      </div>
    );
  }

  return <div className="text-xs text-muted">Ready to save</div>;
}
