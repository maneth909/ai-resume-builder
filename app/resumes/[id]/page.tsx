import { getResumeWithAllData } from "@/lib/resume-detail"; // Adjust path if needed
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
    <div className="flex flex-col h-screen bg-white">
      {/* 1. APP BAR (Server Component part) */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-semibold text-gray-900">{resume.title}</h1>
            <p className="text-xs text-gray-500">Last saved just now</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
            <Share2 size={16} />
            Share
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 flex items-center gap-2">
            <Download size={16} />
            Download
          </button>
        </div>
      </header>

      {/* 2. THE EDITOR (Client Component) */}
      <ResumeEditor resume={resume} />
    </div>
  );
}
