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
  | "cert_item"
  | "education_header"
  | "education_item"
  | "skills_header"
  | "skills_section"
  | "languages_header"
  | "languages_item"
  | "honors_header"
  | "honors_item"
  | "references_header"
  | "references_item";

interface PageItem {
  type: RenderItemType;
  index: number;
  height?: number;
  column: "left" | "right";
}

interface PageContent {
  left: PageItem[];
  right: PageItem[];
}

const SectionHeader = ({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) => (
  <div
    className={`flex items-stretch mt-6 mb-3  ${className}`}
    // style={{ marginTop: "1.5rem" }}
  >
    <div className="w-1.5 shrink-0 bg-[#4292d7]"></div>
    <div className="px-4 py-2 font-bold text-[11px] uppercase tracking-[0.2em] leading-none flex items-center text-white bg-[#1e2d42]">
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
    className="w-[210mm] h-[297mm] bg-white shadow-2xl print:shadow-none print:m-0 font-sans text-sm relative overflow-hidden mb-8 print:mb-0 print:break-after-page"
    style={{
      minHeight: "297mm",
      maxHeight: "297mm",
      height: "297mm",
    }}
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
  const [pages, setPages] = useState<PageContent[]>([{ left: [], right: [] }]);
  const [isCalculated, setIsCalculated] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  // --- PAGINATION LOGIC ---
  useLayoutEffect(() => {
    if (!measureRef.current) {
      return;
    }

    const measureAndPaginate = () => {
      try {
        const leftColumn = measureRef.current!.querySelector(
          '[data-column="left"]',
        );
        const rightColumn = measureRef.current!.querySelector(
          '[data-column="right"]',
        );

        const leftNodes = leftColumn
          ? (Array.from(leftColumn.children) as HTMLElement[])
          : [];
        const rightNodes = rightColumn
          ? (Array.from(rightColumn.children) as HTMLElement[])
          : [];

        console.log(
          "Left nodes:",
          leftNodes.length,
          "Right nodes:",
          rightNodes.length,
        );

        if (leftNodes.length === 0 && rightNodes.length === 0) {
          setPages([{ left: [], right: [] }]);
          setIsCalculated(true);
          return;
        }

        // Collect items with heights
        const leftItems: PageItem[] = leftNodes
          .map((node) => ({
            type: node.dataset.type as RenderItemType,
            index: parseInt(node.dataset.index || "0"),
            height: node.offsetHeight + 12,
            column: "left" as const,
          }))
          .filter((item) => item.height > 20);

        const rightItems: PageItem[] = rightNodes
          .map((node) => ({
            type: node.dataset.type as RenderItemType,
            index: parseInt(node.dataset.index || "0"),
            height: node.offsetHeight + 15,
            column: "right" as const,
          }))
          .filter((item) => item.height > 20);

        console.log(
          "Left items:",
          leftItems.length,
          "Right items:",
          rightItems.length,
        );

        // Paginate
        const newPages: PageContent[] = [];
        let leftIdx = 0;
        let rightIdx = 0;
        let isFirstPage = true;

        while (leftIdx < leftItems.length || rightIdx < rightItems.length) {
          const maxHeight = isFirstPage
            ? FIRST_PAGE_USABLE_HEIGHT
            : USABLE_PAGE_HEIGHT;
          const currentPage: PageContent = { left: [], right: [] };
          let leftHeight = 0;
          let rightHeight = 0;

          // Fill left column for this page
          while (leftIdx < leftItems.length) {
            const item = leftItems[leftIdx];
            if (leftHeight + item.height! <= maxHeight) {
              currentPage.left.push(item);
              leftHeight += item.height!;
              leftIdx++;
            } else {
              break;
            }
          }

          // Fill right column for this page
          while (rightIdx < rightItems.length) {
            const item = rightItems[rightIdx];
            if (rightHeight + item.height! <= maxHeight) {
              currentPage.right.push(item);
              rightHeight += item.height!;
              rightIdx++;
            } else {
              break;
            }
          }

          newPages.push(currentPage);
          isFirstPage = false;
        }

        if (newPages.length === 0) {
          newPages.push({ left: [], right: [] });
        }

        console.log(
          `Created ${newPages.length} pages:`,
          newPages.map(
            (p, i) =>
              `Page ${i + 1}: ${p.left.length} left items, ${p.right.length} right items`,
          ),
        );

        setPages(newPages);
        setIsCalculated(true);
      } catch (error) {
        console.error("Error in pagination:", error);
        setPages([{ left: [], right: [] }]);
        setIsCalculated(true);
      }
    };

    const timer = setTimeout(measureAndPaginate, 150);

    return () => clearTimeout(timer);
  }, [resume]);

  // --- RENDER ITEM HELPER ---
  const renderItemContent = (type: RenderItemType, index: number) => {
    switch (type) {
      // LEFT COLUMN ITEMS
      case "education_header":
        return <SectionHeader title="Education" className="mt-[-3px]" />;
      case "education_item":
        const edu = education?.[index];
        if (!edu) return null;
        return (
          <div className="text-[11px] mb-5 pl-1.5">
            <p className="font-bold leading-tight mb-1">{edu.school}</p>
            <p className="italic text-[#98c1d9] mb-1 text-[10px]">
              {edu.degree}
            </p>
            <p className="opacity-75 text-[9px]">
              {formatDate(edu.start_date)} —{" "}
              {edu.is_current ? "Present" : formatDate(edu.end_date)}
            </p>
          </div>
        );
      case "skills_header":
        return <SectionHeader title="Skills" />;
      case "skills_section":
        return (
          <div className="flex flex-wrap gap-2 pl-1.5 mb-4">
            {skills?.map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-1 border border-white/20 text-white text-[10px] font-medium tracking-tight rounded-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        );
      case "languages_header":
        return <SectionHeader title="Languages" />;
      case "languages_item":
        const lang = languages?.[index];
        if (!lang) return null;
        return (
          <div className="flex justify-between items-end border-b border-white/10 pb-1 mb-1 pl-1.5">
            <span className="text-[11px] font-bold">{lang.name}</span>
            <span className="text-[9px] italic text-[#98c1d9]">
              {lang.proficiency}
            </span>
          </div>
        );
      case "honors_header":
        return <SectionHeader title="Honors" />;
      case "honors_item":
        const award = honors_awards?.[index];
        if (!award) return null;
        return (
          <div className="text-[11px] mb-3 pl-1.5">
            <p className="font-bold leading-tight mb-0.5 text-white">
              {award.title}
            </p>
            <p className="text-[9px] italic text-[#98c1d9] opacity-90">
              {award.issuer}
            </p>
          </div>
        );
      case "references_header":
        return <SectionHeader title="References" />;
      case "references_item":
        const ref = resume_references?.[index];
        if (!ref) return null;
        return (
          <div className="text-[10px] mb-1 pl-1.5">
            <p className="font-bold text-[#98c1d9]">{ref.name}</p>
            <p className="italic text-[9px] mb-0.5 opacity-90">
              {ref.position}
            </p>
            <p className="opacity-75 break-words">{ref.email}</p>
            <p className="opacity-75">{ref.phone}</p>
          </div>
        );

      // RIGHT COLUMN ITEMS
      case "summary":
        return (
          <section className="mb-4">
            <SectionHeader title="Summary" className="mt-[-3px]" />
            <p className="text-[11px] leading-relaxed text-gray-600 pl-1.5">
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
          <div className="border-l-4 border-[#1e2d42] pl-5 relative mb-4">
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
          <div className="flex flex-col text-[11px] border-b border-gray-100 pb-1 mb-3">
            <span className="font-bold text-[#1e2d42] text-[11px]">
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

  // Generate all content items for LEFT and RIGHT columns
  const getLeftColumnItems = (): {
    type: RenderItemType;
    index: number;
    column: "left";
  }[] => {
    const items: { type: RenderItemType; index: number; column: "left" }[] = [];

    if (education && education.length > 0) {
      items.push({ type: "education_header", index: 0, column: "left" });
      education.forEach((_, i) => {
        items.push({ type: "education_item", index: i, column: "left" });
      });
    }

    if (skills && skills.length > 0) {
      items.push({ type: "skills_header", index: 0, column: "left" });
      items.push({ type: "skills_section", index: 0, column: "left" });
    }

    if (languages && languages.length > 0) {
      items.push({ type: "languages_header", index: 0, column: "left" });
      languages.forEach((_, i) => {
        items.push({ type: "languages_item", index: i, column: "left" });
      });
    }

    if (honors_awards && honors_awards.length > 0) {
      items.push({ type: "honors_header", index: 0, column: "left" });
      honors_awards.forEach((_, i) => {
        items.push({ type: "honors_item", index: i, column: "left" });
      });
    }

    if (resume_references && resume_references.length > 0) {
      items.push({ type: "references_header", index: 0, column: "left" });
      resume_references.slice(0, 2).forEach((_, i) => {
        items.push({ type: "references_item", index: i, column: "left" });
      });
    }

    return items;
  };

  const getRightColumnItems = (): {
    type: RenderItemType;
    index: number;
    column: "right";
  }[] => {
    const items: { type: RenderItemType; index: number; column: "right" }[] =
      [];

    if (personal_info?.summary) {
      items.push({ type: "summary", index: 0, column: "right" });
    }

    if (work_experience.length > 0) {
      items.push({ type: "work_header", index: 0, column: "right" });
      work_experience.forEach((_, i) => {
        items.push({ type: "work_item", index: i, column: "right" });
      });
    }

    if (extra_curricular.length > 0) {
      items.push({ type: "extra_header", index: 0, column: "right" });
      extra_curricular.forEach((_, i) => {
        items.push({ type: "extra_item", index: i, column: "right" });
      });
    }

    if (certifications.length > 0) {
      items.push({ type: "cert_header", index: 0, column: "right" });
      certifications.forEach((_, i) => {
        items.push({ type: "cert_item", index: i, column: "right" });
      });
    }

    return items;
  };

  const leftItems = getLeftColumnItems();
  const rightItems = getRightColumnItems();

  // If no content at all, show a placeholder
  if (leftItems.length === 0 && rightItems.length === 0) {
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
        aria-hidden="true"
      >
        {/* Left column measurer */}
        <div
          data-column="left"
          style={{
            width: "calc(210mm * 0.32)",
            padding: "1.5rem",
            paddingTop: "1.5rem",
          }}
        >
          {leftItems.map((item, idx) => (
            <div
              key={`measure-left-${item.type}-${item.index}`}
              data-type={item.type}
              data-index={item.index}
            >
              {renderItemContent(item.type, item.index)}
            </div>
          ))}
        </div>

        {/* Right column measurer */}
        <div
          data-column="right"
          style={{
            width: "calc(210mm * 0.68)",
            padding: "2rem",
            paddingTop: "1.5rem",
          }}
        >
          {rightItems.map((item, idx) => (
            <div
              key={`measure-right-${item.type}-${item.index}`}
              data-type={item.type}
              data-index={item.index}
            >
              {renderItemContent(item.type, item.index)}
            </div>
          ))}
        </div>
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
        pages.map((page, pageIndex) => {
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
                      {personal_info?.location && (
                        <span className="flex items-center justify-end gap-2">
                          {personal_info.location}
                          <MapPin size={11} className="text-[#98c1d9]" />
                        </span>
                      )}
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

              {/* TWO COLUMN LAYOUT - CRITICAL: Use h-full to fill remaining space */}
              <div className="flex flex-row h-full overflow-hidden">
                {/* LEFT SIDEBAR */}
                <aside
                  className="w-[32%] p-6 pt-6 h-full text-white shrink-0 overflow-hidden"
                  style={{ backgroundColor: COLORS.sidebar }}
                >
                  {page.left &&
                    page.left.map((item, i) => (
                      <div
                        key={`left-${pageIndex}-${item.type}-${item.index}-${i}`}
                      >
                        {renderItemContent(item.type, item.index)}
                      </div>
                    ))}
                </aside>

                {/* RIGHT MAIN COLUMN */}
                <main className="flex-1 p-8 pt-6 h-full overflow-hidden">
                  <div>
                    {page.right &&
                      page.right.map((item, i) => (
                        <div
                          key={`right-${pageIndex}-${item.type}-${item.index}-${i}`}
                        >
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
