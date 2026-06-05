// Minimal mirrors of the backend response schemas (app/schemas.py).
// Extend as more endpoints are wired.

export type ParseStatus = "pending" | "success" | "failed";
export type JobStatus = "draft" | "published";
export type ApplicationStatus = "pending" | "reviewed";
export type DataSource = "parsed" | "manual";
export type WorkingMode = "remote" | "onsite" | "hybrid";

export interface SkillOut {
  skill_id: number;
  skill_name: string;
}

export interface WorkExperienceOut {
  experience_id: number;
  candidate_id: number;
  resume_id: number | null;
  source: DataSource;
  company_name: string;
  job_title: string;
  start_date: string | null; // ISO YYYY-MM-DD
  end_date: string | null;
  description: string | null;
}

export interface WorkExperienceUpdate {
  company_name?: string | null;
  job_title?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
}

export interface ResumeOut {
  resume_id: number;
  candidate_id: number;
  file_name: string;
  file_type: string;
  file_url: string;
  uploaded_at: string;
  parse_status: ParseStatus;
}

export interface CandidateOut {
  candidate_id: number;
  user_id: string;
  full_name: string;
  phone_number: string | null;
  gender: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  marital_status: string | null;
  website: string | null;
  biography: string | null;
  years_of_experience: string | null;
  candidate_level: string | null;
  profile_picture: string | null;
  education_level: string | null;
  field_of_study: string | null;
  preferred_working_mode: WorkingMode | null;
  preferred_location: string | null;
  resume_url: string | null;
  skills: SkillOut[];
  work_experiences: WorkExperienceOut[];
  created_at: string;
  updated_at: string;
}

export interface EmployerOut {
  employer_id: number;
  user_id: string;
  full_name: string;
  company_name: string;
  phone_number: string | null;
  company_information: string | null;
  company_website: string | null;
  profile_picture: string | null;
  company_picture: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobPostingOut {
  job_id: number;
  employer_id: number;
  title: string;
  company_info: string | null;
  required_education: string | null;
  required_experience: number | null;
  work_mode: WorkingMode | null;
  location: string | null;
  salary_range: string | null;
  status: JobStatus;
  created_at: string;
  required_skills: SkillOut[];
}

export interface JobPostingCreate {
  title: string;
  company_info?: string | null;
  required_education?: string | null;
  required_experience?: number | null;
  work_mode?: WorkingMode | null;
  location?: string | null;
  salary_range?: string | null;
  status?: JobStatus;
  required_skills?: string[] | null;
}

export interface JobPostingUpdate {
  title?: string | null;
  company_info?: string | null;
  required_education?: string | null;
  required_experience?: number | null;
  work_mode?: WorkingMode | null;
  location?: string | null;
  salary_range?: string | null;
  status?: JobStatus | null;
  required_skills?: string[] | null;
}

export interface ApplicationOut {
  application_id: number;
  candidate_id: number;
  job_id: number;
  applied_at: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  candidate: CandidateOut | null;
  job: JobPostingOut | null;
}

export interface ApplicationCreate {
  candidate_id: number;
  job_id: number;
  cover_letter?: string | null;
}

export interface RecommendedJobsOut {
  is_member: boolean;
  total: number;
  jobs: JobPostingOut[];
}

export interface RecommendedCandidatesOut {
  is_member: boolean;
  total: number;
  candidates: CandidateOut[];
}

export interface MembershipOut {
  membership_id: number | null;
  user_id: string;
  is_active: boolean;
  status: string | null;
  cancel_at_period_end: boolean;
  start_date: string | null;
  end_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export interface MembershipCheckoutOut {
  url: string;
}

export interface MembershipPortalOut {
  url: string;
}

/** Generic paginated response from the backend */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
