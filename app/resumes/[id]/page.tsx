import { getResumeWithAllData } from "@/lib/resume-detail";
import ResumeEditor from "@/components/editor/ResumeEditor";

export default async function ResumeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResumeWithAllData(id);

  if (!resume) return <div>Resume not found</div>;

  return <ResumeEditor resume={resume} />;
}
