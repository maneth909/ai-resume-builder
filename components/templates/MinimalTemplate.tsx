"use client";
import { Resume } from "@/types/resume";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { useEffect, useState, useRef, useLayoutEffect } from "react";

// --- THEME CONSTANTS  ---
const COLORS = {
  accent: "#1e5c76",
  textMain: "#334155",
  textSub: "#617280",
  border: "#e5e7eb",
};

// --- A4 CONSTANTS ---
const A4_HEIGHT_PX = 1122;
const HEADER_HEIGHT = 180;
const PAGE_PADDING_TOP = 50;
const PAGE_PADDING_BOTTOM = 50;
const USABLE_PAGE_HEIGHT =
  A4_HEIGHT_PX - PAGE_PADDING_TOP - PAGE_PADDING_BOTTOM;
// Page 1 has a header, subsequent pages do not
const FIRST_PAGE_USABLE_HEIGHT = USABLE_PAGE_HEIGHT - HEADER_HEIGHT;

// --- TYPES ---
type RenderItemType =
  | "summary"
  | "work_header"
  | "work_item"
  | "education_header"
  | "education_item"
  | "skills_header"
  | "skills_list"
  | "languages_header"
  | "languages_list"
  | "certs_header"
  | "certs_item"
  | "refs_header"
  | "refs_item";

interface PageItem {
  type: RenderItemType;
  index: number;
  height?: number;
}

// --- COMPONENTS ---

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-4 mt-8">
    <h3
      className="text-base font-bold uppercase tracking-[0.15em] mb-2"
      style={{ color: COLORS.accent }}
    >
      {title}
    </h3>
    <div className="w-full h-[1px] bg-gray-200"></div>
  </div>
);

const ResumePage = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) => (
  <div
    id={id}
    className="bg-white w-[210mm] h-[297mm] shadow-md print:shadow-none print:m-0 text-sm relative overflow-hidden mb-8 print:mb-0 print:break-after-page flex flex-col"
    style={{
      minHeight: "297mm",
      maxHeight: "297mm",
      height: "297mm",
    }}
  >
    {children}
  </div>
);

