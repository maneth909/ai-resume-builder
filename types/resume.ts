export interface Resume {
  id: string;
  title: string;
  template_style?: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  // Relationships
  personal_info?: PersonalInfo | null; // One-to-One (might be null if empty)
  work_experience: WorkExperience[]; // One-to-Many (Array)
  education: Education[]; // One-to-Many (Array)
  skills: Skill[]; // One-to-Many (Array)
  languages: Language[]; // One-to-Many (Array)
  extra_curricular: ExtraCurricular[]; // One-to-Many (Array)
  certifications: Certification[]; // One-to-Many (Array)
  honors_awards: HonorAward[]; // One-to-Many (Array)
  resume_references: Reference[]; // One-to-Many (Array)
}

export interface PersonalInfo {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  summary: string | null;
}

export interface WorkExperience {
  id: string;
  job_title: string | null;
  company: string | null;
  location: string | null;
  start_date: string | null; // Dates from DB come as strings in JS
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

export interface Education {
  id: string;
  school: string | null;
  degree: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string | null;
}

export interface ExtraCurricular {
  id: string;
  title: string;
  organization: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiration_date: string | null;
  url: string | null;
}

export interface HonorAward {
  id: string;
  title: string;
  issuer: string | null;
  award_date: string | null;
  description: string | null;
}

export interface Reference {
  id: string;
  name: string;
  position: string | null;
  organization: string | null;
  email: string | null;
  phone: string | null;
  relationship: string | null;
}
