"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sortOptions = ["Latest", "Oldest"];
const perPageOptions = ["6 per page", "12 per page", "24 per page"];

const jobPostings = [
  {
    id: 1,
    company: "Reddit",
    logo: "https://cdn.simpleicons.org/reddit/FF4500",
    location: "United Kingdom of Great Britain",
    position: "Marketing Officer",
    jobType: "Full time",
    salary: "$30K-$35K",
  },
  {
    id: 2,
    company: "Figma",
    logo: "https://cdn.simpleicons.org/figma/000000",
    location: "Canada",
    position: "UI/UX Designer",
    jobType: "Full time",
    salary: "$50K-$70K",
  },
  {
    id: 3,
    company: "Microsoft",
    logo: "https://cdn.simpleicons.org/microsoft/5F6BED",
    location: "Australia",
    position: "Product Designer",
    jobType: "Full time",
    salary: "$40K-$50K",
  },
  {
    id: 4,
    company: "Instagram",
    logo: "https://cdn.simpleicons.org/instagram/E4405F",
    location: "Australia",
    position: "Front End Developer",
    jobType: "Contract based",
    salary: "$50K-$80K",
  },
  {
    id: 5,
    company: "Dribbble",
    logo: "https://cdn.simpleicons.org/dribbble/EA4C89",
    location: "California",
    position: "Senior UX Designer",
    jobType: "Full time",
    salary: "$50K-$80K",
  },
  {
    id: 6,
    company: "Upwork",
    logo: "https://cdn.simpleicons.org/upwork/6FDA44",
    location: "France",
    position: "Technical Support Specialist",
    jobType: "Full time",
    salary: "$35K-$40K",
  },
  {
    id: 7,
    company: "Freepik",
    logo: "https://cdn.simpleicons.org/freepik/00B5E2",
    location: "China",
    position: "Visual Designer",
    jobType: "Full time",
    salary: "$10K-$15K",
  },
  {
    id: 8,
    company: "Twitter",
    logo: "https://cdn.simpleicons.org/x/000000",
    location: "Canada",
    position: "Senior UX Designer",
    jobType: "Internship",
    salary: "$50K-$60K",
  },
  {
    id: 9,
    company: "Slack",
    logo: "https://cdn.simpleicons.org/slack/611F69",
    location: "Germany",
    position: "Networking Engineer",
    jobType: "Remote",
    salary: "$50K-$90K",
  },
  {
    id: 10,
    company: "Facebook",
    logo: "https://cdn.simpleicons.org/facebook/1877F2",
    location: "United Kingdom of Great Britain",
    position: "Software Engineer",
    jobType: "Part time",
    salary: "$15K-$20K",
  },
  {
    id: 11,
    company: "Youtube",
    logo: "https://cdn.simpleicons.org/youtube/FF0000",
    location: "Germany",
    position: "Interaction Designer",
    jobType: "Full time",
    salary: "$20K-$25K",
  },
  {
    id: 12,
    company: "Spotify",
    logo: "https://cdn.simpleicons.org/spotify/1DB954",
    location: "Sweden",
    position: "Product Manager",
    jobType: "Remote",
    salary: "$60K-$90K",
  },
  {
    id: 13,
    company: "LinkedIn",
    logo: "https://cdn.simpleicons.org/linkedin/0A66C2",
    location: "United States",
    position: "Data Analyst",
    jobType: "Full time",
    salary: "$55K-$75K",
  },
  {
    id: 14,
    company: "Adobe",
    logo: "https://cdn.simpleicons.org/adobe/FF0000",
    location: "California",
    position: "Creative Director",
    jobType: "Full time",
    salary: "$80K-$100K",
  },
  {
    id: 15,
    company: "Airbnb",
    logo: "https://cdn.simpleicons.org/airbnb/FF5A5F",
    location: "San Francisco",
    position: "Backend Engineer",
    jobType: "Full time",
    salary: "$90K-$120K",
  },
  {
    id: 16,
    company: "Netflix",
    logo: "https://cdn.simpleicons.org/netflix/E50914",
    location: "Los Angeles",
    position: "iOS Developer",
    jobType: "Full time",
    salary: "$100K-$130K",
  },
  {
    id: 17,
    company: "Stripe",
    logo: "https://cdn.simpleicons.org/stripe/635BFF",
    location: "Remote",
    position: "Backend Engineer",
    jobType: "Remote",
    salary: "$100K-$140K",
  },
  {
    id: 18,
    company: "Vercel",
    logo: "https://cdn.simpleicons.org/vercel/000000",
    location: "Remote",
    position: "Frontend Engineer",
    jobType: "Remote",
    salary: "$80K-$110K",
  },
  {
    id: 19,
    company: "Notion",
    logo: "https://cdn.simpleicons.org/notion/000000",
    location: "New York",
    position: "Product Manager",
    jobType: "Full time",
    salary: "$85K-$110K",
  },
  {
    id: 20,
    company: "Dropbox",
    logo: "https://cdn.simpleicons.org/dropbox/0061FF",
    location: "San Francisco",
    position: "DevOps Engineer",
    jobType: "Full time",
    salary: "$95K-$125K",
  },
  {
    id: 21,
    company: "Shopify",
    logo: "https://cdn.simpleicons.org/shopify/96BF48",
    location: "Canada",
    position: "Full Stack Developer",
    jobType: "Remote",
    salary: "$85K-$115K",
  },
  {
    id: 22,
    company: "Twitch",
    logo: "https://cdn.simpleicons.org/twitch/9146FF",
    location: "San Francisco",
    position: "Mobile Developer",
    jobType: "Full time",
    salary: "$80K-$100K",
  },
  {
    id: 23,
    company: "Discord",
    logo: "https://cdn.simpleicons.org/discord/5865F2",
    location: "Remote",
    position: "Software Engineer",
    jobType: "Remote",
    salary: "$90K-$120K",
  },
  {
    id: 24,
    company: "Zoom",
    logo: "https://cdn.simpleicons.org/zoom/0B5CFF",
    location: "San Jose",
    position: "QA Engineer",
    jobType: "Full time",
    salary: "$70K-$90K",
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

const JobCard = ({
  job,
  saved,
  onToggleSave,
}: {
  job: (typeof jobPostings)[number];
  saved: boolean;
  onToggleSave: () => void;
}) => (
  <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:border-sky-600 hover:shadow-md">
    <div className="flex items-start justify-between gap-2">
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
      <button
        type="button"
        onClick={onToggleSave}
        className="mt-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-sky-600"
        aria-label={saved ? "Unsave job" : "Save job"}
      >
        {saved ? <BookmarkCheck className="size-5 text-sky-600" /> : <Bookmark className="size-5" />}
      </button>
    </div>

    <div className="mt-6">
      <h3 className="font-semibold text-foreground text-xl tracking-tight">{job.position}</h3>
      <div className="mt-2 flex items-center gap-2 font-medium text-slate-500 text-sm">
        <span>{job.jobType}</span>
        <span>•</span>
        <span>{job.salary}</span>
      </div>
    </div>

    <div className="mt-5">
      <Link href={`/candidate/jobs/${job.id}`}>
        <Button className="w-full bg-[#0066cc] hover:bg-[#0052a3]">
          View Details
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </Link>
    </div>
  </div>
);

export default function CandidateJobsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Latest");
  const [perPage, setPerPage] = useState("12 per page");
  const [page, setPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());

  const toggleSave = (id: number) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobPostings.filter((job) => {
      if (!query) return true;
      return [job.company, job.position, job.location, job.jobType].join(" ").toLowerCase().includes(query);
    });
  }, [search]);

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (sort === "Oldest") return a.company.localeCompare(b.company);
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
          <h1 className="font-semibold text-black text-lg">Browse Jobs</h1>

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
          <div className="text-muted-foreground text-sm">
            {filteredJobs.length} jobs found
            {savedJobs.size > 0 && (
              <span className="ml-3 inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-sky-600">
                <BookmarkCheck className="size-3.5" />
                {savedJobs.size} saved
              </span>
            )}
          </div>

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
          {currentJobs.map((job) => (
            <JobCard key={job.id} job={job} saved={savedJobs.has(job.id)} onToggleSave={() => toggleSave(job.id)} />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            className="size-10 rounded-full text-blue-400 hover:bg-blue-50 hover:text-blue-600"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ArrowLeft className="size-6" />
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
                    isCurrent ? "bg-[#0061C2] text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
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