export default function MinimalTemplate({ resume }: { resume: Resume }) {
  const {
    personal_info,
    work_experience,
    education,
    skills,
    honors_awards,
    languages,
    certifications,
    resume_references,
  } = resume;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : format(date, "MMM yyyy");
  };

  // --- STATE ---
  const [pages, setPages] = useState<PageItem[][]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  // --- PAGINATION LOGIC ---
  useLayoutEffect(() => {
    if (!measureRef.current) return;

    const measureAndPaginate = () => {
      try {
        const nodes = Array.from(measureRef.current!.children) as HTMLElement[];

        const newPages: PageItem[][] = [];
        let currentPage: PageItem[] = [];

        let currentHeight = 0;
        let isFirstPage = true;

        // Calculate max height for the current page
        let maxPageHeight = FIRST_PAGE_USABLE_HEIGHT;

        const flushPage = () => {
          newPages.push(currentPage);
          currentPage = [];
          currentHeight = 0;
          isFirstPage = false;
          maxPageHeight = USABLE_PAGE_HEIGHT; // Subsequent pages have more room
        };

        nodes.forEach((node) => {
          // Get height + margin buffer
          const h = node.offsetHeight + 15;

          if (currentHeight + h > maxPageHeight) {
            flushPage();
          }

          currentHeight += h;

          const type = node.dataset.type as RenderItemType;
          const index = parseInt(node.dataset.index || "0");

          currentPage.push({ type, index, height: h });
        });

        if (currentPage.length > 0) {
          newPages.push(currentPage);
        }

        setPages(newPages);
        setIsCalculated(true);
      } catch (error) {
        console.error("Pagination Error:", error);
      }
    };

    // Small delay ensures DOM is fully rendered before measuring
    const timer = setTimeout(measureAndPaginate, 50);
    return () => clearTimeout(timer);
  }, [resume]);

  // --- RENDER HELPERS ---
  const renderItemContent = (type: RenderItemType, index: number) => {
    switch (type) {
      case "summary":
        return (
          <section className="mb-2">
            <SectionHeader title="Professional Summary" />
            <p className="text-[10.5pt] leading-relaxed text-gray-700 text-justify">
              {personal_info?.summary}
            </p>
          </section>
        );

      case "work_header":
        return <SectionHeader title="Work Experience" />;

      case "work_item":
        const exp = work_experience[index];
        if (!exp) return null;
        return (
          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-[11pt] text-gray-900">
                {exp.job_title}
              </h4>
              <span className="text-[10pt] font-semibold text-gray-600">
                {formatDate(exp.start_date)} –{" "}
                {exp.is_current ? "Present" : formatDate(exp.end_date)}
              </span>
            </div>
            <div className="text-[10.5pt] italic text-[#1e5c76] mb-2 font-medium">
              {exp.company} {exp.location ? `| ${exp.location}` : ""}
            </div>
            <p className="text-[10.5pt] leading-relaxed text-gray-700 whitespace-pre-line">
              {exp.description}
            </p>
          </div>
        );

      case "education_header":
        return <SectionHeader title="Education" />;

      case "education_item":
        const edu = education[index];
        if (!edu) return null;
        return (
          <div className="mb-3 flex justify-between items-baseline">
            <div>
              <h4 className="font-bold text-[11pt] text-gray-900">
                {edu.school}
              </h4>
              <div className="text-[10.5pt] text-gray-600 italic">
                {edu.degree}
              </div>
            </div>
            <span className="text-[10pt] font-semibold text-gray-600">
              {formatDate(edu.end_date)}
            </span>
          </div>
        );

      case "skills_header":
        return <SectionHeader title="Skills" />;

      case "skills_list":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full border border-gray-300 bg-gray-50 text-[10pt] text-gray-700"
              >
                {skill.name}
              </span>
            ))}
          </div>
        );

      case "languages_header":
        return <SectionHeader title="Languages" />;

      case "languages_list":
        return (
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
            {languages.map((lang, i) => (
              <div key={i} className="text-[10.5pt] text-gray-700">
                <span className="font-bold">{lang.name}</span>
                {lang.proficiency && (
                  <span className="text-gray-500 italic">
                    {" "}
                    ({lang.proficiency})
                  </span>
                )}
              </div>
            ))}
          </div>
        );

      case "certs_header":
        return <SectionHeader title="Certifications" />;

      case "certs_item":
        const cert = certifications[index];
        if (!cert) return null;
        return (
          <div className="mb-2 flex justify-between">
            <div className="text-[10.5pt] font-bold text-gray-800">
              {cert.name}
            </div>
            <div className="text-[10.5pt] italic text-gray-600">
              {cert.issuer} {cert.issue_date && `| ${cert.issue_date}`}
            </div>
          </div>
        );

      case "refs_header":
        return <SectionHeader title="References" />;

      case "refs_item":
        const ref = resume_references[index];
        if (!ref) return null;
        return (
          <div className="mb-3">
            <div className="font-bold text-[10.5pt]">{ref.name}</div>
            <div className="text-[10pt] italic text-gray-600">
              {ref.position}
            </div>
            <div className="text-[10pt] text-gray-500">
              {ref.email} | {ref.phone}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // --- ORDERING LOGIC ---
  // Define the single-column flow order
  const getMeasurementItems = () => {
    const items: any[] = [];

    // 1. Summary
    if (personal_info?.summary) {
      items.push(
        <div key="sum" data-type="summary">
          {renderItemContent("summary", 0)}
        </div>,
      );
    }

    // 2. Work Experience
    if (work_experience.length > 0) {
      items.push(
        <div key="work-h" data-type="work_header">
          {renderItemContent("work_header", 0)}
        </div>,
      );
      work_experience.forEach((_, i) => {
        items.push(
          <div key={`work-${i}`} data-type="work_item" data-index={i}>
            {renderItemContent("work_item", i)}
          </div>,
        );
      });
    }

    // 3. Education
    if (education.length > 0) {
      items.push(
        <div key="edu-h" data-type="education_header">
          {renderItemContent("education_header", 0)}
        </div>,
      );
      education.forEach((_, i) => {
        items.push(
          <div key={`edu-${i}`} data-type="education_item" data-index={i}>
            {renderItemContent("education_item", i)}
          </div>,
        );
      });
    }

    // 4. Certifications
    if (certifications.length > 0) {
      items.push(
        <div key="cert-h" data-type="certs_header">
          {renderItemContent("certs_header", 0)}
        </div>,
      );
      certifications.forEach((_, i) => {
        items.push(
          <div key={`cert-${i}`} data-type="certs_item" data-index={i}>
            {renderItemContent("certs_item", i)}
          </div>,
        );
      });
    }

    // 5. Skills
    if (skills.length > 0) {
      items.push(
        <div key="skill-h" data-type="skills_header">
          {renderItemContent("skills_header", 0)}
        </div>,
      );
      items.push(
        <div key="skill-l" data-type="skills_list">
          {renderItemContent("skills_list", 0)}
        </div>,
      );
    }

    // 6. Languages
    if (languages.length > 0) {
      items.push(
        <div key="lang-h" data-type="languages_header">
          {renderItemContent("languages_header", 0)}
        </div>,
      );
      items.push(
        <div key="lang-l" data-type="languages_list">
          {renderItemContent("languages_list", 0)}
        </div>,
      );
    }

    // 7. References
    if (resume_references.length > 0) {
      items.push(
        <div key="ref-h" data-type="refs_header">
          {renderItemContent("refs_header", 0)}
        </div>,
      );
      resume_references.slice(0, 2).forEach((_, i) => {
        items.push(
          <div key={`ref-${i}`} data-type="refs_item" data-index={i}>
            {renderItemContent("refs_item", i)}
          </div>,
        );
      });
    }

    return items;
  };

  return (
    <div className="flex flex-col items-center print:p-0 print:bg-white print:block">
      {/* 1. HIDDEN MEASURER */}
      <div
        ref={measureRef}
        className="fixed top-0 left-[-9999px] opacity-0 pointer-events-none z-[-1]"
        aria-hidden="true"
        style={{
          width: "210mm",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
        }}
      >
        {getMeasurementItems()}
      </div>

      {/* 2. LOADING STATE */}
      {!isCalculated ? (
        <ResumePage>
          <div className="flex items-center justify-center h-full text-gray-300 animate-pulse uppercase tracking-widest font-bold">
            Designing Layout...
          </div>
        </ResumePage>
      ) : (
        // 3. RENDERED PAGES
        pages.map((pageItems, pageIndex) => {
          const isFirstPage = pageIndex === 0;

          return (
            <ResumePage key={`page-${pageIndex}`}>
              <div className="h-full flex flex-col px-10 py-10">
                {/* HEADER (Only on Page 1) */}
                {isFirstPage && (
                  <header className="border-b border-gray-300 pb-6 mb-2 shrink-0">
                    <div className="flex justify-between items-end">
                      {/* Name & Title */}
                      <div className="max-w-[60%]">
                        <h1
                          className="text-4xl font-bold tracking-widest mb-2"
                          style={{ color: COLORS.accent }}
                        >
                          {personal_info?.full_name || "YOUR NAME"}
                        </h1>
                        <p className="text-md font-sans tracking-[0.2em] text-gray-600 ">
                          {personal_info?.role && personal_info.role}
                        </p>
                      </div>

                      {/* Right: Contact Info */}
                      <div className="text-right text-[9pt] leading-relaxed text-gray-600">
                        {personal_info?.location && (
                          <div className="flex items-center justify-end gap-2">
                            <span>{personal_info.location}</span>
                            <MapPin size={10} className="text-[#1e5c76]" />
                          </div>
                        )}
                        {personal_info?.phone && (
                          <div className="flex items-center justify-end gap-2">
                            <span>{personal_info.phone}</span>
                            <Phone size={10} className="text-[#1e5c76]" />
                          </div>
                        )}
                        {personal_info?.email && (
                          <div className="flex items-center justify-end gap-2">
                            <span>{personal_info.email}</span>
                            <Mail size={10} className="text-[#1e5c76]" />
                          </div>
                        )}
                        {personal_info?.linkedin && (
                          <div className="flex items-center justify-end gap-2">
                            <span>{personal_info.linkedin}</span>
                            <Linkedin size={10} className="text-[#1e5c76]" />
                          </div>
                        )}
                      </div>
                    </div>
                  </header>
                )}

                {/* CONTENT AREA */}
                <main className="flex-1">
                  {pageItems.map((item, i) => (
                    <div key={`item-${pageIndex}-${i}`}>
                      {renderItemContent(item.type, item.index)}
                    </div>
                  ))}
                </main>
              </div>
            </ResumePage>
          );
        })
      )}
    </div>
  );
}
