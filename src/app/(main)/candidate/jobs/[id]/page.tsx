"use client";

import { use, useEffect, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import {
  ArrowRight,
  Bold,
  Briefcase,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  DollarSign,
  FileText,
  GraduationCap,
  Italic,
  Link2,
  List,
  Loader2,
  MapPin,
  Strikethrough,
  Underline,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api/client";
import type { ApplicationCreate, ApplicationOut, CandidateOut, JobPostingOut } from "@/lib/api/types";

const EDITOR_MENU = [
  { label: "Bold",          Icon: Bold,          command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBold().run(),       active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bold") },
  { label: "Italic",        Icon: Italic,        command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleItalic().run(),     active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("italic") },
  { label: "Underline",     Icon: Underline,     command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleUnderline().run(),  active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("underline") },
  { label: "Strikethrough", Icon: Strikethrough, command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleStrike().run(),     active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("strike") },
  { label: "Bullet list",   Icon: List,          command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBulletList().run(), active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bulletList") },
];

function CoverLetterEditor({ onSubmit, onCancel, submitting }: { onSubmit: (text: string) => void; onCancel: () => void; submitting: boolean }) {
  const editor = useEditor({
    extensions: [StarterKit, UnderlineExt],
    content: "<p></p>",
    immediatelyRender: false,
  });
  const mounted = Boolean(editor);

  const handleSubmit = () => {
    const text = editor?.getText().trim() ?? "";
    if (!text) {
      toast.error("Please write a cover letter before submitting.");
      return;
    }
    onSubmit(text);
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 rounded-t-2xl border-b border-border/70 bg-slate-100 p-3">
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
        <div className="min-h-[420px] rounded-b-2xl px-4 py-4">
          {mounted ? (
            <EditorContent
              editor={editor}
              className="min-h-[380px] focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:list-item"
            />
          ) : (
            <Textarea readOnly value="Loading editor..." className="min-h-[380px]" />
          )}
        </div>
      </div>

      <DialogFooter className="mt-4 gap-2 sm:gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1" disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="flex-1 bg-sky-700 font-semibold hover:bg-sky-800" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

export default function CandidateJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [job, setJob] = useState<JobPostingOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch<JobPostingOut>(`/job-postings/${id}`)
      .then((data) => {
        if (!cancelled) setJob(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load job details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleApplySubmit = async (coverLetter: string) => {
    setSubmitting(true);
    try {
      const candidate = await apiFetch<CandidateOut>("/candidates/me");
      await apiFetch<ApplicationOut>("/applications", {
        method: "POST",
        body: JSON.stringify({
          candidate_id: candidate.candidate_id,
          job_id: Number(id),
          cover_letter: coverLetter,
        } satisfies ApplicationCreate),
      });
      setApplied(true);
      setApplyOpen(false);
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <p className="text-lg text-muted-foreground">{error ?? "Job not found"}</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const postedDate = new Date(job.created_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="justify-left flex w-full rounded-[0.5rem] bg-muted px-10 py-5 align-center font-semibold text-black text-lg">
        Job Details
      </div>

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-6 rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex gap-4">
                {/* Job Icon */}
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted">
                  <Briefcase className="size-10 text-muted-foreground" />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h1 className="font-semibold text-2xl">{job.title}</h1>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-sm">
                        {job.work_mode ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                      {job.location && (
                        <div className="inline-flex items-center gap-1.5">
                          <MapPin className="size-4" />
                          {job.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 lg:justify-start">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setApplyOpen(true)}
                  disabled={applied}
                  className="h-10 w-52 gap-2 bg-sky-700 px-6 py-3 text-base disabled:opacity-70"
                >
                  {applied ? "Applied" : "Apply Now"}
                  {!applied && <ArrowRight className="size-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Left: Description */}
            <div className="space-y-6">
              {job.company_info && (
                <div>
                  <h3 className="mb-3 font-semibold text-base">Job Description</h3>
                  <p className="text-muted-foreground text-sm leading-7">{job.company_info}</p>
                </div>
              )}

              {job.required_skills.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-base">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill) => (
                      <span
                        key={skill.skill_id}
                        className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700 text-sm"
                      >
                        {skill.skill_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Job Overview */}
            <div className="rounded-3xl border border-border bg-background p-6">
              <h3 className="mb-4 font-semibold text-base">Job Overview</h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 py-4">
                  <CalendarDays color="#0A65CC" className="size-6" />
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Job Posted:</div>
                  <div className="font-medium text-sm">{postedDate}</div>
                </div>
                {job.required_education && (
                  <div className="flex flex-col gap-1 py-4">
                    <GraduationCap color="#0A65CC" className="size-6" />
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Education:</div>
                    <div className="font-medium text-sm">{job.required_education}</div>
                  </div>
                )}
                {job.salary_range && (
                  <div className="flex flex-col gap-1 py-4">
                    <DollarSign color="#0A65CC" className="size-6" />
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Salary:</div>
                    <div className="font-medium text-sm">{job.salary_range}</div>
                  </div>
                )}
                {job.location && (
                  <div className="flex flex-col gap-1 py-4">
                    <MapPin color="#0A65CC" className="size-6" />
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Location:</div>
                    <div className="font-medium text-sm">{job.location}</div>
                  </div>
                )}
                {job.work_mode && (
                  <div className="flex flex-col gap-1 py-4">
                    <FileText color="#0A65CC" className="size-6" />
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Work Mode:</div>
                    <div className="font-medium text-sm capitalize">{job.work_mode}</div>
                  </div>
                )}
                {job.required_experience != null && (
                  <div className="flex flex-col gap-1 py-4">
                    <BriefcaseBusiness color="#0A65CC" className="size-6" />
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Experience:</div>
                    <div className="font-medium text-sm">{job.required_experience} years</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Apply Now dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Write a cover letter to introduce yourself. Explain why you are a great fit for this role.
            </DialogDescription>
          </DialogHeader>

          <CoverLetterEditor
            onSubmit={handleApplySubmit}
            onCancel={() => setApplyOpen(false)}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
