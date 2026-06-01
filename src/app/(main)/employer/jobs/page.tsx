"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowLeft, ArrowRight, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const _jobTypeOptions = ["Full time", "Part time", "Internship", "Remote", "Temporary", "Contract based"];

const sortOptions = ["Latest", "Oldest"];
const perPageOptions = ["6 per page", "12 per page", "24 per page"];

const jobPostings = [
  {
    company: "Reddit",
    logo: "https://cdn.simpleicons.org/reddit/FF4500",
    location: "United Kingdom of Great Britain",
    position: "Marketing Officer",
    jobType: "Full time",
    salary: "$30K-$35K",
  },
  {
    company: "Figma",
    logo: "https://cdn.simpleicons.org/figma/000000",
    location: "Canada",
    position: "UI/UX Designer",
    jobType: "Full time",
    salary: "$50K-$70K",
  },
  {
    company: "Microsoft",
    logo: "https://cdn.simpleicons.org/microsoft/5F6BED",
    location: "Australia",
    position: "Product Designer",
    jobType: "Full time",
    salary: "$40K-$50K",
  },
  {
    company: "Instagram",
    logo: "https://cdn.simpleicons.org/instagram/E4405F",
    location: "Australia",
    position: "Front End Developer",
    jobType: "Contract based",
    salary: "$50K-$80K",
  },
  {
    company: "Dribbble",
    logo: "https://cdn.simpleicons.org/dribbble/EA4C89",
    location: "California",
    position: "Senior UX Designer",
    jobType: "Full time",
    salary: "$50K-$80K",
  },
  {
    company: "Upwork",
    logo: "https://cdn.simpleicons.org/upwork/6FDA44",
    location: "France",
    position: "Technical Support Specialist",
    jobType: "Full time",
    salary: "$35K-$40K",
  },
  {
    company: "Freepik",
    logo: "https://cdn.simpleicons.org/freepik/00B5E2",
    location: "China",
    position: "Visual Designer",
    jobType: "Full time",
    salary: "$10K-$15K",
  },
  {
    company: "Twitter",
    logo: "https://cdn.simpleicons.org/x/000000",
    location: "Canada",
    position: "Senior UX Designer",
    jobType: "Internship",
    salary: "$50K-$60K",
  },
  {
    company: "Slack",
    logo: "https://cdn.simpleicons.org/slack/611F69",
    location: "Germany",
    position: "Networking Engineer",
    jobType: "Remote",
    salary: "$50K-$90K",
  },
  {
    company: "Facebook",
    logo: "https://cdn.simpleicons.org/facebook/1877F2",
    location: "United Kingdom of Great Britain",
    position: "Software Engineer",
    jobType: "Part time",
    salary: "$15K-$20K",
  },
  {
    company: "Youtube",
    logo: "https://cdn.simpleicons.org/youtube/FF0000",
    location: "Germany",
    position: "Interaction Designer",
    jobType: "Full time",
    salary: "$20K-$25K",
  },
  {
    company: "Spotify",
    logo: "https://cdn.simpleicons.org/spotify/1DB954",
    location: "Sweden",
    position: "Product Manager",
    jobType: "Remote",
    salary: "$60K-$90K",
  },
  {
    company: "Reddit2",
    logo: "https://cdn.simpleicons.org/reddit/FF4500",
    location: "United Kingdom of Great Britain",
    position: "Marketing Officer",
    jobType: "Full time",
    salary: "$30K-$35K",
  },
  {
    company: "Figma2",
    logo: "https://cdn.simpleicons.org/figma/000000",
    location: "Canada",
    position: "UI/UX Designer",
    jobType: "Full time",
    salary: "$50K-$70K",
  },
  {
    company: "Microsoft2",
    logo: "https://cdn.simpleicons.org/microsoft/5F6BED",
    location: "Australia",
    position: "Product Designer",
    jobType: "Full time",
    salary: "$40K-$50K",
  },
  {
    company: "Instagram2",
    logo: "https://cdn.simpleicons.org/instagram/E4405F",
    location: "Australia",
    position: "Front End Developer",
    jobType: "Contract based",
    salary: "$50K-$80K",
  },
  {
    company: "Dribbble2",
    logo: "https://cdn.simpleicons.org/dribbble/EA4C89",
    location: "California",
    position: "Senior UX Designer",
    jobType: "Full time",
    salary: "$50K-$80K",
  },
  {
    company: "Upwork2",
    logo: "https://cdn.simpleicons.org/upwork/6FDA44",
    location: "France",
    position: "Technical Support Specialist",
    jobType: "Full time",
    salary: "$35K-$40K",
  },
  {
    company: "Freepik2",
    logo: "https://cdn.simpleicons.org/freepik/00B5E2",
    location: "China",
    position: "Visual Designer",
    jobType: "Full time",
    salary: "$10K-$15K",
  },
  {
    company: "Twitter2",
    logo: "https://cdn.simpleicons.org/x/000000",
    location: "Canada",
    position: "Senior UX Designer",
    jobType: "Internship",
    salary: "$50K-$60K",
  },
  {
    company: "Slack2",
    logo: "https://cdn.simpleicons.org/slack/611F69",
    location: "Germany",
    position: "Networking Engineer",
    jobType: "Remote",
    salary: "$50K-$90K",
  },
  {
    company: "Facebook2",
    logo: "https://cdn.simpleicons.org/facebook/1877F2",
    location: "United Kingdom of Great Britain",
    position: "Software Engineer",
    jobType: "Part time",
    salary: "$15K-$20K",
  },
  {
    company: "Youtube2",
    logo: "https://cdn.simpleicons.org/youtube/FF0000",
    location: "Germany",
    position: "Interaction Designer",
    jobType: "Full time",
    salary: "$20K-$25K",
  },
  {
    company: "Spotify2",
    logo: "https://cdn.simpleicons.org/spotify/1DB954",
    location: "Sweden",
    position: "Product Manager",
    jobType: "Remote",
    salary: "$60K-$90K",
  },
  {
    company: "Reddit3",
    logo: "https://cdn.simpleicons.org/reddit/FF4500",
    location: "United Kingdom of Great Britain",
    position: "Marketing Officer",
    jobType: "Full time",
    salary: "$30K-$35K",
  },
  {
    company: "Figma3",
    logo: "https://cdn.simpleicons.org/figma/000000",
    location: "Canada",
    position: "UI/UX Designer",
    jobType: "Full time",
    salary: "$50K-$70K",
  },
  {
    company: "Microsoft3",
    logo: "https://cdn.simpleicons.org/microsoft/5F6BED",
    location: "Australia",
    position: "Product Designer",
    jobType: "Full time",
    salary: "$40K-$50K",
  },
  {
    company: "Instagram3",
    logo: "https://cdn.simpleicons.org/instagram/E4405F",
    location: "Australia",
    position: "Front End Developer",
    jobType: "Contract based",
    salary: "$50K-$80K",
  },
  {
    company: "Dribbble3",
    logo: "https://cdn.simpleicons.org/dribbble/EA4C89",
    location: "California",
    position: "Senior UX Designer",
    jobType: "Full time",
    salary: "$50K-$80K",
  },
  {
    company: "Upwork3",
    logo: "https://cdn.simpleicons.org/upwork/6FDA44",
    location: "France",
    position: "Technical Support Specialist",
    jobType: "Full time",
    salary: "$35K-$40K",
  },
  {
    company: "Freepik3",
    logo: "https://cdn.simpleicons.org/freepik/00B5E2",
    location: "China",
    position: "Visual Designer",
    jobType: "Full time",
    salary: "$10K-$15K",
  },
  {
    company: "Twitter3",
    logo: "https://cdn.simpleicons.org/x/000000",
    location: "Canada",
    position: "Senior UX Designer",
    jobType: "Internship",
    salary: "$50K-$60K",
  },
  {
    company: "Slack3",
    logo: "https://cdn.simpleicons.org/slack/611F69",
    location: "Germany",
    position: "Networking Engineer",
    jobType: "Remote",
    salary: "$50K-$90K",
  },
  {
    company: "Facebook3",
    logo: "https://cdn.simpleicons.org/facebook/1877F2",
    location: "United Kingdom of Great Britain",
    position: "Software Engineer",
    jobType: "Part time",
    salary: "$15K-$20K",
  },
  {
    company: "Youtube3",
    logo: "https://cdn.simpleicons.org/youtube/FF0000",
    location: "Germany",
    position: "Interaction Designer",
    jobType: "Full time",
    salary: "$20K-$25K",
  },
  {
    company: "Spotify3",
    logo: "https://cdn.simpleicons.org/spotify/1DB954",
    location: "Sweden",
    position: "Product Manager",
    jobType: "Remote",
    salary: "$60K-$90K",
  },
];

