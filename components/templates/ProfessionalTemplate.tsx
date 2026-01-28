import { Resume } from "@/types/resume";
import { format } from "date-fns";

export default function ProfessionalTemplate({ resume }: { resume: Resume }) {
  const { personal_info, work_experience, education, skills, languages } =
    resume;
  const formatDate = (d: string | null) =>
    d ? format(new Date(d), "yyyy") : "";

  return (
    <div className="grid grid-cols-[30%_70%] h-full min-h-[297mm] bg-white text-sm">
      {/* Left Sidebar (Darker) */}
      <div className="bg-slate-800 text-white p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="font-bold text-lg border-b border-slate-600 pb-2">
            Contact
          </h2>
          <div className="text-xs space-y-1 opacity-90">
            <div className="break-all">{personal_info?.email}</div>
            <div>{personal_info?.phone}</div>
            <div>{personal_info?.location}</div>
          </div>
        </div>

        {skills?.length && (
          <div className="space-y-2">
            <h2 className="font-bold text-lg border-b border-slate-600 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="text-xs bg-slate-700 px-2 py-1 rounded"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {education?.length && (
          <div className="space-y-2">
            <h2 className="font-bold text-lg border-b border-slate-600 pb-2">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold">{edu.degree}</div>
                <div className="opacity-80">{edu.school}</div>
                <div className="opacity-60">
                  {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 uppercase leading-none">
            {personal_info?.full_name}
          </h1>
          <p className="text-slate-600 mt-2">{personal_info?.summary}</p>
        </div>

        {work_experience?.length && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
              Work Experience
            </h2>
            <div className="space-y-5">
              {work_experience.map((exp) => (
                <div key={exp.id}>
                  <h3 className="font-bold text-base">{exp.job_title}</h3>
                  <div className="text-slate-500 text-xs mb-2 flex justify-between">
                    <span>{exp.company}</span>
                    <span>
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
