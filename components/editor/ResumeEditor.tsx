"use client";

import { useState } from "react";
import { Resume } from "@/types/resume";
import PersonalInfoForm from "@/components/form/PersonalInfoForm";
import ResumePreview from "@/components/ResumePreview";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  Award,
  FileBadge,
  Users,
  Tent,
} from "lucide-react";

// 1. Define the sections based on your interface
type SectionKey =
  | "personal_info"
  | "work_experience"
  | "education"
  | "skills"
  | "languages"
  | "certifications"
  | "honors_awards"
  | "extra_curricular"
  | "resume_references";

// 2. Configuration for the Sidebar (Label + Icon)
const SECTIONS = [
  { key: "personal_info", label: "Personal Info", icon: <User size={18} /> },
  {
    key: "work_experience",
    label: "Experience",
    icon: <Briefcase size={18} />,
  },
  { key: "education", label: "Education", icon: <GraduationCap size={18} /> },
  { key: "skills", label: "Skills", icon: <Wrench size={18} /> },
  { key: "languages", label: "Languages", icon: <Globe size={18} /> },
  {
    key: "certifications",
    label: "Certifications",
    icon: <FileBadge size={18} />,
  },
  { key: "honors_awards", label: "Honors & Awards", icon: <Award size={18} /> },
  {
    key: "extra_curricular",
    label: "Extra-curriculars",
    icon: <Tent size={18} />,
  },
  { key: "resume_references", label: "References", icon: <Users size={18} /> },
];

interface ResumeEditorProps {
  resume: Resume;
}

export default function ResumeEditor({ resume }: ResumeEditorProps) {
  const [activeSection, setActiveSection] =
    useState<SectionKey>("personal_info");

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* --- COLUMN 1: SIDEBAR NAVIGATION --- */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-4 space-y-1">
          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sections
          </p>

          {SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key as SectionKey)}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium rounded-md transition-colors ${
                activeSection === section.key
                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- COLUMN 2: FORM AREA --- */}
      <div className="w-[450px] bg-white border-r border-gray-200 overflow-y-auto p-6 scrollbar-hide">
        {/* Header for the Form Column */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {SECTIONS.find((s) => s.key === activeSection)?.label}
          </h2>
          <p className="text-sm text-gray-500">Add details to your resume.</p>
        </div>

        {/* --- CONDITIONAL RENDERING OF FORMS --- */}

        {activeSection === "personal_info" && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <PersonalInfoForm
              resumeId={resume.id}
              initialData={resume.personal_info || null}
            />
          </div>
        )}

        {/* PLACEHOLDERS FOR OTHER FORMS (We will build these next) */}
        {activeSection === "work_experience" && (
          <Placeholder name="Work Experience" icon={<Briefcase size={40} />} />
        )}
        {activeSection === "education" && (
          <Placeholder name="Education" icon={<GraduationCap size={40} />} />
        )}
        {activeSection === "skills" && (
          <Placeholder name="Skills" icon={<Wrench size={40} />} />
        )}
        {activeSection === "languages" && (
          <Placeholder name="Languages" icon={<Globe size={40} />} />
        )}
        {activeSection === "certifications" && (
          <Placeholder name="Certifications" icon={<FileBadge size={40} />} />
        )}
        {activeSection === "honors_awards" && (
          <Placeholder name="Honors & Awards" icon={<Award size={40} />} />
        )}
        {activeSection === "extra_curricular" && (
          <Placeholder name="Extracurriculars" icon={<Tent size={40} />} />
        )}
        {activeSection === "resume_references" && (
          <Placeholder name="References" icon={<Users size={40} />} />
        )}
      </div>

      {/* --- COLUMN 3: PREVIEW AREA --- */}
      <div className="flex-1 bg-gray-100 overflow-y-auto p-8 flex justify-center">
        <div className="scale-[0.85] origin-top shadow-2xl">
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}

// Simple Placeholder Component to keep the code clean until we build the real forms
function Placeholder({ name, icon }: { name: string; icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-400">
      <div className="mb-4 opacity-50">{icon}</div>
      <p className="text-sm font-medium">{name} Form Coming Soon</p>
    </div>
  );
}
