import { getResumeWithAllData } from "@/lib/resume-detail";
import ResumeEditor from "@/components/editor/ResumeEditor";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";

export default async function ResumeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResumeWithAllData(id);

  if (!resume) return <div>Resume not found</div>;

  return (
    <div className="flex flex-col h-screen bg-whitecolor dark:bg-background text-tertiary">
      <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-whitecolor dark:bg-background shrink-0 z-10 transition-colors">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-secondary rounded-full text-muted hover:text-tertiary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="font-semibold text-tertiary">{resume.title}</h1>
            <p className="text-xs text-muted">Last saved just now</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-tertiary bg-transparent border border-border rounded-md hover:bg-secondary flex items-center gap-2 transition-colors">
            <Share2 size={16} />
            Share
          </button>

          <button className="px-4 py-2 text-sm font-medium text-whitecolor dark:text-background bg-tertiary rounded-md hover:opacity-90 flex items-center gap-2 transition-opacity">
            <Download size={16} />
            Download
          </button>
        </div>
      </header>

      <ResumeEditor resume={resume} />
    </div>
  );
}
