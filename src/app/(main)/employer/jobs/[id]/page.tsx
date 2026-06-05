"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  DollarSign,
  FileText,
  GraduationCap,
  Italic,
  List,
  Loader2,
  MapPin,
  Pencil,
  Strikethrough,
  Trash2,
  Underline,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { ApiError, apiFetch } from "@/lib/api/client";
import type {
  ApplicationOut,
  CandidateOut,
  JobPostingOut,
  JobPostingUpdate,
  RecommendedCandidatesOut,
} from "@/lib/api/types";
import { type CandidateProfile, CandidateProfileModal } from "@/components/candidate-profile-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// ── Filter option lists ─────────────────────────────────────────────────────

const levelFilterOptions = [
  { label: "All", value: "All" },
  { label: "Entry Level", value: "entry" },
  { label: "Mid Level", value: "mid" },
  { label: "Expert Level", value: "expert" },
];

const experienceFilterOptions = [
  { label: "All", value: "All" },
  { label: "0–1 years", value: "0-1" },
  { label: "1–3 years", value: "1-3" },
  { label: "3–5 years", value: "3-5" },
  { label: "5–10 years", value: "5-10" },
  { label: "10+ years", value: "10+" },
];

const educationFilterOptions = [
  { label: "All", value: "All" },
  { label: "High School", value: "high-school" },
  { label: "Associate Degree", value: "associate" },
  { label: "Bachelor's Degree", value: "bachelor" },
  { label: "Master's Degree", value: "master" },
  { label: "Doctorate / PhD", value: "doctorate" },
];

// ── Edit-form option lists ──────────────────────────────────────────────────

