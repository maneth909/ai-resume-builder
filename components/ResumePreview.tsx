import { Resume } from "@/types/resume";
import { format } from "date-fns";

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM yyyy");
  };

  return (
    <div
      id="resume-preview"
      className="bg-whitecolor dark:bg-background w-[210mm] min-h-[297mm] p-10 mx-auto text-sm leading-relaxed text-muted transition-colors print:bg-white print:text-black print:shadow-none print:m-0"
    >
      <header className="border-b-2 border-tertiary pb-6 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-tertiary mb-2">
          {personal_info?.full_name || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-muted">
          {personal_info?.email && <span>{personal_info.email}</span>}
          {personal_info?.phone && <span>• {personal_info.phone}</span>}
          {personal_info?.location && <span>• {personal_info.location}</span>}
        </div>
      </header>

      {/* --- SUMMARY --- */}
      {personal_info?.summary && (
        <section className="mb-6">
          <h3 className="font-bold text-tertiary uppercase mb-2 border-b border-border pb-1">
            Professional Summary
          </h3>
          <p className="text-muted">{personal_info.summary}</p>
        </section>
      )}

      {/* --- EXPERIENCE --- */}
      {work_experience && work_experience.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-tertiary uppercase mb-3 border-b border-border pb-1">
            Experience
          </h3>
          <div className="space-y-4">
            {work_experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-semibold text-tertiary">
                  <h4>{exp.job_title}</h4>
                  <span className="text-xs text-muted font-normal">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <div className="text-muted italic text-xs mb-1">
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </div>
                <p className="whitespace-pre-line text-xs text-muted">
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
          <h3 className="font-bold text-tertiary uppercase mb-3 border-b border-border pb-1">
            Education
          </h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between font-semibold text-tertiary">
                  <h4>{edu.school}</h4>
                  <span className="text-xs text-muted font-normal">
                    {formatDate(edu.start_date)} -{" "}
                    {edu.is_current ? "Present" : formatDate(edu.end_date)}
                  </span>
                </div>
                <div className="text-sm text-muted">
                  {edu.degree}{" "}
                  {edu.field_of_study ? `in ${edu.field_of_study}` : ""}
                </div>
                {edu.description && (
                  <p className="text-xs text-muted mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- SKILLS --- */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-tertiary uppercase mb-2 border-b border-border pb-1">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="bg-secondary text-tertiary px-2 py-1 rounded text-xs font-medium print:bg-gray-100 print:text-black"
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
          <h3 className="font-bold text-tertiary uppercase mb-2 border-b border-border pb-1">
            Languages
          </h3>
          <ul className="list-disc list-inside text-sm text-muted">
            {languages.map((lang) => (
              <li key={lang.id}>
                <span className="font-medium text-tertiary">{lang.name}</span>
                {lang.proficiency && (
                  <span className="text-muted text-xs ml-1">
                    ({lang.proficiency})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --- AWARDS & CERTIFICATIONS --- */}
      {(certifications?.length > 0 || honors_awards?.length > 0) && (
        <section className="mb-6">
          <h3 className="font-bold text-tertiary uppercase mb-2 border-b border-border pb-1">
            Certifications & Awards
          </h3>
          <div className="space-y-2 text-muted">
            {certifications?.map((cert) => (
              <div key={cert.id} className="text-sm">
                <span className="font-semibold text-tertiary">{cert.name}</span>{" "}
                — {cert.issuer} ({formatDate(cert.issue_date)})
              </div>
            ))}
            {honors_awards?.map((award) => (
              <div key={award.id} className="text-sm">
                <span className="font-semibold text-tertiary">
                  {award.title}
                </span>{" "}
                — {award.issuer} ({formatDate(award.award_date)})
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
