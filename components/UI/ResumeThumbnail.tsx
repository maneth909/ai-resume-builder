import ResumePreview from "../ResumePreview";
import { Resume } from "@/types/resume";

export default function ResumeThumbnail({ resume }: { resume: Resume }) {
  return (
    <div className="w-full h-full bg-white overflow-hidden relative cursor-pointer group-hover:opacity-90 transition-opacity">
      {/* Scale Logic: 
         - A4 width is 210mm (~793px). 
         - A 4-column grid card is roughly 280px-300px wide.
         - 300 / 793 ≈ 0.38 scale.
      */}
      <div className="absolute top-0 left-0 w-[210mm] min-h-[297mm] origin-top-left scale-[0.38] pointer-events-none select-none">
        <ResumePreview resume={resume} />
      </div>

      {/* Gradient fade at bottom  */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/5 to-transparent z-10" />

      {/* Click guard */}
      <div className="absolute inset-0 bg-transparent z-20" />
    </div>
  );
}
