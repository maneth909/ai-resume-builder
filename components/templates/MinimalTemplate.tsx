import { Resume } from "@/types/resume";
import { format } from "date-fns";

export default function MinimalTemplate({ resume }: { resume: Resume }) {
  const { personal_info, work_experience, education, skills } = resume;
  const formatDate = (d: string | null) =>
    d ? format(new Date(d), "MMM yyyy") : "";

  return (
    <div className="font-serif p-10 bg-white h-full text-black">
      {/* Centered Header */}
      <div className="text-center border-b border-black pb-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{personal_info?.full_name}</h1>
        <div className="text-sm space-x-3">
          {personal_info?.email && <span>{personal_info.email}</span>}
          {personal_info?.phone && <span>| {personal_info.phone}</span>}
          {personal_info?.location && <span>| {personal_info.location}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {personal_info?.summary && (
          <section>
            <h2 className="text-center font-bold text-sm uppercase tracking-widest mb-3">
              Summary
            </h2>
            <p className="text-sm text-justify leading-relaxed">
              {personal_info.summary}
            </p>
          </section>
        )}

        {work_experience?.length && (
          <section>
            <h2 className="text-center font-bold text-sm uppercase tracking-widest mb-4">
              Experience
            </h2>
            <div className="space-y-4">
              {work_experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold italic">{exp.company}</h3>
                    <span className="text-xs">
                      {formatDate(exp.start_date)} –{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <div className="text-sm font-semibold mb-1">
                    {exp.job_title}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Simplified Education/Skills for brevity */}
        <div className="grid grid-cols-2 gap-8 pt-4">
          {education?.length && (
            <div>
              <h2 className="text-center font-bold text-sm uppercase tracking-widest mb-3">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="text-center mb-2">
                  <div className="font-bold text-sm">{edu.school}</div>
                  <div className="text-xs italic">{edu.degree}</div>
                </div>
              ))}
            </div>
          )}
          {skills?.length && (
            <div>
              <h2 className="text-center font-bold text-sm uppercase tracking-widest mb-3">
                Skills
              </h2>
              <div className="text-center text-sm">
                {skills.map((s) => s.name).join(" • ")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
