"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Crown,
  Filter,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiFetch } from "@/lib/api/client";
import type { JobPostingOut, MembershipOut, Page } from "@/lib/api/types";

const PAGE_SIZE = 10;

const sortOptions = ["Latest", "Oldest"];

const WORK_MODE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Remote", value: "remote" },
  { label: "On-site", value: "onsite" },
  { label: "Hybrid", value: "hybrid" },
];

const SALARY_OPTIONS = [
  { label: "Any", value: "" },
  { label: "$50 – $1,000", value: "$50 - $1000" },
  { label: "$1,000 – $2,500", value: "$1000 - $2500" },
  { label: "$2,500 – $4,000", value: "$2500 - $4000" },
  { label: "$4,000 – $6,000", value: "$4000 - $6000" },
  { label: "$6,000 – $8,000", value: "$6000 - $8000" },
  { label: "$8,000 – $10,000", value: "$8000 - $10000" },
  { label: "$10,000 – $15,000", value: "$10000 - $15000" },
  { label: "$15,000+", value: "$15000+" },
];

interface AppliedFilters {
  workMode: string;
  location: string;
  salaryRange: string;
}

const DEFAULT_FILTERS: AppliedFilters = { workMode: "", location: "", salaryRange: "" };

function countActiveFilters(f: AppliedFilters) {
  return [f.workMode, f.location, f.salaryRange].filter(Boolean).length;
}

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
      <div className="mt-2 flex items-center gap-2 text-sm">
        {job.work_mode && (
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700 capitalize">
            {job.work_mode}
          </span>
        )}
        {job.salary_range && (
          <span className="font-medium text-slate-600">
            {job.salary_range}/month
          </span>
        )}
        {!job.salary_range && (
          <span className="text-slate-400">Salary not specified</span>
        )}
      </div>
    </div>
  </Link>
);

