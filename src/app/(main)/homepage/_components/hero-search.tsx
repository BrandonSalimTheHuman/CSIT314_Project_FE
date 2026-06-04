"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

// ─── Filter data ──────────────────────────────────────────────────────────────

const EXPERIENCE_OPTIONS = [
  "Freshers",
  "1 - 2 Years",
  "2 - 4 Years",
  "4 - 6 Years",
  "6 - 8 Years",
  "8 - 10 Years",
  "10 - 15 Years",
  "15+ Years",
];

const SALARY_OPTIONS = [
  "$50 - $1000",
  "$1000 - $2000",
  "$3000 - $4000",
  "$4000 - $6000",
  "$6000 - $8000",
  "$8000 - $10000",
  "$10000 - $15000",
  "$15000+",
];

const JOB_TYPE_OPTIONS = ["All", "Full Time", "Part Time", "Internship", "Remote", "Temporary", "Contract Base"];

const EDUCATION_OPTIONS = ["All", "High School", "Intermediate", "Graduation", "Master Degree", "Bachelor Degree"];

const JOB_LEVEL_OPTIONS = ["Entry Level", "Mid Level", "Expert Level"];

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroSearch() {
  const [keyword, setKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Single-select filters
  const [experience, setExperience] = useState<string | null>(null);
  const [salary, setSalary] = useState<string | null>(null);
  const [jobLevel, setJobLevel] = useState<string | null>(null);

  // Multi-select filters
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [education, setEducation] = useState<string[]>([]);

  function toggleMulti(set: string[], value: string, setter: (v: string[]) => void) {
    if (value === "All") {
      setter(set.includes("All") ? [] : ["All"]);
    } else {
      const next = set.includes(value) ? set.filter((v) => v !== value) : [...set.filter((v) => v !== "All"), value];
      setter(next);
    }
  }

  return (
    <div className="w-full max-w-[600px]">
      {/* ── Main search bar ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search size={20} className="shrink-0 text-[#0A65CC]" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, Keyword..."
            className="w-full bg-transparent text-[#18191C] text-sm outline-none placeholder:text-[#9199A3]"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="shrink-0 rounded-lg bg-[#0A65CC] px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-[#0855b0]"
        >
          Find Job
        </button>
      </div>

      {/* ── Filter modal ───────────────────────────────────────────────────── */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowFilters(false)}
          />

          {/* Panel */}
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
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
            <div className="grid grid-cols-5 divide-x divide-[#E4E5E8] px-4 py-8">
              <FilterColumn title="Experience">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <RadioOption
                    key={opt}
                    label={opt}
                    name="experience"
                    checked={experience === opt}
                    onChange={() => setExperience((prev) => (prev === opt ? null : opt))}
                  />
                ))}
              </FilterColumn>

              <FilterColumn title="Salary">
                {SALARY_OPTIONS.map((opt) => (
                  <RadioOption
                    key={opt}
                    label={opt}
                    name="salary"
                    checked={salary === opt}
                    onChange={() => setSalary((prev) => (prev === opt ? null : opt))}
                  />
                ))}
              </FilterColumn>

              <FilterColumn title="Job Type">
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <CheckboxOption
                    key={opt}
                    label={opt}
                    checked={jobTypes.includes(opt)}
                    onChange={() => toggleMulti(jobTypes, opt, setJobTypes)}
                  />
                ))}
              </FilterColumn>

              <FilterColumn title="Education">
                {EDUCATION_OPTIONS.map((opt) => (
                  <CheckboxOption
                    key={opt}
                    label={opt}
                    checked={education.includes(opt)}
                    onChange={() => toggleMulti(education, opt, setEducation)}
                  />
                ))}
              </FilterColumn>

              <FilterColumn title="Job Level">
                {JOB_LEVEL_OPTIONS.map((opt) => (
                  <RadioOption
                    key={opt}
                    label={opt}
                    name="jobLevel"
                    checked={jobLevel === opt}
                    onChange={() => setJobLevel((prev) => (prev === opt ? null : opt))}
                  />
                ))}
              </FilterColumn>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#E4E5E8] px-8 py-5">
              <button
                type="button"
                onClick={() => {
                  setExperience(null);
                  setSalary(null);
                  setJobLevel(null);
                  setJobTypes([]);
                  setEducation([]);
                }}
                className="rounded-lg border border-[#E4E5E8] px-5 py-2.5 font-medium text-[#767F8C] text-sm transition-colors hover:border-[#18191C] hover:text-[#18191C]"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="rounded-lg bg-[#0A65CC] px-6 py-2.5 font-semibold text-sm text-white transition-colors hover:bg-[#0855b0]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* Popular tags */}
      <p className="mt-5 text-[#767F8C] text-sm">
        <span className="font-medium text-[#18191C]">Popular:</span> Designer, Developer, Web, IOS, PHP, Senior,
        Engineer
      </p>
    </div>
  );
}

// ─── Small sub-components ─────────────────────────────────────────────────────

function FilterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 px-5">
      <h4 className="mb-1 font-semibold text-[#18191C] text-sm">{title}</h4>
      {children}
    </div>
  );
}

function RadioOption({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#0A65CC]"
      />
      <span className={`text-sm ${checked ? "font-medium text-[#0A65CC]" : "text-[#767F8C]"}`}>{label}</span>
    </label>
  );
}

function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#0A65CC]"
      />
      <span className={`text-sm ${checked ? "font-medium text-[#0A65CC]" : "text-[#767F8C]"}`}>{label}</span>
    </label>
  );
}
