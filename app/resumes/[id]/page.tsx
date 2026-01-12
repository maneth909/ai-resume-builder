import { getResumeWithAllData } from "@/lib/resume-detail";
import PersonalInfoForm from "@/components/form/PersonalInfoForm";

export default async function ResumeEditPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch the data (Server-side)
  const { id } = await params;
  const resume = await getResumeWithAllData(id);

  if (!resume) return <div>Resume not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Editing: {resume.title}</h1>

      {/* Pass the data to the Client Component */}
      <PersonalInfoForm
        resumeId={resume.id}
        initialData={resume.personal_info || null}
      />

      {/* add ExperienceForm, EducationForm here later... */}
    </div>
  );
}
