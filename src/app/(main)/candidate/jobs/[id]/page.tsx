"use client";

import { useMemo, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import {
  ArrowRight,
  Bold,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  DollarSign,
  FileText,
  GraduationCap,
  Italic,
  Link2,
  List,
  Mail,
  MapPin,
  Phone,
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

const jobDetails = {
  title: "Senior UX Designer",
  company: "Instagram",
  companyLink: "https://instagram.com",
  companyLogoUrl: "https://cdn.simpleicons.org/instagram/E4405F",
  phone: "(406) 555-0120",
  email: "career@instagram.com",
  description:
    "Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus tellus. Duis et est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo sit amet arcu commodo sollicitudin. Integer finibus blandit condimentum.",
  responsibilities: [
    "Quisque semper gravida est et consectetur.",
    "Curabitur blandit lorem velit, vitae pretium leo placerat eget.",
    "Morbi mattis in ipsum ac tempus.",
    "Curabitur eu vehicula libero. Vestibulum sed purus ullamcorper, lobortis lectus nec.",
    "vulputate turpis. Quisque ante odio, iaculis a porttitor sit amet.",
    "lobortis vel lectus. Nulla at risus ut diam.",
    "commodo feugiat. Nullam laoreet, diam placerat dapibus tincidunt.",
    "odio metus posuere lorem, id condimentum erat velit nec neque.",
    "dui sodales ut. Curabitur tempus augue.",
  ],
  posted: "14 June, 2021",
  expires: "14 July, 2021",
  expiryDate: "June 30, 2021",
  education: "Graduation",
  salary: "$50k-80k/month",
  location: "New York, USA",
  jobType: "Full Time",
  experience: "10-15 Years",
};

const EDITOR_MENU = [
  { label: "Bold",          Icon: Bold,          command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBold().run(),       active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bold") },
  { label: "Italic",        Icon: Italic,        command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleItalic().run(),     active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("italic") },
  { label: "Underline",     Icon: Underline,     command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleUnderline().run(),  active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("underline") },
  { label: "Strikethrough", Icon: Strikethrough, command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleStrike().run(),     active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("strike") },
  { label: "Bullet list",   Icon: List,          command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBulletList().run(), active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bulletList") },
];

function CoverLetterEditor({ onSubmit, onCancel }: { onSubmit: (text: string) => void; onCancel: () => void }) {
  const editor = useEditor({
    extensions: [StarterKit, UnderlineExt],
    content: "<p></p>",
    immediatelyRender: false,
  });
  const mounted = useMemo(() => Boolean(editor), [editor]);

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
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="flex-1 bg-sky-700 font-semibold hover:bg-sky-800">
          Submit Application
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </DialogFooter>
    </>
  );
}

export default function CandidateJobDetailPage({ params: _params }: { params: { id: string } }) {
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const handleApplySubmit = (_coverLetter: string) => {
    setApplied(true);
    setApplyOpen(false);
    toast.success("Application submitted successfully!");
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
    toast.success(saved ? "Job removed from saved." : "Job saved!");
  };

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
                {/* Company Logo */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                  <img src={jobDetails.companyLogoUrl} alt={jobDetails.company} className="h-full w-full object-cover" />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h1 className="font-semibold text-2xl">{jobDetails.title}</h1>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-sm">
                        {jobDetails.jobType}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                      <a
                        href={jobDetails.companyLink}
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <Link2 className="size-4" />
                        {jobDetails.companyLink}
                      </a>
                      <div className="inline-flex items-center gap-1.5">
                        <Phone className="size-4" />
                        {jobDetails.phone}
                      </div>
                      <div className="inline-flex items-center gap-1.5">
                        <Mail className="size-4" />
                        {jobDetails.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 lg:justify-start">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-slate-500 transition hover:border-sky-500 hover:text-sky-600"
                  aria-label={saved ? "Unsave job" : "Save job"}
                >
                  {saved ? <BookmarkCheck className="size-5 text-sky-600" /> : <Bookmark className="size-5" />}
                </button>
                <Button
                  onClick={() => setApplyOpen(true)}
                  disabled={applied}
                  className="h-10 w-52 gap-2 bg-sky-700 px-6 py-3 text-base disabled:opacity-70"
                >
                  {applied ? "Applied" : "Apply Now"}
                  {!applied && <ArrowRight className="size-4" />}
                </Button>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-sm">
                  Job expire in:{" "}
                  <span className="font-semibold text-red-500">{jobDetails.expiryDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Left: Description */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold text-base">Job Description</h3>
                <p className="text-muted-foreground text-sm leading-7">{jobDetails.description}</p>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-base">Responsibilities</h3>
                <ul className="space-y-2">
                  {jobDetails.responsibilities.map((responsibility) => (
                    <li key={responsibility} className="flex gap-3 text-muted-foreground text-sm">
                      <span className="mt-1.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-muted-foreground" />
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Job Overview */}
            <div className="rounded-3xl border border-border bg-background p-6">
              <h3 className="mb-4 font-semibold text-base">Job Overview</h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 py-4">
                  <CalendarDays color="#0A65CC" className="size-6" />
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Job Posted:</div>
                  <div className="font-medium text-sm">{jobDetails.posted}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <Clock3 color="#0A65CC" className="size-6" />
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Job Expires In:</div>
                  <div className="font-medium text-sm">{jobDetails.expires}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <GraduationCap color="#0A65CC" className="size-6" />
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Education:</div>
                  <div className="font-medium text-sm">{jobDetails.education}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <DollarSign color="#0A65CC" className="size-6" />
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Salary:</div>
                  <div className="font-medium text-sm">{jobDetails.salary}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <MapPin color="#0A65CC" className="size-6" />
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Location:</div>
                  <div className="font-medium text-sm">{jobDetails.location}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <FileText color="#0A65CC" className="size-6" />
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Job Type:</div>
                  <div className="font-medium text-sm">{jobDetails.jobType}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-1 py-4">
                <BriefcaseBusiness color="#0A65CC" className="size-6" />
                <div className="font-semibold text-muted-foreground text-xs uppercase">Experience:</div>
                <div className="font-medium text-sm">{jobDetails.experience}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Apply Now dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {jobDetails.title}</DialogTitle>
            <DialogDescription>
              Write a cover letter to introduce yourself to <strong>{jobDetails.company}</strong>. Explain why you are a great fit for this role.
            </DialogDescription>
          </DialogHeader>

          <CoverLetterEditor
            onSubmit={handleApplySubmit}
            onCancel={() => setApplyOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
