"use client";

import { useState } from "react";

import Image from "next/image";

import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  DollarSign,
  FileText,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

export default function CandidateJobDetailPage({ params: _params }: { params: { id: string } }) {
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
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
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                  <Image fill src={jobDetails.companyLogoUrl} alt={jobDetails.company} className="object-cover" />
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
                  onClick={handleApply}
                  disabled={applied}
                  className="h-10 w-52 gap-2 bg-sky-700 px-6 py-3 text-base disabled:opacity-70"
                >
                  {applied ? "Applied" : "Apply Now"}
                  {!applied && <ArrowRight className="size-4" />}
                </Button>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-sm">
                  Job expire in: <span className="font-semibold text-red-500">{jobDetails.expiryDate}</span>
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
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays color="#0A65CC" className="size-6" />
                  </div>
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Job Posted:</div>
                  <div className="font-medium text-sm">{jobDetails.posted}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock3 color="#0A65CC" className="size-6" />
                  </div>
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Job Expires In:</div>
                  <div className="font-medium text-sm">{jobDetails.expires}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap color="#0A65CC" className="size-6" />
                  </div>
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Education:</div>
                  <div className="font-medium text-sm">{jobDetails.education}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign color="#0A65CC" className="size-6" />
                  </div>
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Salary:</div>
                  <div className="font-medium text-sm">{jobDetails.salary}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin color="#0A65CC" className="size-6" />
                  </div>
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Location:</div>
                  <div className="font-medium text-sm">{jobDetails.location}</div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText color="#0A65CC" className="size-6" />
                  </div>
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Job Type:</div>
                  <div className="font-medium text-sm">{jobDetails.jobType}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-1 py-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BriefcaseBusiness color="#0A65CC" className="size-6" />
                </div>
                <div className="font-semibold text-muted-foreground text-xs uppercase">Experience:</div>
                <div className="font-medium text-sm">{jobDetails.experience}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
