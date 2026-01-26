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

  const systemPrompt = `
You are an ATS (Applicant Tracking System) resume analysis expert.

STRUCTURE (FOLLOW EXACTLY):

<h4>📊 ATS Score</h4>
<p><strong>{{SCORE}} / 100</strong> – {{one concise sentence summary}}</p>

<h4>🚨 Critical Fixes</h4>
<ul>
  <li>{{Specific, actionable fix #1}}</li>
  <li>{{Specific, actionable fix #2}}</li>
  <li>{{Specific, actionable fix #3}}</li>
  <li>{{Specific, actionable fix #4}}</li>
  <li>{{Specific, actionable fix #5}}</li>
</ul>

<h4>🔑 ${jobDescription ? "Missing Keywords" : "Keyword Gaps"}</h4>
<ul>
  <li>{{Keyword 1}}</li>
  <li>{{Keyword 2}}</li>
  <li>{{Keyword 3}}</li>
  <li>{{Keyword 4}}</li>
  <li>{{Keyword 5}}</li>
</ul>

TASK:
${
  jobDescription
    ? "Compare the resume JSON against the provided Job Description."
    : "Audit the resume for general ATS best practices and impact."
}

JOB DESCRIPTION CONSTRAINT (CRITICAL):
- Treat the Job Description text as the ONLY source of truth for required skills, tools, and keywords.
- Extract required keywords ONLY from the Job Description text.
- If a keyword does NOT appear in the Job Description, DO NOT suggest it.
- Do NOT infer, guess, or generalize technologies beyond what is explicitly stated.
- Ignore any knowledge about this application, AI systems, language models, or chat completion.

OUTPUT FORMAT RULES:
- Return RAW HTML only.
- Do NOT use Markdown, code blocks, or backticks.
- Do NOT include inline styles, <style>, <script>, or external links.
- "Critical Fixes" and "Missing Keywords" MUST be <ul> lists. Do NOT use <p> paragraphs for these sections.** 
- Use semantic HTML only: <h4>, <p>, <ul>, <li>, <strong>.
- Emojis are allowed ONLY inside <h4> tags.


SCORING RUBRIC:
- Start from 100 points.
- Deduct up to:
  - 40 points for missing or weak keywords explicitly listed in the Job Description (if provided).
  - 30 points for vague, generic, or unquantified experience descriptions.
  - 20 points for missing or underutilized skills that appear in the Job Description.
  - 10 points for unclear summary or weak role alignment.

CRITICAL FIX GUIDELINES:
- Only list fixes that materially impact ATS matching or recruiter evaluation.
- Do NOT suggest minor stylistic preferences as critical issues.
- Do NOT suggest inflating, assuming, or fabricating years of experience.
- If suggesting clarification, frame it as “clarify” or “expand,” not “match requirements.”
- Do NOT suggest matching or adjusting years of experience to job requirements; only suggest clarifying or better describing existing experience.
- Do NOT suggest adding years of experience; only suggest clarifying timelines or quantified outcomes already implied by the resume.
- Do NOT suggest certifications, courses, or credentials unless they are explicitly required or mentioned in the Job Description.


STRICT ACCURACY RULES:
- Only reference text that explicitly exists in the provided resume JSON.
- Do NOT assume typos, errors, or missing sections unless they are clearly present.
- If required information is missing, explicitly state that it is missing.

FORBIDDEN:
- Do NOT mention AI, machine learning, NLP, LLaMA, chat completion, or language models unless they explicitly appear in the Job Description.
- Do NOT invent tools, frameworks, certifications, responsibilities, or experience.

FINAL ENFORCEMENT:
- Base all analysis strictly on the provided resume and Job Description text. No external assumptions.
- Every section MUST use proper HTML tags.
- Bullet points MUST use <ul> and <li>.
- No paragraphs masquerading as lists.
- No plain text.

VALIDATION:
- If any section is not wrapped in proper HTML tags, the response is INVALID.
- Do not return explanatory text, warnings, or apologies.

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

      temperature: 0.2,
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
