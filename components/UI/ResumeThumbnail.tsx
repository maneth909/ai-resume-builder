"use client";

import { useEffect, useRef, useState } from "react";
import ResumePreview from "../editor/ResumePreview";
import { Resume } from "@/types/resume";

export default function ResumeThumbnail({ resume }: { resume: Resume }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // 210mm in pixels is approximately 794px
        const resumeWidthPx = 794;
        const containerWidth = containerRef.current.clientWidth;

        // Calculate the exact scale needed to fit the width
        const newScale = containerWidth / resumeWidthPx;
        setScale(newScale);
      }
    };

    // Initial calculation
    updateScale();

    // Update on resize
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white overflow-hidden relative cursor-pointer group-hover:opacity-90 transition-opacity"
    >
      {/* dynamic scale application:
         1. origin-top-left: Anchors the resume to the top-left corner.
         2. style transform: Applies the calculated scale.
      */}
      <div
        className="absolute top-0 left-0 w-[210mm] min-h-[297mm] origin-top-left pointer-events-none select-none shadow-sm"
        style={{ transform: `scale(${scale})` }}
      >
        <ResumePreview resume={resume} enableThemeSwitching={false} />
      </div>

      {/* gradient fade at bottom to handle cutoff gracefully */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/5 to-transparent z-10" />

      {/* click guard */}
      <div className="absolute inset-0 bg-transparent z-20" />
    </div>
  );
}
