"use client";
import { Resume } from "@/types/resume";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { useEffect, useState, useRef, useLayoutEffect } from "react";

// --- THEME CONSTANTS ---
const COLORS = {
  accent: "#3e5c76",
  textMain: "#374151",
  textBody: "#6b7280",
  borderColor: "#e5e7eb",
};

// --- A4 CONSTANTS ---
const A4_HEIGHT_PX = 1122;
const HEADER_HEIGHT = 160;
const PAGE_PADDING = 48; // 3rem = 48px
const USABLE_PAGE_HEIGHT = A4_HEIGHT_PX - PAGE_PADDING * 2;
const FIRST_PAGE_USABLE_HEIGHT = USABLE_PAGE_HEIGHT - HEADER_HEIGHT;

// --- TYPES ---
type RenderItemType =
  | "contact"
  | "education_header"
  | "education_item"
  | "languages_header"
  | "languages_list"
  | "honors_header"
  | "honors_item"
  | "refs_header"
  | "refs_item"
  | "summary"
  | "work_header"
  | "work_item"
  | "extra_header"
  | "extra_item"
  | "certs_header"
  | "certs_item"
  | "skills_header"
  | "skills_list";

interface PageItem {
  type: RenderItemType;
  index: number;
}

interface PageContent {
  left: PageItem[];
  right: PageItem[];
}

// --- COMPONENTS ---

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-4 mt-8">
    <h3 className="text-base font-bold uppercase tracking-[0.25em] mb-1 text-[#3e5c76] font-sans">
      {title}
    </h3>
    <div className="w-full h-[1px] bg-gray-200"></div>
  </div>
);

// --- RESUME PAGE COMPONENT ---
const ResumePage = ({
  children,
  id,
  isLastPage,
}: {
  children: React.ReactNode;
  id?: string;
  isLastPage?: boolean;
}) => (
  <div
    id={id}
    style={{
      printColorAdjust: "exact",
      WebkitPrintColorAdjust: "exact",
    }}
    className={`bg-white resume-page w-[210mm] h-[297mm] shadow-md print:shadow-none print:m-0 font-sans text-sm relative overflow-hidden mb-8 print:mb-0 flex flex-col ${
      !isLastPage ? "print:break-after-page" : ""
    }`}
  >
    {children}
  </div>
);