const EDUCATION_OPTIONS = [
  { value: "high-school", label: "High School" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate / PhD" },
];

const WORK_MODE_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

const SALARY_OPTIONS = ["$50 - $1000", "$1000 - $2500", "$2500 - $4000", "$4000 - $6000", "$6000 - $8000", "$8000 - $10000", "$10000 - $15000", "$15000+"];

const EDITOR_MENU = [
  { label: "Bold",          Icon: Bold,          command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBold().run(),        active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bold") },
  { label: "Italic",        Icon: Italic,        command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleItalic().run(),      active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("italic") },
  { label: "Underline",     Icon: Underline,     command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleUnderline().run(),   active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("underline") },
  { label: "Strikethrough", Icon: Strikethrough, command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleStrike().run(),      active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("strike") },
  { label: "Bullet list",   Icon: List,          command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBulletList().run(),  active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bulletList") },
];

/** Map work_mode enum back to a display string */
function workModeLabel(wm: string | null | undefined): string {
  const map: Record<string, string> = { remote: "Remote", onsite: "On-site", hybrid: "Hybrid" };
  return wm ? (map[wm] ?? wm) : "N/A";
}

const CANDIDATE_LEVEL_LABELS: Record<string, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  expert: "Expert Level",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  "0-1": "0–1 years",
  "1-3": "1–3 years",
  "3-5": "3–5 years",
  "5-10": "5–10 years",
  "10+": "10+ years",
};

const EDUCATION_LABELS: Record<string, string> = {
  "high-school": "High School",
  associate: "Associate Degree",
  bachelor: "Bachelor's Degree",
  master: "Master's Degree",
  doctorate: "Doctorate / PhD",
};

function formatLabel(value: string | null | undefined, map: Record<string, string>): string {
  if (!value) return "N/A";
  return map[value] ?? value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
}

/** Convert a CandidateOut to the CandidateProfile shape the modal expects */
function toCandidateProfile(c: CandidateOut, coverLetter = ""): CandidateProfile {
  return {
    name: c.full_name,
    title: c.candidate_level ?? "",
    experience: c.years_of_experience ?? "",
    avatar: c.profile_picture,
    biography: c.biography ?? "",
    coverLetter,
    dateOfBirth: c.date_of_birth ?? "",
    nationality: c.nationality ?? "",
    maritalStatus: c.marital_status ?? "",
    gender: c.gender ?? "",
    education: c.education_level ?? "",
    fieldOfStudy: c.field_of_study ?? "",
    preferredWorkingMode: c.preferred_working_mode ?? "",
    website: c.website ?? "",
    location: c.preferred_location ?? "",
    phone: c.phone_number ?? "",
    email: "",
    skills: c.skills,
    workExperiences: c.work_experiences,
    resumeUrl: c.resume_url,
  };
}

// ── Candidate Card ──────────────────────────────────────────────────────────

function CandidateCard({ candidate, onViewProfile }: { candidate: CandidateOut; onViewProfile: () => void }) {
  return (
    <div className="group flex flex-col gap-4 rounded-3xl border border-border bg-background p-4 transition-all hover:border-sky-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
          <span className="font-semibold text-base text-slate-700 uppercase">
            {candidate.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>

        <div className="min-w-0">
          <div className="font-semibold text-base">{candidate.full_name}</div>
          <div className="text-muted-foreground text-sm">{formatLabel(candidate.candidate_level, CANDIDATE_LEVEL_LABELS)}</div>

          <div className="mt-3 flex flex-wrap gap-3 text-muted-foreground text-sm">
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              <span>{candidate.preferred_location ?? "N/A"}</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-4" />
              <span>{formatLabel(candidate.years_of_experience, EXPERIENCE_LABELS)} experience</span>
            </div>
          </div>

          {candidate.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {candidate.skills.slice(0, 5).map((s) => (
                <span key={s.skill_id} className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-sky-700 text-xs">
                  {s.skill_name}
                </span>
              ))}
              {candidate.skills.length > 5 && (
                <span className="text-muted-foreground text-xs">+{candidate.skills.length - 5} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewProfile}
          className="h-10 gap-2 bg-sky-100 px-6 font-semibold text-sky-600 transition-all hover:bg-sky-700 hover:text-white group-hover:bg-sky-700 group-hover:text-white"
        >
          View Profile
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ── Edit Job Form ───────────────────────────────────────────────────────────

function EditJobForm({
  job,
  onSave,
  onCancel,
}: {
  job: JobPostingOut;
  onSave: (update: JobPostingUpdate) => Promise<void>;
  onCancel: () => void;
}) {
  const [jobTitle, setJobTitle] = useState(job.title);
  const [jobLocation, setJobLocation] = useState(job.location ?? "");
  const [editEducation, setEditEducation] = useState(job.required_education ?? "");
  const [workMode, setWorkMode] = useState(job.work_mode ?? "onsite");
  const [salary, setSalary] = useState(job.salary_range ?? "$50 - $1000");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, UnderlineExt],
    content: job.company_info || "<p></p>",
    immediatelyRender: false,
  });

  const editorIsMounted = Boolean(editor);

  const handleSave = async () => {
    setSaving(true);
    try {
      const update: JobPostingUpdate = {
        title: jobTitle,
        location: jobLocation || undefined,
        company_info: editor?.getText() ?? undefined,
        required_education: editEducation || undefined,
        work_mode: workMode as JobPostingUpdate["work_mode"],
        salary_range: salary,
      };
      await onSave(update);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-0">
      <div className="mb-8 flex items-center justify-between">
        <div className="text-3xl font-semibold">Edit Job</div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="size-5" />
        </Button>
      </div>

      {/* Basic info */}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="job-title">Job Title</Label>
          <Input
            id="job-title"
            placeholder="Add job title, role, vacancies etc"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="job-location">Job Location</Label>
          <Textarea
            id="job-location"
            placeholder="Add job location"
            className="min-h-[80px]"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Advanced Information */}
      <div className="mt-10 grid gap-2">
        <div className="mb-4 text-lg font-semibold">Advanced Information</div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>Education</Label>
            <Select value={editEducation} onValueChange={setEditEducation}>
              <SelectTrigger className="w-full py-5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {EDUCATION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Work Mode</Label>
            <Select value={workMode} onValueChange={setWorkMode}>
              <SelectTrigger className="w-full py-5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {WORK_MODE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Salary</Label>
            <Select value={salary} onValueChange={setSalary}>
              <SelectTrigger className="w-full py-5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {SALARY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Description & Responsibility */}
      <div className="mt-10">
        <div className="mb-4 text-lg font-semibold">Description &amp; Responsibility</div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <div className="rounded-3xl border border-border bg-white shadow-sm">
            <div className="flex flex-wrap gap-2 border-b border-border/70 bg-slate-100 p-3">
              {EDITOR_MENU.map(({ label, Icon, command, active }) => (
                <Button
                  key={label}
                  type="button"
                  variant={editor && active(editor) ? "secondary" : "outline"}
                  size="sm"
                  className="min-w-[3rem]"
                  onClick={() => editor && command(editor)}
                  disabled={!editor}
                >
                  <Icon className="size-4" />
                </Button>
              ))}
            </div>
            <div className="min-h-[220px] rounded-b-3xl px-4 py-4">
              {editorIsMounted ? (
                <EditorContent
                  editor={editor}
                  className="min-h-[180px] focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:list-item"
                />
              ) : (
                <Textarea readOnly value="Loading editor..." className="min-h-[180px]" />
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 py-6 text-base" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1 bg-sky-700 py-6 text-base font-semibold hover:bg-sky-800" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

// ── Applicant Card ──────────────────────────────────────────────────────────

function ApplicantCard({
  application,
  onMarkReviewed,
  onViewProfile,
}: {
  application: ApplicationOut;
  onMarkReviewed: (appId: number) => void;
  onViewProfile: () => void;
}) {
  const c = application.candidate;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <span className="font-semibold text-sm text-slate-700 uppercase">
            {(c?.full_name ?? "?")
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <div className="font-semibold text-sm">{c?.full_name ?? "Unknown"}</div>
          <div className="text-muted-foreground text-xs">
            Applied {new Date(application.applied_at).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            application.status === "reviewed"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {application.status}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 bg-sky-100 px-4 text-xs font-semibold text-sky-600 hover:bg-sky-700 hover:text-white"
          onClick={onViewProfile}
        >
          View Profile
          <ArrowRight className="size-3" />
        </Button>
        {application.status === "pending" && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => onMarkReviewed(application.application_id)}
          >
            <Check className="size-3" />
            Mark Reviewed
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function EmployerJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Job detail state
  const [job, setJob] = useState<JobPostingOut | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Recommended candidates state
  const [candidates, setCandidates] = useState<CandidateOut[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [candidatesTotal, setCandidatesTotal] = useState(0);

  // Applications state
  const [applications, setApplications] = useState<ApplicationOut[]>([]);
  const [activeTab, setActiveTab] = useState<"recommended" | "applicants">("recommended");

  // Filter state
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterExperience, setFilterExperience] = useState("All");
  const [education, setEducation] = useState<string[]>(["All"]);
  const [page, setPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  // ── Fetch job detail ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function fetchJob() {
      setJobLoading(true);
      setJobError(null);
      try {
        const data = await apiFetch<JobPostingOut>(`/job-postings/${id}`);
        if (!cancelled) setJob(data);
      } catch (err) {
        if (!cancelled) setJobError(err instanceof ApiError ? err.message : "Failed to load job.");
      } finally {
        if (!cancelled) setJobLoading(false);
      }
    }
    fetchJob();
    return () => { cancelled = true; };
  }, [id]);

  // ── Fetch recommended candidates ───────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function fetchCandidates() {
      try {
        const data = await apiFetch<RecommendedCandidatesOut>(
          `/job-postings/${id}/recommended-candidates`,
        );
        if (!cancelled) {
          setCandidates(data.candidates);
          setIsMember(data.is_member);
          setCandidatesTotal(data.total);
        }
      } catch {
        // non-fatal — just leave empty
      }
    }
    fetchCandidates();
    return () => { cancelled = true; };
  }, [id]);

  // ── Fetch applications ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function fetchApplications() {
      try {
        const data = await apiFetch<ApplicationOut[]>(`/job-postings/${id}/applications`);
        if (!cancelled) setApplications(data);
      } catch {
        // non-fatal
      }
    }
    fetchApplications();
    return () => { cancelled = true; };
  }, [id]);

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleSave = async (update: JobPostingUpdate) => {
    try {
      const updated = await apiFetch<JobPostingOut>(`/job-postings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(update),
      });
      setJob(updated);
      setIsEditing(false);
      toast.success("Job updated successfully.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update job.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    setDeleting(true);
    try {
      await apiFetch(`/job-postings/${id}`, { method: "DELETE" });
      toast.success("Job deleted.");
      router.push("/employer/jobs");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete job.");
      setDeleting(false);
    }
  };

  const handleMarkReviewed = async (applicationId: number) => {
    try {
      const updated = await apiFetch<ApplicationOut>(`/applications/${applicationId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "reviewed" }),
      });
      setApplications((prev) =>
        prev.map((a) => (a.application_id === applicationId ? updated : a)),
      );
      toast.success("Application marked as reviewed.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update application.");
    }
  };

  // ── Client-side filtering on recommended candidates ────────────────────

  const filteredCandidates = candidates.filter((candidate) => {
    if (filterLevel !== "All" && candidate.candidate_level !== filterLevel) return false;
    if (filterExperience !== "All" && candidate.years_of_experience !== filterExperience) return false;
    if (!education.includes("All") && education.length > 0) {
      if (!education.includes(candidate.education_level ?? "")) return false;
    }
    return true;
  });

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));
  const currentCandidates = filteredCandidates.slice((page - 1) * pageSize, page * pageSize);

  const getVisiblePages = () => {
    const half = Math.floor(5 / 2);
    let start = Math.max(page - half, 1);
    let end = start + 5 - 1;
    if (end > pageCount) {
      end = pageCount;
      start = Math.max(end - 5 + 1, 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  // ── Loading / Error ────────────────────────────────────────────────────

  if (jobLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{jobError ?? "Job not found."}</p>
        <Button variant="outline" onClick={() => router.push("/employer/jobs")}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="justify-left flex w-full rounded-[0.5rem] bg-muted px-10 py-5 align-center font-semibold text-black text-lg">
        Job Details
      </div>
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <section className="space-y-6 rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:p-8">
            {isEditing ? (
              <EditJobForm job={job} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            ) : (
              <>
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted">
                        <BriefcaseBusiness className="size-10 text-muted-foreground" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h1 className="font-semibold text-2xl">{job.title}</h1>
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-sm">
                              {workModeLabel(job.work_mode)}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 font-medium text-sm ${job.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {job.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 lg:justify-start">
                    <Button onClick={() => setIsEditing(true)} className="h-10 w-60 gap-2 bg-sky-700 px-6 py-3 text-base">
                      <Pencil className="size-4" />
                      Edit Job
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="h-10 w-60 gap-2 px-6 py-3 text-base"
                    >
                      <Trash2 className="size-4" />
                      {deleting ? "Deleting..." : "Delete Job"}
                    </Button>
                    <div className="text-right">
                      <div className="text-muted-foreground text-sm">
                        Posted: {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 font-semibold text-base">Job Description</h3>
                      <p className="text-muted-foreground text-sm leading-7">{job.company_info ?? "No description provided."}</p>
                    </div>
                    {job.required_skills.length > 0 && (
                      <div>
                        <h3 className="mb-3 font-semibold text-base">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.required_skills.map((s) => (
                            <span key={s.skill_id} className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sky-700 text-sm">
                              {s.skill_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-border bg-background p-6">
                    <h3 className="mb-4 font-semibold text-base">Job Overview</h3>
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1 py-4">
                        <CalendarDays color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Job Posted:</div>
                        <div className="font-medium text-sm">{new Date(job.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <GraduationCap color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Education:</div>
                        <div className="font-medium text-sm">{formatLabel(job.required_education, EDUCATION_LABELS)}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <DollarSign color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Salary:</div>
                        <div className="font-medium text-sm">{job.salary_range ?? "N/A"}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <MapPin color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Location:</div>
                        <div className="font-medium text-sm">{job.location ?? "N/A"}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <FileText color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Work Mode:</div>
                        <div className="font-medium text-sm">{workModeLabel(job.work_mode)}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <BriefcaseBusiness color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Experience:</div>
                        <div className="font-medium text-sm">{job.required_experience != null ? `${job.required_experience} years` : "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        {/* ── Tab toggle: Recommended Candidates / Applicants ── */}
        <div className="mt-8 flex gap-4 border-b border-border pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("recommended")}
            className={`px-4 pb-3 font-semibold text-sm transition-colors ${activeTab === "recommended" ? "border-b-2 border-sky-700 text-sky-700" : "text-muted-foreground hover:text-foreground"}`}
          >
            Recommended Candidates ({filteredCandidates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("applicants")}
            className={`px-4 pb-3 font-semibold text-sm transition-colors ${activeTab === "applicants" ? "border-b-2 border-sky-700 text-sky-700" : "text-muted-foreground hover:text-foreground"}`}
          >
            Applicants ({applications.length})
          </button>
        </div>

        {activeTab === "applicants" ? (
          /* ── Applicants section ── */
          <section className="mt-6 rounded-[2rem] bg-card p-6 lg:p-8">
            <h2 className="mb-4 font-semibold text-lg text-muted-foreground uppercase tracking-[0.2em]">
              Applicants
            </h2>
            {applications.length === 0 ? (
              <p className="text-muted-foreground text-sm">No applicants yet.</p>
            ) : (
              <div className="grid gap-3">
                {applications.map((app) => (
                  <ApplicantCard
                    key={app.application_id}
                    application={app}
                    onMarkReviewed={handleMarkReviewed}
                    onViewProfile={() => {
                      if (app.candidate) {
                        setSelectedCandidate(toCandidateProfile(app.candidate, app.cover_letter ?? ""));
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          /* ── Recommended candidates section (with filters) ── */
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
            <section className="mt-8 rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-lg text-muted-foreground uppercase tracking-[0.2em]">Filters</h2>
                  </div>
                  <div className="inline-flex w-60 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-muted-foreground text-sm">
                    <Users className="size-4" />
                    {filteredCandidates.length} candidates
                  </div>
                </div>

                {!isMember && candidatesTotal > candidates.length && (
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-800 text-sm">
                    Showing {candidates.length} of {candidatesTotal} candidates. Upgrade to membership for full access.
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
                    <div className="mb-2 font-semibold text-foreground text-sm">Candidate Level</div>
                    <div className="grid gap-3">
                      {levelFilterOptions.map((option) => (
                        <label
                          key={option.value}
                          className="inline-flex cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm transition hover:border-primary/70"
                        >
                          <input
                            type="radio"
                            name="candidate-level"
                            value={option.value}
                            checked={filterLevel === option.value}
                            onChange={() => { setFilterLevel(option.value); setPage(1); }}
                            className="h-4 w-4 accent-primary"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
                    <div className="mb-2 font-semibold text-foreground text-sm">Experiences</div>
                    <div className="grid gap-2">
                      {experienceFilterOptions.map((option) => (
                        <label
                          key={option.value}
                          className="inline-flex cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm transition hover:border-primary/70"
                        >
                          <input
                            type="radio"
                            name="candidate-experience"
                            value={option.value}
                            checked={filterExperience === option.value}
                            onChange={() => { setFilterExperience(option.value); setPage(1); }}
                            className="h-4 w-4 accent-primary"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
                    <div className="mb-2 font-semibold text-foreground text-sm">Education</div>
                    <div className="grid gap-2">
                      {educationFilterOptions.map((option) => (
                        <label
                          key={option.value}
                          className="inline-flex cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm transition hover:border-primary/70"
                        >
                          <input
                            type="checkbox"
                            value={option.value}
                            checked={education.includes(option.value)}
                            onChange={(event) => {
                              const value = event.target.value;
                              if (value === "All") {
                                setEducation(["All"]);
                                return;
                              }
                              setEducation((current) => {
                                const next = current.includes(value)
                                  ? current.filter((item) => item !== value)
                                  : [...current.filter((item) => item !== "All"), value];
                                return next.length ? next : ["All"];
                              });
                              setPage(1);
                            }}
                            className="h-4 w-4 accent-primary"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="mt-8 rounded-[2rem] bg-card p-6 lg:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-lg text-muted-foreground uppercase tracking-[0.2em]">
                    Recommended Candidates
                  </h2>
                </div>
              </div>

              {currentCandidates.length === 0 ? (
                <p className="text-muted-foreground text-sm">No candidates match the current filters.</p>
              ) : (
                <div className="grid gap-4">
                  {currentCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.candidate_id}
                      candidate={candidate}
                      onViewProfile={() => setSelectedCandidate(toCandidateProfile(candidate))}
                    />
                  ))}
                </div>
              )}

              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  className="size-10 rounded-full text-blue-400 hover:bg-blue-50 hover:text-blue-600"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ArrowLeft className="size-6" />{" "}
                </Button>

                <div className="flex items-center gap-1">
                  {visiblePages.map((pageNum) => {
                    const isCurrent = page === pageNum;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        className={`flex size-10 items-center justify-center rounded-full font-medium text-sm transition-colors ${
                          isCurrent
                            ? "bg-[#0061C2] text-white"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        }
            `}
                      >
                        {String(pageNum).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="ghost"
                  className="size-10 rounded-full text-blue-400 hover:bg-blue-50 hover:text-blue-600"
                  disabled={page >= pageCount}
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                >
                  <ArrowRight className="size-6" />
                </Button>
              </div>
              <div className="text-muted-foreground text-sm">
                Page {page} of {pageCount}
              </div>
            </section>
          </div>
        )}
      </main>
      {selectedCandidate && (
        <CandidateProfileModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
      )}
    </div>
  );
}
