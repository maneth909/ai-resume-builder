"use server";

import { Resume } from "@/types/resume";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 1. Helper to strip unnecessary data (Saves tokens & confusion)
function mapResumeData(resume: Resume) {
  return {
    personal: {
      summary: resume.personal_info?.summary,
      location: resume.personal_info?.location,
    },
    experience: resume.work_experience?.map((w) => ({
      role: w.job_title,
      company: w.company,
      description: w.description?.slice(0, 1000), // Critical for ATS analysis
      is_current: w.is_current,
    })),
    education: resume.education?.map((e) => ({
      degree: e.degree,
      school: e.school,
    })),
    skills: resume.skills?.map((s) => s.name), // Just names, no IDs
    languages: resume.languages?.map((l) => l.name),
    certifications: resume.certifications?.map((c) => c.name),
  };
}

// 2. Main Action
export async function analyzeResume(resume: Resume, jobDescription?: string) {
  if (!resume) throw new Error("No resume data provided");

  const cleanData = mapResumeData(resume);
  const resumeContext = JSON.stringify(cleanData, null, 2);

  // 3. Dynamic Prompting based on JD presence
  const systemPrompt = `
You are an ATS (Applicant Tracking System) resume analysis expert.

TASK:
${
  jobDescription
    ? "Compare the resume JSON against the provided Job Description."
    : "Audit the resume for general ATS best practices and impact."
}

OUTPUT FORMAT RULES:
- Return RAW HTML only.
- Do NOT use Markdown, code blocks, or backticks.
- Do NOT include inline styles, <style>, <script>, or external links.
- Use semantic HTML only: <h4>, <p>, <ul>, <li>, <strong>.

REQUIRED STRUCTURE (follow exactly):

<h4>ATS Score</h4>
<p><strong>{{SCORE}} / 100</strong> – {{1-sentence summary}}</p>

<h4>Critical Fixes</h4>
<ul>
  <li>{{3–5 specific, actionable fixes based strictly on the resume content}}</li>
</ul>

<h4>${jobDescription ? "Missing Keywords" : "Keyword Gaps"}</h4>
<ul>
  <li>{{List 3–5 relevant keywords that are missing or underused}}</li>
</ul>

SCORING RUBRIC:
- Start from 100 points.
- Deduct up to:
  - 40 points for missing or weak job-description keywords (if JD provided).
  - 30 points for vague or unquantified experience descriptions.
  - 20 points for missing or underutilized skills.
  - 10 points for unclear summary or role alignment.

RULES:
- Base analysis ONLY on the provided data.
- Do NOT invent experience, tools, or skills.
- Only suggest keywords found in or clearly implied by the Job Description (if provided).
- If information is missing, explicitly state it.
`;

  const userMessage = jobDescription
    ? `RESUME DATA:\n${resumeContext}\n\nTARGET JOB DESCRIPTION:\n${jobDescription}`
    : `RESUME DATA:\n${resumeContext}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile",

      temperature: 0.3,
      max_tokens: 1024,
    });

    return (
      chatCompletion.choices[0]?.message?.content ||
      "<p>Analysis failed to generate.</p>"
    );
  } catch (error) {
    console.error("Groq AI Error:", error);
    throw new Error("Failed to analyze resume.");
  }
}
