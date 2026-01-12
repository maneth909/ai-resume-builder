import { Resume } from "@/types/resume";
import { format } from "date-fns"; // Make sure to npm install date-fns

export default function ResumePreview({ resume }: { resume: Resume }) {
  const {
    personal_info,
    work_experience,
    education,
    skills,
    languages,
    certifications,
    honors_awards,
    extra_curricular,
    resume_references,
  } = resume;

  // Helper to format dates safely
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM yyyy");
  };

  return (
    <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-10 mx-auto text-sm leading-relaxed text-gray-800">
      {/* --- HEADER --- */}
      <header className="border-b-2 border-gray-800 pb-6 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-2">
          {personal_info?.full_name || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {personal_info?.email && <span>{personal_info.email}</span>}
          {personal_info?.phone && <span>• {personal_info.phone}</span>}
          {personal_info?.location && <span>• {personal_info.location}</span>}
        </div>
      </header>

      {/* --- SUMMARY --- */}
      {personal_info?.summary && (
        <section className="mb-6">
          <h3 className="font-bold text-gray-900 uppercase mb-2 border-b border-gray-200 pb-1">
            Professional Summary
          </h3>
          <p className="text-gray-700">{personal_info.summary}</p>
        </section>
      )}

      {/* --- EXPERIENCE --- */}
      {work_experience && work_experience.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-gray-900 uppercase mb-3 border-b border-gray-200 pb-1">
            Experience
          </h3>
          <div className="space-y-4">
            {work_experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-semibold">
                  <h4>{exp.job_title}</h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <div className="text-gray-600 italic text-xs mb-1">
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </div>
                <p className="whitespace-pre-line text-xs text-gray-700">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- EDUCATION --- */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-gray-900 uppercase mb-3 border-b border-gray-200 pb-1">
            Education
          </h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between font-semibold">
                  <h4>{edu.school}</h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(edu.start_date)} -{" "}
                    {edu.is_current ? "Present" : formatDate(edu.end_date)}
                  </span>
                </div>
                <div className="text-sm">
                  {edu.degree}{" "}
                  {edu.field_of_study ? `in ${edu.field_of_study}` : ""}
                </div>
                {edu.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- SKILLS --- */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-gray-900 uppercase mb-2 border-b border-gray-200 pb-1">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* --- LANGUAGES --- */}
      {languages && languages.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-gray-900 uppercase mb-2 border-b border-gray-200 pb-1">
            Languages
          </h3>
          <ul className="list-disc list-inside text-sm">
            {languages.map((lang) => (
              <li key={lang.id}>
                <span className="font-medium">{lang.name}</span>
                {lang.proficiency && (
                  <span className="text-gray-500 text-xs ml-1">
                    ({lang.proficiency})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --- AWARDS & CERTIFICATIONS (Optional Layout) --- */}
      {(certifications?.length > 0 || honors_awards?.length > 0) && (
        <section className="mb-6">
          <h3 className="font-bold text-gray-900 uppercase mb-2 border-b border-gray-200 pb-1">
            Certifications & Awards
          </h3>
          <div className="space-y-2">
            {certifications?.map((cert) => (
              <div key={cert.id} className="text-sm">
                <span className="font-semibold">{cert.name}</span> —{" "}
                {cert.issuer} ({formatDate(cert.issue_date)})
              </div>
            ))}
            {honors_awards?.map((award) => (
              <div key={award.id} className="text-sm">
                <span className="font-semibold">{award.title}</span> —{" "}
                {award.issuer} ({formatDate(award.award_date)})
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
