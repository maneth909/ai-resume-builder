import { Resume } from "@/types/resume";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

// Theme Constants
const COLORS = {
  header: "#1e2d42", // Very Dark Navy (Top Header)
  sidebar: "#3e5c76", // Dark Slate (Left Column)
  accent: "#98c1d9", // Light Blue Text Accent
  textMain: "#334155", // Slate text for body
  white: "#ffffff",
};

const ResumePage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white w-[210mm] min-h-[297mm] mb-10 shadow-2xl print:shadow-none print:m-0 print:break-after-page flex flex-col relative overflow-hidden font-sans text-sm">
    {children}
  </div>
);

export default function ModernTemplate({ resume }: { resume: Resume }) {
  const {
    personal_info,
    work_experience,
    education,
    skills,
    honors_awards,
    extra_curricular,
    languages,
    certifications,
    resume_references,
  } = resume;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : format(date, "MMM yyyy");
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 py-10 print:p-0 print:bg-white">
      <ResumePage>
        {/* ================= 1. FULL WIDTH HEADER ================= */}
        <header
          className="w-full p-8 py-10 shrink-0 flex flex-col justify-center min-h-[140px]"
          style={{ backgroundColor: COLORS.header, color: COLORS.white }}
        >
          <div className="flex flex-wrap justify-between items-end gap-6">
            {/* Name & Title */}
            <div className="max-w-[60%]">
              <h1 className="text-5xl font-bold tracking-tight uppercase mb-2 leading-none break-words">
                {personal_info?.full_name || "YOUR NAME"}
              </h1>
              <p
                className="font-medium tracking-[0.25em] text-xs uppercase pl-1"
                style={{ color: COLORS.accent }}
              >
                {work_experience?.[0]?.job_title || "PROFESSIONAL TITLE"}
              </p>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 gap-y-1.5 text-[10px] opacity-90 text-right min-w-[200px]">
              {personal_info?.phone && (
                <span className="flex items-center justify-end gap-2">
                  {personal_info.phone}{" "}
                  <Phone size={11} className="text-[#98c1d9]" />
                </span>
              )}
              {personal_info?.email && (
                <span className="flex items-center justify-end gap-2">
                  {personal_info.email}{" "}
                  <Mail size={11} className="text-[#98c1d9]" />
                </span>
              )}
              {personal_info?.location && (
                <span className="flex items-center justify-end gap-2">
                  {personal_info.location}{" "}
                  <MapPin size={11} className="text-[#98c1d9]" />
                </span>
              )}
              <span className="flex items-center justify-end gap-2">
                linkedin.com/in/user{" "}
                <Linkedin size={11} className="text-[#98c1d9]" />
              </span>
            </div>
          </div>
        </header>

        {/* ================= 2. MAIN CONTENT COLUMNS ================= */}
        <div className="flex flex-1 overflow-hidden">
          {/* --- LEFT SIDEBAR --- */}
          <aside
            className="w-[32%] p-6 flex flex-col gap-6 text-white"
            style={{ backgroundColor: COLORS.sidebar }}
          >
            {/* 1. EDUCATION */}
            <section>
              <h3 className="bg-white text-[#1e2d42] px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest mb-3 inline-block rounded-sm">
                Education
              </h3>
              <div className="space-y-4">
                {education?.map((edu) => (
                  <div key={edu.id} className="text-[11px]">
                    <p className="font-bold uppercase leading-tight mb-1">
                      {edu.school}
                    </p>
                    <p className="italic text-[#98c1d9] mb-1 text-[10px]">
                      {edu.degree}
                    </p>
                    <p className="opacity-75 text-[9px]">
                      {formatDate(edu.start_date)} —{" "}
                      {edu.is_current ? "Present" : formatDate(edu.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. SKILLS */}
            {skills && skills.length > 0 && (
              <section>
                <h3 className="bg-white text-[#1e2d42] px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest mb-3 inline-block rounded-sm">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 border border-white/20 text-white text-[10px] font-medium uppercase tracking-tight rounded-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 4. LANGUAGES */}
            {languages && languages.length > 0 && (
              <section>
                <h3 className="bg-white text-[#1e2d42] px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest mb-3 inline-block rounded-sm">
                  Languages
                </h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="flex justify-between items-end border-b border-white/10 pb-1"
                    >
                      <span className="text-[11px] font-bold uppercase">
                        {lang.name}
                      </span>
                      <span className="text-[9px] italic text-[#98c1d9]">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. HONORS & AWARDS */}
            {honors_awards && honors_awards.length > 0 && (
              <section>
                <h3 className="bg-white text-[#1e2d42] px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest mb-3 inline-block rounded-sm">
                  Honors & Awards
                </h3>
                <div className="space-y-3">
                  {honors_awards.map((award) => (
                    <div key={award.id} className="text-[11px]">
                      <p className="font-bold uppercase leading-tight mb-0.5 text-white">
                        {award.title}
                      </p>
                      <p className="text-[9px] italic text-[#98c1d9] opacity-90">
                        {award.issuer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. REFERENCES */}
            <section className="mt-auto pt-4 border-t border-white/10">
              <h3 className="bg-white text-[#1e2d42] px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest mb-3 inline-block rounded-sm">
                References
              </h3>
              <div className="space-y-3">
                {resume_references?.slice(0, 2).map((ref) => (
                  <div key={ref.id} className="text-[10px]">
                    <p className="font-bold uppercase text-[#98c1d9]">
                      {ref.name}
                    </p>
                    <p className="italic text-[9px] mb-0.5 opacity-90">
                      {ref.position}
                    </p>
                    <p className="opacity-75 break-words">{ref.email}</p>
                    <p className="opacity-75">{ref.phone}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* --- RIGHT COLUMN --- */}
          <main className="flex-1 bg-white p-8 space-y-5">
            {/* SUMMARY */}
            {personal_info?.summary && (
              <section>
                <h2
                  className="inline-block px-3 py-1 font-bold text-[11px] uppercase tracking-widest text-white mb-3 rounded-sm"
                  style={{ backgroundColor: COLORS.header }}
                >
                  Summary
                </h2>
                <p className="text-[11px] leading-relaxed text-gray-600 italic pl-1">
                  {personal_info.summary}
                </p>
              </section>
            )}

            {/* WORK EXPERIENCE */}
            {work_experience && work_experience.length > 0 && (
              <section>
                <h2
                  className="inline-block px-3 py-1 font-bold text-[11px] uppercase tracking-widest text-white mb-4 rounded-sm"
                  style={{ backgroundColor: COLORS.header }}
                >
                  Work Experience
                </h2>
                <div className="space-y-5">
                  {work_experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="border-l-4 border-[#1e2d42] pl-5 relative"
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-[13px] text-[#1e2d42] uppercase tracking-tight">
                          {exp.company}
                        </h4>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                          {formatDate(exp.start_date)} -{" "}
                          {exp.is_current
                            ? "Present"
                            : formatDate(exp.end_date)}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-[#3d5a80] mb-2 italic uppercase">
                        {exp.job_title}
                      </p>
                      <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EXTRACURRICULAR (FIXED) */}
            {extra_curricular && extra_curricular.length > 0 && (
              <section>
                <h2
                  className="inline-block px-3 py-1 font-bold text-[11px] uppercase tracking-widest text-white mb-4 rounded-sm"
                  style={{ backgroundColor: COLORS.header }}
                >
                  Extracurricular Activities
                </h2>
                <div className="space-y-4">
                  {extra_curricular.map((extra) => (
                    <div
                      key={extra.id}
                      className="border-l-4 border-[#3d5a80] pl-5"
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-[12px] text-[#1e2d42] uppercase">
                          {/* Logic: Show Org if it exists. If not, show Title here. */}
                          {extra.organization || extra.title}
                        </h4>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                          {formatDate(extra.start_date)}
                        </span>
                      </div>

                      {/* FIX: If Organization exists, we assume the title (role) hasn't been shown yet.
                          So we display it here as a sub-header, similar to Work Experience job titles. */}
                      {extra.organization && (
                        <p className="text-[10px] font-bold text-[#3d5a80] mb-1 italic uppercase">
                          {extra.title}
                        </p>
                      )}

                      <p className="text-[10px] text-gray-600 italic leading-tight">
                        {extra.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CERTIFICATIONS */}
            {certifications && certifications.length > 0 && (
              <section>
                <h2
                  className="inline-block px-3 py-1 font-bold text-[11px] uppercase tracking-widest text-white mb-3 rounded-sm"
                  style={{ backgroundColor: COLORS.header }}
                >
                  Certifications
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex flex-col text-[11px] border-b border-gray-100 pb-2"
                    >
                      <span className="font-bold text-[#1e2d42] uppercase text-[11px]">
                        {cert.name}
                      </span>
                      <span className="text-[10px] text-gray-500 italic">
                        {cert.issuer}{" "}
                        {cert.issue_date && `• ${cert.issue_date}`}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </ResumePage>
    </div>
  );
}