export default function CandidateJobsPage() {
  const router = useRouter();

  // Search
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  // Filters (draft = panel state; applied = triggers fetch)
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState<AppliedFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(DEFAULT_FILTERS);

  // Sort + pagination
  const [sort, setSort] = useState("Latest");
  const [page, setPage] = useState(1);
  const [paywallOpen, setPaywallOpen] = useState(false);

  // Membership
  const [isMember, setIsMember] = useState(false);

  // Data
  const [jobs, setJobs] = useState<JobPostingOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    apiFetch<MembershipOut>("/memberships/me")
      .then((data) => setIsMember(data.is_active))
      .catch(() => setIsMember(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String((page - 1) * PAGE_SIZE),
    });
    if (submittedSearch.trim()) params.set("keyword", submittedSearch.trim());
    if (appliedFilters.workMode) params.set("work_mode", appliedFilters.workMode);
    if (appliedFilters.location.trim()) params.set("location", appliedFilters.location.trim());
    if (appliedFilters.salaryRange) params.set("salary_range", appliedFilters.salaryRange);

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

    return () => { cancelled = true; };
  }, [page, submittedSearch, appliedFilters]);

  const handleSearch = () => {
    setPage(1);
    setSubmittedSearch(search);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters({ ...draftFilters });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const handleOpenFilters = () => {
    setDraftFilters({ ...appliedFilters });
    setShowFilters(true);
  };

  const handlePageChange = (nextPage: number) => {
    if (!isMember && nextPage > 1) {
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
  const activeFilterCount = countActiveFilters(appliedFilters);

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* ── Search + Filter bar ──────────────────────────────────────────────── */}
      <div className="w-full bg-muted px-10 py-5">
        <h1 className="mb-5 font-semibold text-black text-lg">Browse Jobs</h1>

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
            className="relative gap-2 border-sky-600 bg-[#f1f2f4] px-8 font-semibold text-[#0066cc] text-base hover:bg-slate-100"
            onClick={handleOpenFilters}
          >
            <SlidersHorizontal className="size-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0A65CC] text-white text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {appliedFilters.workMode && (
              <FilterChip
                label={WORK_MODE_OPTIONS.find((o) => o.value === appliedFilters.workMode)?.label ?? appliedFilters.workMode}
                onRemove={() => { setAppliedFilters((f) => ({ ...f, workMode: "" })); setPage(1); }}
              />
            )}
            {appliedFilters.location && (
              <FilterChip
                label={`Location: ${appliedFilters.location}`}
                onRemove={() => { setAppliedFilters((f) => ({ ...f, location: "" })); setPage(1); }}
              />
            )}
            {appliedFilters.salaryRange && (
              <FilterChip
                label={SALARY_OPTIONS.find((o) => o.value === appliedFilters.salaryRange)?.label ?? appliedFilters.salaryRange}
                onRemove={() => { setAppliedFilters((f) => ({ ...f, salaryRange: "" })); setPage(1); }}
              />
            )}
            <button
              type="button"
              onClick={() => { setAppliedFilters(DEFAULT_FILTERS); setPage(1); }}
              className="text-slate-400 text-xs underline underline-offset-2 hover:text-slate-600"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Filter modal ──────────────────────────────────────────────────────── */}
      {showFilters && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E4E5E8] px-8 py-5">
              <h2 className="font-semibold text-[#18191C] text-lg">Advanced Filters</h2>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#767F8C] transition-colors hover:bg-[#F1F2F4] hover:text-[#18191C]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter columns */}
            <div className="grid grid-cols-3 divide-x divide-[#E4E5E8] px-4 py-8">
              {/* Work Mode */}
              <div className="flex flex-col gap-3 px-5">
                <h4 className="mb-1 font-semibold text-[#18191C] text-sm">Work Mode</h4>
                {WORK_MODE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="workMode"
                      checked={draftFilters.workMode === opt.value}
                      onChange={() => setDraftFilters((f) => ({ ...f, workMode: opt.value }))}
                      className="h-4 w-4 accent-[#0A65CC]"
                    />
                    <span className={`text-sm ${draftFilters.workMode === opt.value ? "font-medium text-[#0A65CC]" : "text-[#767F8C]"}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Location */}
              <div className="flex flex-col gap-3 px-5">
                <h4 className="mb-1 font-semibold text-[#18191C] text-sm">Location</h4>
                <input
                  type="text"
                  value={draftFilters.location}
                  onChange={(e) => setDraftFilters((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Jakarta, Remote..."
                  className="rounded-lg border border-[#E4E5E8] px-3 py-2 text-sm text-[#18191C] outline-none placeholder:text-[#9199A3] focus:border-[#0A65CC]"
                />
              </div>

              {/* Salary Range */}
              <div className="flex flex-col gap-3 px-5">
                <h4 className="mb-1 font-semibold text-[#18191C] text-sm">Salary Range</h4>
                {SALARY_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="salaryRange"
                      checked={draftFilters.salaryRange === opt.value}
                      onChange={() => setDraftFilters((f) => ({ ...f, salaryRange: opt.value }))}
                      className="h-4 w-4 accent-[#0A65CC]"
                    />
                    <span className={`text-sm ${draftFilters.salaryRange === opt.value ? "font-medium text-[#0A65CC]" : "text-[#767F8C]"}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#E4E5E8] px-8 py-5">
              <button
                type="button"
                onClick={handleClearFilters}
                className="rounded-lg border border-[#E4E5E8] px-5 py-2.5 font-medium text-[#767F8C] text-sm transition-colors hover:border-[#18191C] hover:text-[#18191C]"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="rounded-lg bg-[#0A65CC] px-6 py-2.5 font-semibold text-sm text-white transition-colors hover:bg-[#0855b0]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Job list ──────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground text-sm">{totalJobs} jobs found</div>
          <div className="flex items-center gap-3">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-12 w-[180px] border-slate-200 bg-white py-5 text-slate-600">
                <SelectValue placeholder="Latest" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Briefcase className="mb-4 size-12 opacity-30" />
            <p className="text-base">No jobs found matching your criteria.</p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                className="mt-3 text-sm text-[#0A65CC] underline underline-offset-2"
                onClick={() => { setAppliedFilters(DEFAULT_FILTERS); setPage(1); }}
              >
                Clear filters
              </button>
            )}
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
        <div className="mt-2 text-center text-muted-foreground text-sm">
          Page {page} of {pageCount}
        </div>
      </main>

      {/* ── Paywall dialog ────────────────────────────────────────────────────── */}
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

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[#0A65CC] text-xs font-medium">
      {label}
      <button type="button" onClick={onRemove} className="hover:opacity-70">
        <X className="size-3" />
      </button>
    </span>
  );
}
