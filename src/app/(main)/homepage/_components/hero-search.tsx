import Link from "next/link";

export function HeroSearch() {
  return (
    <div className="w-full max-w-[600px]">
      <div className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
        <div className="flex flex-1 items-center gap-2 px-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A65CC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            readOnly
            placeholder="Job title, Keyword..."
            className="w-full cursor-pointer bg-transparent text-[#18191C] text-sm outline-none placeholder:text-[#9199A3]"
          />
        </div>
        <Link
          href="/auth/login"
          className="shrink-0 rounded-lg bg-[#0A65CC] px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-[#0855b0]"
        >
          Find Job
        </Link>
      </div>

      <p className="mt-5 text-[#767F8C] text-sm">
        <span className="font-medium text-[#18191C]">Popular:</span> Designer, Developer, Web, IOS, PHP, Senior,
        Engineer
      </p>
    </div>
  );
}