export default function ProfessionalTemplate({ resume }: { resume: Resume }) {
  const {
    personal_info,
    work_experience,
    education,
    skills,
    honors_awards,
    languages,
    certifications,
    resume_references,
    extra_curricular,
  } = resume;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : format(date, "MMM yyyy");
  };

  const [pages, setPages] = useState<PageContent[]>([{ left: [], right: [] }]);
  const [isCalculated, setIsCalculated] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  // --- PAGINATION LOGIC ---
  useLayoutEffect(() => {
    if (!measureRef.current) return;

    const measureAndPaginate = () => {
      // 1. Get Measurable Nodes
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

      // 2. Measure Heights with Margin Buffer
      const MARGIN_BUFFER = 15;

      const leftItems = leftNodes.map((node) => ({
        type: node.dataset.type as RenderItemType,
        index: parseInt(node.dataset.index || "0"),
        height: node.offsetHeight + MARGIN_BUFFER,
      }));

      const rightItems = rightNodes.map((node) => ({
        type: node.dataset.type as RenderItemType,
        index: parseInt(node.dataset.index || "0"),
        height: node.offsetHeight + MARGIN_BUFFER,
      }));

      // 3. Distribute
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

        // Fill Left Column
        while (leftIdx < leftItems.length) {
          const item = leftItems[leftIdx];
          if (leftHeight + item.height <= maxHeight) {
            currentPage.left.push(item);
            leftHeight += item.height;
            leftIdx++;
          } else {
            break;
          }
        }

        // Fill Right Column
        while (rightIdx < rightItems.length) {
          const item = rightItems[rightIdx];
          if (rightHeight + item.height <= maxHeight) {
            currentPage.right.push(item);
            rightHeight += item.height;
            rightIdx++;
          } else {
            break;
          }
        }

        newPages.push(currentPage);
        isFirstPage = false;

        // If item is massive and won't fit on empty page, force it
        if (
          currentPage.left.length === 0 &&
          currentPage.right.length === 0 &&
          (leftIdx < leftItems.length || rightIdx < rightItems.length)
        ) {
          if (leftIdx < leftItems.length) {
            currentPage.left.push(leftItems[leftIdx]);
            leftIdx++;
          }
          if (rightIdx < rightItems.length) {
            currentPage.right.push(rightItems[rightIdx]);
            rightIdx++;
          }
        }
      }

      if (newPages.length === 0) newPages.push({ left: [], right: [] });
      setPages(newPages);
      setIsCalculated(true);
    };

    const timer = setTimeout(measureAndPaginate, 100);
    return () => clearTimeout(timer);
  }, [resume]);

  // --- RENDER HELPERS ---
  const renderItemContent = (type: RenderItemType, index: number) => {
    switch (type) {
      // LEFT COLUMN
      case "contact":
        return (
          <div className="mb-8 space-y-3 text-[9pt] text-gray-600 font-sans">
            <SectionHeader title="Contact" />
            {personal_info?.phone && (
              <div className="flex items-center gap-3">
                <Phone size={12} /> {personal_info.phone}
              </div>
            )}
            {personal_info?.email && (
              <div className="flex items-center gap-3">
                <Mail size={12} /> {personal_info.email}
              </div>
            )}
            {personal_info?.location && (
              <div className="flex items-center gap-3">
                <MapPin size={12} /> {personal_info.location}
              </div>
            )}
            {personal_info?.linkedin && (
              <div className="flex items-center gap-3">
                <Linkedin size={12} /> {personal_info.linkedin}
              </div>
            )}
          </div>
        );
      case "education_header":
        return <SectionHeader title="Education" />;
      case "education_item":
        const edu = education?.[index];
        if (!edu) return null;
        return (
          <div className="mb-3 text-[10pt]">
            <div className="font-bold text-gray-800 leading-tight">
              {edu.degree}
            </div>
            <div className="text-gray-500 text-[9pt] mt-1 mb-1">
              {edu.school}
            </div>
            <div className="text-[9pt] text-gray-400 italic">
              {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
            </div>
          </div>
        );
      case "languages_header":
        return <SectionHeader title="Languages" />;
      case "languages_list":
        return (
          <div className="mb-6 space-y-1">
            {languages?.map((l, i) => (
              <div key={i} className="text-[10pt] flex justify-between">
                <span className="font-medium text-gray-700">{l.name}</span>
                {l.proficiency && (
                  <span className="text-gray-500 italic text-[9pt]">
                    {l.proficiency}
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      case "honors_header":
        return <SectionHeader title="Honors" />;
      case "honors_item":
        const hon = honors_awards?.[index];
        if (!hon) return null;
        return (
          <div className="mb-3 text-[10pt]">
            <div className="font-bold text-gray-800">{hon.title}</div>
            <div className="text-gray-500 italic text-[9pt]">{hon.issuer}</div>
          </div>
        );
      case "refs_header":
        return <SectionHeader title="References" />;
      case "refs_item":
        const ref = resume_references?.[index];
        if (!ref) return null;
        return (
          <div className="mb-4 text-[10pt]">
            <div className="font-bold text-gray-800">{ref.name}</div>
            <div className="text-[9pt] text-gray-600">{ref.position}</div>
            <div className="text-[9pt] text-gray-500">{ref.email}</div>
          </div>
        );

      // RIGHT COLUMN
      case "summary":
        return (
          <section className="mb-8">
            <SectionHeader title="Profile" />
            <p className="text-[10pt] leading-relaxed text-gray-600 text-justify">
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
          <div className="mb-3">
            <h4 className="font-bold text-[11pt] text-gray-800 tracking-wide">
              {exp.job_title}
            </h4>
            <div className="flex justify-between text-[10pt] text-gray-500 mb-2 mt-1">
              <span className="font-medium italic">{exp.company}</span>
              <span>
                {formatDate(exp.start_date)} –{" "}
                {exp.is_current ? "Present" : formatDate(exp.end_date)}
              </span>
            </div>
            <p className="text-[10pt] leading-relaxed text-gray-600 whitespace-pre-line pl-3 border-l-2 border-gray-100">
              {exp.description}
            </p>
          </div>
        );
      case "extra_header":
        return <SectionHeader title="Extracurricular" />;
      case "extra_item":
        const ext = extra_curricular[index];
        if (!ext) return null;
        return (
          <div className="mb-3">
            <h4 className="font-bold text-[11pt] text-gray-800">
              {ext.organization}
            </h4>
            <div className="flex justify-between text-[10pt] text-gray-500 mb-1">
              <span className="italic">{ext.title}</span>
              <span>{formatDate(ext.start_date)}</span>
            </div>
            <p className="text-[10pt] text-gray-600">{ext.description}</p>
          </div>
        );
      case "certs_header":
        return <SectionHeader title="Certifications" />;
      case "certs_item":
        const cert = certifications[index];
        if (!cert) return null;
        return (
          <div className="mb-3 text-[10pt]">
            <span className="font-bold text-gray-800">{cert.name}</span>
            <span className="text-gray-500"> - {cert.issuer}</span>
            {cert.issue_date && (
              <span className="text-gray-400 text-[9pt]">
                {" "}
                ({cert.issue_date})
              </span>
            )}
          </div>
        );
      case "skills_header":
        return <SectionHeader title="Skills" />;
      case "skills_list":
        return (
          <div className="mb-5">
            {/* TAG STYLE: Rounded Pills */}
            <div className="flex flex-wrap gap-2">
              {skills?.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-[9pt] font-medium border border-gray-200"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // --- CONTENT GROUPING ---
  const getLeftColumnItems = () => {
    const items: any[] = [];
    items.push(
      <div key="contact" data-type="contact" className="mb-2">
        {renderItemContent("contact", 0)}
      </div>,
    );
    if (education?.length) {
      items.push(
        <div key="edu-h" data-type="education_header">
          {renderItemContent("education_header", 0)}
        </div>,
      );
      education.forEach((_, i) =>
        items.push(
          <div key={`edu-${i}`} data-type="education_item" data-index={i}>
            {renderItemContent("education_item", i)}
          </div>,
        ),
      );
    }
    if (languages?.length) {
      items.push(
        <div key="lg-h" data-type="languages_header">
          {renderItemContent("languages_header", 0)}
        </div>,
      );
      items.push(
        <div key="lg-l" data-type="languages_list">
          {renderItemContent("languages_list", 0)}
        </div>,
      );
    }
    if (honors_awards?.length) {
      items.push(
        <div key="hn-h" data-type="honors_header">
          {renderItemContent("honors_header", 0)}
        </div>,
      );
      honors_awards.forEach((_, i) =>
        items.push(
          <div key={`hn-${i}`} data-type="honors_item" data-index={i}>
            {renderItemContent("honors_item", i)}
          </div>,
        ),
      );
    }
    if (resume_references?.length) {
      items.push(
        <div key="rf-h" data-type="refs_header">
          {renderItemContent("refs_header", 0)}
        </div>,
      );
      resume_references.slice(0, 2).forEach((_, i) =>
        items.push(
          <div key={`rf-${i}`} data-type="refs_item" data-index={i}>
            {renderItemContent("refs_item", i)}
          </div>,
        ),
      );
    }
    return items;
  };

  const getRightColumnItems = () => {
    const items: any[] = [];
    if (personal_info?.summary) {
      items.push(
        <div key="sum" data-type="summary" className="mb-2">
          {renderItemContent("summary", 0)}
        </div>,
      );
    }
    if (work_experience?.length) {
      items.push(
        <div key="wk-h" data-type="work_header">
          {renderItemContent("work_header", 0)}
        </div>,
      );
      work_experience.forEach((_, i) =>
        items.push(
          <div key={`wk-${i}`} data-type="work_item" data-index={i}>
            {renderItemContent("work_item", i)}
          </div>,
        ),
      );
    }
    if (extra_curricular?.length) {
      items.push(
        <div key="ex-h" data-type="extra_header">
          {renderItemContent("extra_header", 0)}
        </div>,
      );
      extra_curricular.forEach((_, i) =>
        items.push(
          <div key={`ex-${i}`} data-type="extra_item" data-index={i}>
            {renderItemContent("extra_item", i)}
          </div>,
        ),
      );
    }
    if (certifications?.length) {
      items.push(
        <div key="ct-h" data-type="certs_header">
          {renderItemContent("certs_header", 0)}
        </div>,
      );
      certifications.forEach((_, i) =>
        items.push(
          <div key={`ct-${i}`} data-type="certs_item" data-index={i}>
            {renderItemContent("certs_item", i)}
          </div>,
        ),
      );
    }
    if (skills?.length) {
      items.push(
        <div key="sk-h" data-type="skills_header">
          {renderItemContent("skills_header", 0)}
        </div>,
      );
      items.push(
        <div key="sk-l" data-type="skills_list">
          {renderItemContent("skills_list", 0)}
        </div>,
      );
    }
    return items;
  };

  const leftItems = getLeftColumnItems();
  const rightItems = getRightColumnItems();

  return (
    <div className="flex flex-col items-center bg-transparent print:p-0 print:bg-white print:block">
      {/* 1. HIDDEN MEASURER */}
      <div
        ref={measureRef}
        className="fixed top-0 left-[-9999px] opacity-0 pointer-events-none z-[-1] print:hidden"
        aria-hidden="true"
        style={{ width: "210mm", padding: "3rem" }}
      >
        <div style={{ display: "flex", gap: "2.5rem" }}>
          <div data-column="left" style={{ width: "32%" }}>
            {leftItems}
          </div>
          <div data-column="right" style={{ flex: 1 }}>
            {rightItems}
          </div>
        </div>
      </div>

      {/* 2. RENDERED PAGES */}
      {!isCalculated ? (
        <ResumePage>
          <div className="flex items-center justify-center h-full text-gray-300 animate-pulse uppercase tracking-widest font-bold">
            Formatting Layout...
          </div>
        </ResumePage>
      ) : (
        pages.map((page, pageIndex) => (
          <ResumePage
            key={`page-${pageIndex}`}
            isLastPage={pageIndex === pages.length - 1}
          >
            {/* DYNAMIC HEADER */}
            {pageIndex === 0 && (
              <header className="h-[150px] w-full flex items-center justify-between shrink-0">
                <div
                  className="h-full flex-1"
                  style={{ backgroundColor: COLORS.accent }}
                ></div>
                <div className="text-center z-10 px-16">
                  <h1 className="text-4xl tracking-widest text-gray-800 mb-3 whitespace-nowrap font-bold">
                    {personal_info?.full_name || "YOUR NAME"}
                  </h1>
                  <p className="text-sm font-sans tracking-[0.3em] text-gray-500 uppercase">
                    {personal_info?.role || "PROFESSIONAL TITLE"}
                  </p>
                </div>
                <div
                  className="h-full flex-1"
                  style={{ backgroundColor: COLORS.accent }}
                ></div>
              </header>
            )}

            {/* Spacer for Page 2+ */}
            {pageIndex > 0 && <div className="h-12 w-full"></div>}

            {/* 2-Column Content */}
            <div className="flex flex-row h-full px-12 pb-8 gap-10">
              <aside className="w-[32%] shrink-0">
                {page.left.map((item, i) => (
                  <div key={`l-${i}`}>
                    {renderItemContent(item.type, item.index)}
                  </div>
                ))}
              </aside>

              <main className="flex-1">
                {page.right.map((item, i) => (
                  <div key={`r-${i}`}>
                    {renderItemContent(item.type, item.index)}
                  </div>
                ))}
              </main>
            </div>
          </ResumePage>
        ))
      )}
    </div>
  );
}