const getVisiblePages = (page: number, pageCount: number) => {
  const half = Math.floor(5 / 2);
  let start = Math.max(page - half, 1);
  let end = start + 5 - 1;

  if (end > pageCount) {
    end = pageCount;
    start = Math.max(end - 5 + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const JobCard = ({ job, index }: { job: (typeof jobPostings)[number]; index: number }) => (
  <Link
    href={`/employer/jobs/${index + 1}`}
    className="block rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:border-sky-600 hover:shadow-md"
  >
    <div className="flex items-center gap-4">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image fill src={job.logo} alt={job.company} className="object-cover" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-medium text-foreground text-lg">{job.company}</div>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <MapPin className="size-4" />
          {job.location}
        </div>
      </div>
    </div>
    <div className="mt-6">
      <h3 className="font-semibold text-foreground text-xl tracking-tight">{job.position}</h3>

      <div className="mt-2 flex items-center gap-2 font-medium text-slate-500 text-sm">
        <span>{job.jobType}</span>
        <span>•</span>
        <span>{job.salary}</span>
      </div>
    </div>
  </Link>
);

export default function EmployerJobPostManagementPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Latest");
  const [perPage, setPerPage] = useState("12 per page");
  const [page, setPage] = useState(1);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobPostings.filter((job) => {
      if (!query) return true;
      return [job.company, job.position, job.location, job.jobType].join(" ").toLowerCase().includes(query);
    });
  }, [search]);

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (sort === "Oldest") {
        return a.company.localeCompare(b.company);
      }
      return b.company.localeCompare(a.company);
    });
  }, [filteredJobs, sort]);

  const pageSize = Number(perPage.split(" ")[0]);
  const pageCount = Math.max(1, Math.ceil(sortedJobs.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const currentJobs = sortedJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="w-full bg-white">
        <div className="flex w-full flex-col gap-6 bg-muted px-10 py-5">
          <h1 className="font-semibold text-black text-lg">Job Posting Management</h1>

          <div className="flex items-center gap-4">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-100 bg-white p-2 shadow-sm">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-blue-500" />
                <Input
                  className="border-none bg-transparent pl-12 text-base placeholder:text-slate-400 focus-visible:ring-0"
                  placeholder="Job title, Keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button className="bg-[#0066cc] px-8 py-6 font-medium text-base hover:bg-[#0052a3]">Find Job</Button>
            </div>

            <Button
              variant="outline"
              className="gap-2 border-sky-600 bg-[#f1f2f4] px-12 font-semibold text-[#0066cc] text-base hover:bg-slate-100"
            >
              Filter
            </Button>
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/employer/job/post">
            <Button className="bg-[#0066cc] px-8 py-6 font-medium text-base hover:bg-[#0052a3]">Post A Job</Button>
          </Link>

          <div className="grid grid-cols-2 items-center gap-3">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-12 w-[180px] border-slate-200 bg-white py-5 text-slate-600">
                <SelectValue placeholder="Latest" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={perPage} onValueChange={setPerPage}>
              <SelectTrigger className="h-12 w-[180px] border-slate-200 bg-white py-5 text-slate-600">
                <SelectValue placeholder="12 per page" />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {currentJobs.map((job, i) => (
            <JobCard key={`${job.company}-${job.position}`} job={job} index={i} />
          ))}
        </div>

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
                      ? "bg-[#0061C2] text-white" // Target dark blue circle
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900" // Target gray hover
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
      </main>
    </div>
  );
}
