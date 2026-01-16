import { getResumeWithAllData } from "@/lib/resume-detail";
import ResumeEditor from "@/components/editor/ResumeEditor";
import { notFound } from "next/navigation";

export default async function ResumeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResumeWithAllData(id);

  if (!resume) return notFound();

  return <ResumeEditor resume={resume} />;
}
