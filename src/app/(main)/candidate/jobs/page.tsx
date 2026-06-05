"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, Briefcase, Crown, Loader2, MapPin, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiFetch } from "@/lib/api/client";
import type { JobPostingOut, Page } from "@/lib/api/types";

const PAGE_SIZE = 10;

const sortOptions = ["Latest", "Oldest"];

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

const JobCard = ({ job }: { job: JobPostingOut }) => (
  <Link
    href={`/candidate/jobs/${job.job_id}`}
    className="block rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:border-sky-600 hover:shadow-md"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
        <Briefcase className="size-6 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-medium text-foreground text-lg">{job.title}</div>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <MapPin className="size-4" />
          {job.location ?? "Remote"}
        </div>
      </div>
    </div>

    <div className="mt-6">
      <h3 className="font-semibold text-foreground text-xl tracking-tight">{job.title}</h3>
      <div className="mt-2 flex items-center gap-2 font-medium text-slate-500 text-sm">
        <span>{job.work_mode ?? "N/A"}</span>
        <span>•</span>
        <span>{job.salary_range ?? "Not specified"}</span>
      </div>
    </div>
  </Link>
);

export default function CandidateJobsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [sort, setSort] = useState("Latest");
  const [page, setPage] = useState(1);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const [jobs, setJobs] = useState<JobPostingOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const offset = (page - 1) * PAGE_SIZE;
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(offset),
    });
    if (submittedSearch.trim()) {
      params.set("keyword", submittedSearch.trim());
    }

    apiFetch<Page<JobPostingOut>>(`/job-postings?${params.toString()}`)
      .then((data) => {
        if (cancelled) return;
        setJobs(data.items);
        setTotalJobs(data.total);
        setPageCount(Math.max(1, Math.ceil(data.total / data.limit)));
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Failed to load jobs");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, submittedSearch]);

  const handleSearch = () => {
    setPage(1);
    setSubmittedSearch(search);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage > 1) {
      setPaywallOpen(true);
      return;
    }
    setPage(nextPage);
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sort === "Oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const visiblePages = getVisiblePages(page, pageCount);

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
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                />
              </div>
              <Button
                className="bg-[#0066cc] px-8 py-6 font-medium text-base hover:bg-[#0052a3]"
                onClick={handleSearch}
              >
                Find Job
              </Button>
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
            {totalJobs} jobs found
          </div>

          <div className="flex items-center gap-3">
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
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {sortedJobs.map((job) => (
              <JobCard key={job.job_id} job={job} />
            ))}
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            className="size-10 rounded-full text-blue-400 hover:bg-blue-50 hover:text-blue-600"
            disabled={page <= 1}
            onClick={() => handlePageChange(Math.max(1, page - 1))}
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
                  onClick={() => handlePageChange(pageNum)}
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
            onClick={() => handlePageChange(Math.min(pageCount, page + 1))}
          >
            <ArrowRight className="size-6" />
          </Button>
        </div>
        <div className="text-muted-foreground text-sm">
          Page {page} of {pageCount}
        </div>
      </main>

      {/* Membership paywall dialog */}
      <Dialog open={paywallOpen} onOpenChange={setPaywallOpen}>
        <DialogContent className="max-w-sm rounded-[2rem] text-center">
          <DialogHeader className="items-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Crown className="size-7 text-[#0A65CC]" />
            </div>
            <DialogTitle className="text-xl text-slate-950">Membership Required</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-2 rounded-3xl bg-blue-50 p-4 text-sm leading-6 text-slate-700">
                Free accounts are limited to the first{" "}
                <span className="font-semibold text-[#0A65CC]">10 job listings</span>.
                Upgrade to unlock unlimited job browsing, advanced filters, and priority discovery.
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
            <Button
              className="w-full rounded-full bg-[#0A65CC] font-semibold text-white hover:bg-[#0855b0]"
              onClick={() => { setPaywallOpen(false); router.push("/membership"); }}
            >
              <Crown className="mr-2 size-4" />
              Choose Membership
            </Button>
            <Button variant="ghost" className="w-full rounded-full text-slate-600 hover:text-slate-900" onClick={() => setPaywallOpen(false)}>
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
