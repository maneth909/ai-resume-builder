"use client";
import { Resume } from "@/types/resume";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { useEffect, useState, useRef, useLayoutEffect } from "react";

// --- THEME CONSTANTS ---
const COLORS = {
  header: "#1e2d42",
  sidebar: "#3e5c76",
  accent: "#98c1d9",
  textMain: "#334155",
  white: "#ffffff",
};

// --- A4 CONSTANTS ---
const A4_HEIGHT_PX = 1122;
const HEADER_HEIGHT = 140;
const PAGE_PADDING_TOP = 40;
const PAGE_PADDING_BOTTOM = 40;
const USABLE_PAGE_HEIGHT =
  A4_HEIGHT_PX - PAGE_PADDING_TOP - PAGE_PADDING_BOTTOM;
const FIRST_PAGE_USABLE_HEIGHT = USABLE_PAGE_HEIGHT - HEADER_HEIGHT;

// --- TYPES ---
type RenderItemType =
  | "summary"
  | "work_header"
  | "work_item"
  | "extra_header"
  | "extra_item"
  | "cert_header"
  | "cert_item";

interface PageItem {
  type: RenderItemType;
  index: number;
  height?: number;
}

const SectionHeader = ({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) => (
  <div className={`flex items-stretch mb-4 ${className}`}>
    <div className="w-1.5 shrink-0 bg-[#fdf6e3]"></div>
    <div className="flex-1 px-4 py-2 font-bold text-[11px] uppercase tracking-[0.2em] leading-none flex items-center text-white bg-[#1e2d42]">
      {title}
    </div>
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
    className="w-[210mm] h-[297mm] bg-white shadow-2xl print:shadow-none print:m-0 font-sans text-sm relative overflow-hidden mb-8 print:mb-0 print:break-after-page flex flex-col"
  >
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

  // --- STATE ---
  const [pages, setPages] = useState<PageItem[][]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  // --- PAGINATION LOGIC ---
  useLayoutEffect(() => {
    if (!measureRef.current) {
      return;
    }

    const measureAndPaginate = () => {
      try {
        const nodes = Array.from(measureRef.current!.children) as HTMLElement[];

        if (nodes.length === 0) {
          setPages([[]]);
          setIsCalculated(true);
          return;
        }

        const newPages: PageItem[][] = [];
        let currentPage: PageItem[] = [];
        let currentHeight = 0;
        let isFirstPage = true;
        let maxPageHeight = FIRST_PAGE_USABLE_HEIGHT;

        nodes.forEach((node, idx) => {
          const h = node.offsetHeight;

          if (h === 0) {
            return;
          }

          // Add margin buffer between items
          const itemHeight = h + 20;

          // Check if this item fits on current page
          if (currentHeight + itemHeight > maxPageHeight) {
            // Save current page if it has items
            if (currentPage.length > 0) {
              newPages.push([...currentPage]);
            }

            // Start new page
            currentPage = [];
            currentHeight = 0;
            isFirstPage = false;
            maxPageHeight = USABLE_PAGE_HEIGHT;
          }

          // Add item to current page
          const type = node.dataset.type as RenderItemType;
          const index = parseInt(node.dataset.index || "0");
          currentPage.push({ type, index, height: itemHeight });
          currentHeight += itemHeight;
        });

        // Add the last page if it has items
        if (currentPage.length > 0) {
          newPages.push([...currentPage]);
        }

        // If no pages were created, create an empty one
        if (newPages.length === 0) {
          newPages.push([]);
        }

        console.log(`Created ${newPages.length} pages`);
        setPages(newPages);
        setIsCalculated(true);
      } catch (error) {
        console.error("Error in pagination:", error);
        setPages([[]]);
        setIsCalculated(true);
      }
    };

    const timer = setTimeout(measureAndPaginate, 100);

    const handleResize = () => {
      clearTimeout(timer);
      setTimeout(measureAndPaginate, 50);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [resume]);

  // --- RENDER ITEM HELPER ---
  const renderItemContent = (type: RenderItemType, index: number) => {
    switch (type) {
      case "summary":
        return (
          <section className="mb-4">
            <SectionHeader title="Summary" />
            <p className="text-[11px] leading-relaxed text-gray-600 italic pl-1.5">
              {personal_info?.summary}
            </p>
          </section>
        );
      case "work_header":
        return <SectionHeader title="Work Experience" className="mb-4" />;
      case "work_item":
        const exp = work_experience[index];
        if (!exp) return null;
        return (
          <div className="border-l-4 border-[#1e2d42] pl-5 relative mb-5">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-[13px] text-[#1e2d42] uppercase tracking-tight">
                {exp.company}
              </h4>
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                {formatDate(exp.start_date)} -{" "}
                {exp.is_current ? "Present" : formatDate(exp.end_date)}
              </span>
            </div>
            <p className="text-[10px] font-bold text-[#3d5a80] mb-2 italic uppercase">
              {exp.job_title}
            </p>
            <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-line">
              {exp.description}
            </p>
          </div>
        );
      case "extra_header":
        return <SectionHeader title="Extracurricular" className="mb-4" />;
      case "extra_item":
        const extra = extra_curricular[index];
        if (!extra) return null;
        return (
          <div className="border-l-4 border-[#3d5a80] pl-5 mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-[12px] text-[#1e2d42] uppercase">
                {extra.organization || extra.title}
              </h4>
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                {formatDate(extra.start_date)}
              </span>
            </div>
            {extra.organization && (
              <p className="text-[10px] font-bold text-[#3d5a80] mb-1 italic uppercase">
                {extra.title}
              </p>
            )}
            <p className="text-[10px] text-gray-600 italic leading-tight">
              {extra.description}
            </p>
          </div>
        );
      case "cert_header":
        return <SectionHeader title="Certifications" className="mb-4" />;
      case "cert_item":
        const cert = certifications[index];
        if (!cert) return null;
        return (
          <div className="flex flex-col text-[11px] border-b border-gray-100 pb-2 mb-2">
            <span className="font-bold text-[#1e2d42] uppercase text-[11px]">
              {cert.name}
            </span>
            <span className="text-[10px] text-gray-500 italic">
              {cert.issuer} {cert.issue_date && `• ${cert.issue_date}`}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  // Generate all content items
  const getAllContentItems = (): { type: RenderItemType; index: number }[] => {
    const items: { type: RenderItemType; index: number }[] = [];

    if (personal_info?.summary) {
      items.push({ type: "summary", index: 0 });
    }

    if (work_experience.length > 0) {
      items.push({ type: "work_header", index: 0 });
      work_experience.forEach((_, i) => {
        items.push({ type: "work_item", index: i });
      });
    }

    if (extra_curricular.length > 0) {
      items.push({ type: "extra_header", index: 0 });
      extra_curricular.forEach((_, i) => {
        items.push({ type: "extra_item", index: i });
      });
    }

    if (certifications.length > 0) {
      items.push({ type: "cert_header", index: 0 });
      certifications.forEach((_, i) => {
        items.push({ type: "cert_item", index: i });
      });
    }

    return items;
  };

  const allItems = getAllContentItems();

  // If no content at all, show a placeholder
  if (allItems.length === 0) {
    return (
      <ResumePage>
        <div className="flex items-center justify-center h-full text-gray-300 uppercase tracking-widest font-bold">
          Add content to your resume
        </div>
      </ResumePage>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* --- HIDDEN MEASURER --- */}
      <div
        ref={measureRef}
        className="fixed top-0 left-[-9999px] opacity-0 pointer-events-none z-[-1]"
        style={{
          width: "calc(210mm * 0.68)", // 68% of page width for main content
          padding: "2rem",
          paddingTop: "1.5rem",
        }}
        aria-hidden="true"
      >
        {allItems.map((item, idx) => (
          <div
            key={`measure-${item.type}-${item.index}`}
            data-type={item.type}
            data-index={item.index}
            className="mb-5"
          >
            {renderItemContent(item.type, item.index)}
          </div>
        ))}
      </div>

      {/* --- VISIBLE PAGES --- */}
      {!isCalculated ? (
        // LOADING STATE
        <ResumePage>
          <div className="flex items-center justify-center h-full text-gray-300 animate-pulse uppercase tracking-widest font-bold">
            Calculating layout...
          </div>
        </ResumePage>
      ) : (
        pages.map((pageItems, pageIndex) => {
          const isFirstPage = pageIndex === 0;

          return (
            <ResumePage key={`page-${pageIndex}`}>
              {/* HEADER (Only Page 1) */}
              {isFirstPage && (
                <header
                  className="w-full p-8 pt-10 shrink-0 flex flex-col justify-center min-h-[140px]"
                  style={{
                    backgroundColor: COLORS.header,
                    color: COLORS.white,
                  }}
                >
                  <div className="flex flex-wrap justify-between items-end gap-6">
                    <div className="max-w-[60%]">
                      <h1 className="text-5xl font-bold tracking-tight uppercase mb-2 leading-none break-words">
                        {personal_info?.full_name || "YOUR NAME"}
                      </h1>
                      <p
                        className="font-medium tracking-[0.25em] text-xs uppercase pl-1"
                        style={{ color: COLORS.accent }}
                      >
                        {work_experience?.[0]?.job_title ||
                          "PROFESSIONAL TITLE"}
                      </p>
                    </div>
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
                      <span className="flex items-center justify-end gap-2">
                        linkedin.com/in/user{" "}
                        <Linkedin size={11} className="text-[#98c1d9]" />
                      </span>
                    </div>
                  </div>
                </header>
              )}

              {/* SPACER FOR PAGE 2+ */}
              {!isFirstPage && (
                <div
                  className="h-10 w-full shrink-0"
                  style={{ backgroundColor: COLORS.header }}
                ></div>
              )}

              {/* TWO COLUMN LAYOUT */}
              <div className="flex flex-row flex-1 overflow-hidden">
                {/* LEFT SIDEBAR */}
                <aside
                  className="w-[32%] p-6 pt-6 flex flex-col gap-6 text-white shrink-0 overflow-hidden"
                  style={{ backgroundColor: COLORS.sidebar }}
                >
                  {/* Only show sidebar content on first page */}
                  {isFirstPage && (
                    <>
                      {education && education.length > 0 && (
                        <section>
                          <SectionHeader title="Education" />
                          <div className="space-y-4 pl-1.5">
                            {education.map((edu) => (
                              <div key={edu.id} className="text-[11px]">
                                <p className="font-bold uppercase leading-tight mb-1">
                                  {edu.school}
                                </p>
                                <p className="italic text-[#98c1d9] mb-1 text-[10px]">
                                  {edu.degree}
                                </p>
                                <p className="opacity-75 text-[9px]">
                                  {formatDate(edu.start_date)} —{" "}
                                  {edu.is_current
                                    ? "Present"
                                    : formatDate(edu.end_date)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {skills && skills.length > 0 && (
                        <section>
                          <SectionHeader title="Skills" />
                          <div className="flex flex-wrap gap-2 pl-1.5">
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

                      {languages && languages.length > 0 && (
                        <section>
                          <SectionHeader title="Languages" />
                          <div className="space-y-2 pl-1.5">
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

                      {honors_awards && honors_awards.length > 0 && (
                        <section>
                          <SectionHeader title="Honors" />
                          <div className="space-y-3 pl-1.5">
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

                      {resume_references && resume_references.length > 0 && (
                        <section className="mt-auto">
                          <SectionHeader title="References" />
                          <div className="space-y-3 pl-1.5">
                            {resume_references.slice(0, 2).map((ref) => (
                              <div key={ref.id} className="text-[10px]">
                                <p className="font-bold uppercase text-[#98c1d9]">
                                  {ref.name}
                                </p>
                                <p className="italic text-[9px] mb-0.5 opacity-90">
                                  {ref.position}
                                </p>
                                <p className="opacity-75 break-words">
                                  {ref.email}
                                </p>
                                <p className="opacity-75">{ref.phone}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </>
                  )}
                </aside>

                {/* RIGHT MAIN COLUMN */}
                <main className="flex-1 p-8 pt-6 overflow-hidden">
                  <div className="space-y-5">
                    {pageItems.map((item, i) => (
                      <div key={`${pageIndex}-${item.type}-${item.index}`}>
                        {renderItemContent(item.type, item.index)}
                      </div>
                    ))}
                  </div>
                </main>
              </div>
            </ResumePage>
          );
        })
      )}
    </div>
  );
}
