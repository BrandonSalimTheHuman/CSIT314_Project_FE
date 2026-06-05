"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Cake,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Laptop,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ProfilePictureUpload, ResumeUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { CandidateOut, ResumeOut, WorkExperienceOut } from "@/lib/api/types";

// ── schema ────────────────────────────────────────────────────────────────────

const workExpSchema = z.object({
  id: z.number().optional(),
  companyName: z.string().min(1, "Company name is required."),
  jobTitle: z.string().min(1, "Job title is required."),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const schema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  gender: z.string().min(1, "Please select your gender."),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.string().optional(),
  website: z.string().optional(),
  yearsOfExperience: z.string().min(1, "Please select your experience range."),
  candidateLevel: z.string().min(1, "Please select your level."),
  preferredWorkingMode: z.string().optional(),
  preferredLocation: z.string().optional(),
  biography: z.string().optional(),
  skills: z.array(z.string()).min(1, "Please add at least one skill."),
  educationLevel: z.string().min(1, "Please select your education level."),
  fieldOfStudy: z.string().optional(),
  workExperiences: z.array(workExpSchema),
  profilePicture: z.any().optional(),
  resume: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

// ── helpers ───────────────────────────────────────────────────────────────────

interface ProfileState {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  website: string;
  preferredLocation: string;
  preferredWorkingMode: string;
  yearsOfExperience: string;
  candidateLevel: string;
  biography: string;
  skills: string[];
  educationLevel: string;
  fieldOfStudy: string;
  workExperiences: { id?: number; companyName: string; jobTitle: string; startDate: string; endDate: string; description: string }[];
  profilePictureUrl: string | null;
  resumes: ResumeOut[];
}

function candidateToProfile(c: CandidateOut, resumes: ResumeOut[]): ProfileState {
  return {
    fullName: c.full_name,
    email: "", // email comes from auth, not the candidate model
    phoneNumber: c.phone_number ?? "",
    gender: c.gender ?? "",
    dateOfBirth: c.date_of_birth ?? "",
    nationality: c.nationality ?? "",
    maritalStatus: c.marital_status ?? "",
    website: c.website ?? "",
    preferredLocation: c.preferred_location ?? "",
    preferredWorkingMode: c.preferred_working_mode ?? "",
    yearsOfExperience: c.years_of_experience ?? "",
    candidateLevel: c.candidate_level ?? "",
    biography: c.biography ?? "",
    skills: c.skills.map((s) => s.skill_name),
    educationLevel: c.education_level ?? "",
    fieldOfStudy: c.field_of_study ?? "",
    workExperiences: c.work_experiences.map((w) => ({
      id: w.experience_id,
      companyName: w.company_name,
      jobTitle: w.job_title,
      startDate: w.start_date ?? "",
      endDate: w.end_date ?? "",
      description: w.description ?? "",
    })),
    profilePictureUrl: c.profile_picture,
    resumes,
  };
}

function profileToFormDefaults(p: ProfileState): FormData {
  return {
    fullName: p.fullName,
    phoneNumber: p.phoneNumber,
    gender: p.gender,
    dateOfBirth: p.dateOfBirth,
    nationality: p.nationality,
    maritalStatus: p.maritalStatus,
    website: p.website,
    yearsOfExperience: p.yearsOfExperience,
    candidateLevel: p.candidateLevel,
    preferredWorkingMode: p.preferredWorkingMode,
    preferredLocation: p.preferredLocation,
    biography: p.biography,
    skills: p.skills,
    educationLevel: p.educationLevel,
    fieldOfStudy: p.fieldOfStudy,
    workExperiences: p.workExperiences,
    profilePicture: undefined,
    resume: undefined,
  };
}

const EDUCATION_LABELS: Record<string, string> = {
  "high-school": "High school / GED",
  associate: "Associate degree",
  bachelor: "Bachelor's degree",
  master: "Master's degree",
  doctorate: "Doctorate / PhD",
};

const LEVEL_LABELS: Record<string, string> = {
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

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  "prefer-not-to-say": "Prefer not to say",
};

const MARITAL_LABELS: Record<string, string> = {
  single: "Single",
  married: "Married",
  divorced: "Divorced",
  widowed: "Widowed",
};

const WORK_MODE_LABELS: Record<string, string> = {
  remote: "Remote",
  onsite: "On-site",
  hybrid: "Hybrid",
};

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

// ── component ─────────────────────────────────────────────────────────────────

export default function CandidateSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileState | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: profileToFormDefaults({
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      dateOfBirth: "",
      nationality: "",
      maritalStatus: "",
      website: "",
      preferredLocation: "",
      preferredWorkingMode: "",
      yearsOfExperience: "",
      candidateLevel: "",
      biography: "",
      skills: [],
      educationLevel: "",
      fieldOfStudy: "",
      workExperiences: [],
      profilePictureUrl: null,
      resumes: [],
    }),
  });

  const {
    fields: workExpFields,
    append: appendWorkExp,
    remove: removeWorkExp,
  } = useFieldArray({ control: form.control, name: "workExperiences" });

  // ── fetch profile on mount ────────────────────────────────────────────────

  async function fetchProfile() {
    try {
      const [candidate, resumes] = await Promise.all([
        apiFetch<CandidateOut>("/candidates/me"),
        apiFetch<ResumeOut[]>("/candidates/me/resumes"),
      ]);
      const p = candidateToProfile(candidate, resumes);
      setProfile(p);
      form.reset(profileToFormDefaults(p));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to load profile.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── submit handler ────────────────────────────────────────────────────────

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      // 1. Update candidate profile
      await apiFetch("/candidates/me", {
        method: "PATCH",
        body: JSON.stringify({
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          gender: data.gender,
          date_of_birth: data.dateOfBirth || null,
          nationality: data.nationality || null,
          marital_status: data.maritalStatus || null,
          website: data.website || null,
          years_of_experience: data.yearsOfExperience,
          candidate_level: data.candidateLevel,
          preferred_working_mode: data.preferredWorkingMode || null,
          preferred_location: data.preferredLocation || null,
          biography: data.biography || null,
          education_level: data.educationLevel,
          field_of_study: data.fieldOfStudy || null,
          skills: data.skills,
        }),
      });

      // 2. Upload profile picture if provided
      if (data.profilePicture instanceof File) {
        const picForm = new FormData();
        picForm.append("file", data.profilePicture);
        await apiFetch("/candidates/me/profile-picture", {
          method: "POST",
          body: picForm,
        });
      }

      // 3. Upload resume if provided
      if (data.resume instanceof File) {
        const resumeForm = new FormData();
        resumeForm.append("file", data.resume);
        await apiFetch("/resumes", {
          method: "POST",
          body: resumeForm,
        });
      }

      // 4. Sync work experiences
      // Determine which existing experiences were removed or updated
      const existingIds = new Set(
        (profile?.workExperiences ?? []).filter((w) => w.id != null).map((w) => w.id as number),
      );
      const submittedIds = new Set(
        data.workExperiences.filter((w) => w.id != null).map((w) => w.id as number),
      );

      // Delete removed experiences
      for (const id of existingIds) {
        if (!submittedIds.has(id)) {
          await apiFetch(`/work-experiences/${id}`, { method: "DELETE" });
        }
      }

      // Update existing or create new experiences
      for (const we of data.workExperiences) {
        const body = {
          company_name: we.companyName,
          job_title: we.jobTitle,
          start_date: we.startDate || null,
          end_date: we.endDate || null,
          description: we.description || null,
        };

        if (we.id != null && existingIds.has(we.id)) {
          // Existing experience — PATCH
          await apiFetch(`/work-experiences/${we.id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
          });
        } else {
          // New experience — POST
          await apiFetch("/candidates/me/work-experiences", {
            method: "POST",
            body: JSON.stringify({ ...body, source: "manual" }),
          });
        }
      }

      // 5. Refetch profile to update view mode
      setIsLoading(true);
      await fetchProfile();
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to save profile.";
      toast.error(message);
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      form.reset(profileToFormDefaults(profile));
    }
    setIsEditing(false);
  };

  // ── loading state ─────────────────────────────────────────────────────────

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── view mode ───────────────────────────────────────────────────────────────

  if (!isEditing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Header card */}
        <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
          <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-400" />
          <div className="px-6 pb-6 sm:px-8">
            {/* Avatar row — only the avatar overlaps the banner */}
            <div className="flex items-start justify-between">
              <div className="-mt-12">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow">
                  {profile.profilePictureUrl ? (
                    // biome-ignore lint/performance/noImgElement: profile picture URL from backend
                    <img
                      src={profile.profilePictureUrl}
                      alt={profile.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="size-12 text-muted-foreground" />
                  )}
                </div>
              </div>
              <Button variant="outline" className="mt-3 gap-2" onClick={() => setIsEditing(true)}>
                <Pencil className="size-4" />
                Edit Profile
              </Button>
            </div>

            {/* Name — below banner in normal flow */}
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-2xl">{profile.fullName}</h1>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#0A65CC] ring-1 ring-blue-200">
                  Free
                </span>
              </div>
              <p className="text-muted-foreground">
                {LEVEL_LABELS[profile.candidateLevel] ?? profile.candidateLevel} · {EXPERIENCE_LABELS[profile.yearsOfExperience] ?? profile.yearsOfExperience} experience
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground text-sm">
              {profile.preferredLocation && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-blue-500" />
                  {profile.preferredLocation}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Phone className="size-4 text-blue-500" />
                {profile.phoneNumber}
              </span>
              {profile.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="size-4 text-blue-500" />
                  {profile.email}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground hover:underline"
                >
                  <Globe className="size-4 text-blue-500" />
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Biography */}
            {profile.biography && (
              <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                <h2 className="mb-3 font-semibold text-base">Biography</h2>
                <p className="whitespace-pre-wrap text-muted-foreground text-sm leading-7">{profile.biography}</p>
              </div>
            )}

            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                <h2 className="mb-3 font-semibold text-base">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="h-auto rounded-full px-3 py-1 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-base">
                <GraduationCap className="size-5 text-blue-500" />
                Education
              </h2>
              <div className="flex gap-3">
                <div>
                  <p className="font-medium">{EDUCATION_LABELS[profile.educationLevel] ?? profile.educationLevel}</p>
                  {profile.fieldOfStudy && <p className="text-muted-foreground text-sm">{profile.fieldOfStudy}</p>}
                </div>
              </div>
            </div>

            {/* Work Experience */}
            {profile.workExperiences.length > 0 && (
              <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-base">
                  <Briefcase className="size-5 text-blue-500" />
                  Work Experience
                </h2>
                <div className="space-y-5">
                  {profile.workExperiences.map((exp, i) => (
                    <div key={exp.id ?? `${exp.companyName}-${exp.jobTitle}`}>
                      {i > 0 && <Separator className="mb-5" />}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                          <Briefcase className="size-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{exp.jobTitle}</p>
                          <p className="text-muted-foreground text-sm">{exp.companyName}</p>
                          <p className="mt-0.5 text-muted-foreground text-xs">
                            {formatDate(exp.startDate ?? "")} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                          </p>
                          {exp.description && (
                            <p className="mt-2 text-muted-foreground text-sm leading-6">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resumes */}
            {profile.resumes.length > 0 && (
              <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                <h2 className="mb-3 font-semibold text-base">Resume</h2>
                {profile.resumes.map((r) => (
                  <div key={r.resume_id} className="flex items-center gap-3 rounded-xl border border-border bg-muted p-3">
                    <FileText className="size-8 shrink-0 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{r.file_name}</p>
                      <p className="text-muted-foreground text-xs">{r.file_type.toUpperCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column — personal info */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-base">Personal Info</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <Cake className="size-5 text-blue-500" />,
                    label: "Date of Birth",
                    value: profile.dateOfBirth
                      ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—",
                  },
                  {
                    icon: <Globe className="size-5 text-blue-500" />,
                    label: "Nationality",
                    value: profile.nationality || "—",
                  },
                  {
                    icon: <UserCircle2 className="size-5 text-blue-500" />,
                    label: "Gender",
                    value: GENDER_LABELS[profile.gender] ?? (profile.gender || "—"),
                  },
                  {
                    icon: <Heart className="size-5 text-blue-500" />,
                    label: "Marital Status",
                    value: MARITAL_LABELS[profile.maritalStatus] ?? profile.maritalStatus ?? "—",
                  },
                  {
                    icon: <Laptop className="size-5 text-blue-500" />,
                    label: "Preferred Working Mode",
                    value: (WORK_MODE_LABELS[profile.preferredWorkingMode] ?? profile.preferredWorkingMode) || "—",
                  },
                  {
                    icon: <MapPin className="size-5 text-blue-500" />,
                    label: "Preferred Location",
                    value: profile.preferredLocation || "—",
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{icon}</div>
                    <div>
                      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">{label}</p>
                      <p className="font-medium text-foreground text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── edit mode ───────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Edit Profile</h1>
          <p className="text-muted-foreground text-sm">Update your candidate information</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isSaving}>
          <X className="size-5" />
        </Button>
      </div>

      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {/* Profile picture + Resume */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-semibold text-base">Profile &amp; Resume</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-sm">Profile Picture</p>
              <Controller
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <ProfilePictureUpload id="edit-profile-picture" value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-sm">Resume</p>
              <Controller
                control={form.control}
                name="resume"
                render={({ field }) => <ResumeUpload id="edit-resume" value={field.value} onChange={field.onChange} />}
              />
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-semibold text-base">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-full-name">Full Name</FieldLabel>
                  <Input
                    {...field}
                    id="edit-full-name"
                    placeholder="Your full name"
                    className="py-6"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-phone">Phone Number</FieldLabel>
                  <Input
                    {...field}
                    id="edit-phone"
                    placeholder="+1 (555) 000-0000"
                    className="py-6"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="gender"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-gender">Gender</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-gender" className="py-6">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="maritalStatus"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-marital">Marital Status</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-marital" className="py-6">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="dateOfBirth"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-dob">Date of Birth</FieldLabel>
                  <Input {...field} id="edit-dob" type="date" className="py-6" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="nationality"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-nationality">Nationality</FieldLabel>
                  <Input
                    {...field}
                    id="edit-nationality"
                    placeholder="e.g. American"
                    className="py-6"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="website"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5 sm:col-span-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-website">
                    Website / Portfolio <span className="font-normal text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-website"
                    placeholder="https://yoursite.com"
                    className="py-6"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Professional info */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-semibold text-base">Professional Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="yearsOfExperience"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-experience">Years of Experience</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-experience" className="py-6">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0–1 years</SelectItem>
                      <SelectItem value="1-3">1–3 years</SelectItem>
                      <SelectItem value="3-5">3–5 years</SelectItem>
                      <SelectItem value="5-10">5–10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="candidateLevel"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-level">Candidate Level</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-level" className="py-6">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="expert">Expert Level</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="preferredWorkingMode"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-work-mode">
                    Preferred Working Mode <span className="font-normal text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger id="edit-work-mode" className="py-6">
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="preferredLocation"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-preferred-location">
                    Preferred Location <span className="font-normal text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-preferred-location"
                    placeholder="e.g. New York, NY"
                    className="py-6"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="skills"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5 sm:col-span-2" data-invalid={fieldState.invalid}>
                  <FieldLabel>Skills</FieldLabel>
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type a skill and press Enter…"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="biography"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5 sm:col-span-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-bio">
                    Biography <span className="font-normal text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="edit-bio"
                    placeholder="Tell us about yourself…"
                    rows={4}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Education */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-semibold text-base">Education</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="educationLevel"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-edu-level">Level of Education</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-edu-level" className="py-6">
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High school or GED</SelectItem>
                      <SelectItem value="associate">Associate degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's degree</SelectItem>
                      <SelectItem value="master">Master's degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate / PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="fieldOfStudy"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-fos">
                    Field of Study <span className="font-normal text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-fos"
                    placeholder="e.g. Computer Science"
                    className="py-6"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Work Experience */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-base">Work Experience</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={() =>
                appendWorkExp({
                  companyName: "",
                  jobTitle: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
              className="gap-1.5"
            >
              <Plus className="size-4" />
              Add Experience
            </Button>
          </div>

          {workExpFields.length === 0 && (
            <p className="rounded-2xl border border-dashed py-6 text-center text-muted-foreground text-sm">
              No work experience yet — click "Add Experience" to add one.
            </p>
          )}

          <div className="grid gap-4">
            {workExpFields.map((workField, index) => (
              <div key={workField.id} className="relative grid gap-4 rounded-2xl border border-border p-4 pt-10">
                <div className="absolute top-3 right-3 flex items-center gap-1 text-muted-foreground text-xs">
                  <span>#{index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWorkExp(index)}
                    disabled={isSaving}
                    className="size-7 p-0 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    control={form.control}
                    name={`workExperiences.${index}.companyName`}
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`work-company-${index}`}>Company Name</FieldLabel>
                        <Input
                          {...field}
                          id={`work-company-${index}`}
                          placeholder="Company name"
                          className="py-6"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`workExperiences.${index}.jobTitle`}
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`work-title-${index}`}>Job Title</FieldLabel>
                        <Input
                          {...field}
                          id={`work-title-${index}`}
                          placeholder="Your job title"
                          className="py-6"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`workExperiences.${index}.startDate`}
                    render={({ field }) => (
                      <Field className="gap-1.5">
                        <FieldLabel htmlFor={`work-start-${index}`}>Start Date</FieldLabel>
                        <Input {...field} id={`work-start-${index}`} type="date" className="py-6" />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`workExperiences.${index}.endDate`}
                    render={({ field }) => (
                      <Field className="gap-1.5">
                        <FieldLabel htmlFor={`work-end-${index}`}>
                          End Date <span className="font-normal text-muted-foreground">(leave blank if current)</span>
                        </FieldLabel>
                        <Input {...field} id={`work-end-${index}`} type="date" className="py-6" />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`workExperiences.${index}.description`}
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5 sm:col-span-2" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`work-desc-${index}`}>
                          Description <span className="font-normal text-muted-foreground">(optional)</span>
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id={`work-desc-${index}`}
                          placeholder="Describe your responsibilities…"
                          rows={3}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" className="px-8" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
