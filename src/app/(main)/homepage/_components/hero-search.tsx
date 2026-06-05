"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

const POPULAR_TAGS = ["Designer", "Developer", "Web", "iOS", "PHP", "Senior", "Engineer"];

export function HeroSearch() {
  const [keyword, setKeyword] = useState("");
  const { role } = useAuth();
  const router = useRouter();

  const jobsRoute = (kw?: string) => {
    const base = role === "employer" ? "/employer/jobs" : role === "candidate" ? "/candidate/jobs" : "/auth/login";
    if (kw && base !== "/auth/login") return `${base}?keyword=${encodeURIComponent(kw)}`;
    return base;
  };

  const handleFindJob = () => router.push(jobsRoute(keyword.trim() || undefined));

  return (
    <div className="w-full max-w-[600px]">
      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search size={20} className="shrink-0 text-[#0A65CC]" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleFindJob(); }}
            placeholder="Job title, Keyword..."
            className="w-full bg-transparent text-[#18191C] text-sm outline-none placeholder:text-[#9199A3]"
          />
        </div>
        <button
          type="button"
          onClick={handleFindJob}
          className="shrink-0 rounded-lg bg-[#0A65CC] px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-[#0855b0]"
        >
          Find Job
        </button>
      </div>

      {/* Popular tags */}
      <p className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[#767F8C] text-sm">
        <span className="font-medium text-[#18191C]">Popular:</span>
        {POPULAR_TAGS.map((tag, i) => (
          <span key={tag} className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => router.push(jobsRoute(tag))}
              className="transition-colors hover:text-[#0A65CC] hover:underline hover:underline-offset-2"
            >
              {tag}
            </button>
            {i < POPULAR_TAGS.length - 1 && <span className="text-[#E4E5E8]">,</span>}
          </span>
        ))}
      </p>
    </div>
  );
}
