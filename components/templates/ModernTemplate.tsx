import { Resume } from "@/types/resume";
import { format } from "date-fns";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ModernTemplate({ resume }: { resume: Resume }) {
  const { personal_info, work_experience, education, skills, languages } =
    resume;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : format(date, "MMM yyyy");
  };

  return (
    <div className="text-sm leading-relaxed text-muted bg-white h-full">
      {/* Header */}
      <header className="border-b-2 border-tertiary pb-6 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-tertiary mb-2">
          {personal_info?.full_name || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-muted">
          {personal_info?.email && (
            <span className="flex items-center gap-1">
              <Mail size={12} />
              {personal_info.email}
            </span>
          )}
          {personal_info?.phone && (
            <span className="flex items-center gap-1">
              • <Phone size={12} />
              {personal_info.phone}
            </span>
          )}
          {personal_info?.location && (
            <span className="flex items-center gap-1">
              • <MapPin size={12} />
              {personal_info.location}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {personal_info?.summary && (
        <section className="mb-6">
          <h3 className="font-bold text-tertiary uppercase mb-2 border-b border-border pb-1">
            Professional Summary
          </h3>
          <p className="whitespace-pre-line">{personal_info.summary}</p>
        </section>
      )}

      {/* Experience */}
      {work_experience?.length && (
        <section className="mb-6">
          <h3 className="font-bold text-tertiary uppercase mb-3 border-b border-border pb-1">
            Experience
          </h3>
          <div className="space-y-4">
            {work_experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-semibold text-tertiary">
                  <h4>{exp.job_title}</h4>
                  <span className="text-xs font-normal">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <div className="text-muted italic text-xs mb-1">
                  {exp.company}
                </div>
                <p className="whitespace-pre-line text-xs">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rest of sections (Education, Skills, etc) simplified for brevity, paste your full code here */}
      {/* Education */}
      {education?.length && (
        <section className="mb-6">
          <h3 className="font-bold text-tertiary uppercase mb-3 border-b border-border pb-1">
            Education
          </h3>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between font-semibold">
                <div>{edu.school}</div>
                <div className="text-xs font-normal">
                  {formatDate(edu.start_date)} - {edu.end_date}
                </div>
              </div>
              <div className="text-xs">{edu.degree}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
