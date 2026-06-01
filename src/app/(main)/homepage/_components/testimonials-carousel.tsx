"use client";

import { useState } from "react";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "John Wick",
    role: "Creative Director",
    quote:
      '"MyJob made my job search so much easier. Within two weeks I had three interviews lined up and landed a role that perfectly matched my experience and salary expectations."',
  },
  {
    name: "Jane Smith",
    role: "Marketing Manager",
    quote:
      '"The smart filters saved me hours of scrolling. I could narrow down listings by location, salary range, and job type in seconds. Highly recommend to anyone job hunting."',
  },
  {
    name: "Bob Johnson",
    role: "Product Manager",
    quote:
      '"As someone switching industries, MyJob helped me discover roles I wouldn\'t have found elsewhere. The platform is clean, fast, and the application process is incredibly simple."',
  },
  {
    name: "Emily Chen",
    role: "UX Designer",
    quote:
      '"I uploaded my portfolio and resume on a Monday, got a recruiter message by Wednesday, and accepted an offer the following week. The process was seamless from start to finish."',
  },
  {
    name: "Marcus Lee",
    role: "Software Engineer",
    quote:
      '"MyJob is the best job portal I\'ve used. The interface is intuitive, job alerts are spot-on, and I never had to chase applications — the dashboard tracked everything for me."',
  },
  {
    name: "Sarah Williams",
    role: "HR Specialist",
    quote:
      '"From the employer side, posting a job and reviewing applicants has never been this straightforward. We filled our last three positions within days of posting. Incredible platform."',
  },
  {
    name: "David Park",
    role: "Frontend Developer",
    quote:
      '"I was skeptical at first, but MyJob delivered. The candidate matching is genuinely accurate — every role suggested to me was relevant and aligned with my skill set."',
  },
];

const VISIBLE = 3;

export function TestimonialsCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE < testimonials.length;

  const prev = () => {
    if (canPrev) setStartIndex((i) => i - 1);
  };
  const next = () => {
    if (canNext) setStartIndex((i) => i + 1);
  };

  const visible = testimonials.slice(startIndex, startIndex + VISIBLE);

  return (
    <section className="bg-[#F1F2F4] py-20" style={{ fontFamily: "var(--font-inter)" }}>
      <div className="mx-auto max-w-[1320px] px-4">
        <h2 className="mb-14 text-center font-bold text-3xl text-[#18191C]">Clients Testimonial</h2>

        <div className="relative">
          {/* Cards */}
          <div className="grid grid-cols-3 gap-6">
            {visible.map((t) => (
              <div key={t.name} className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={`star-${i}`} size={18} className="fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>

                <p className="mb-6 flex-1 text-[#5E6670] text-sm leading-7">{t.quote}</p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FB] font-bold text-[#0A65CC] text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#18191C] text-sm">{t.name}</p>
                      <p className="text-[#767F8C] text-xs">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F0FB] font-bold font-serif text-[#0A65CC] text-xl">
                    "
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev arrow */}
          <button
            type="button"
            onClick={prev}
            disabled={!canPrev}
            className="absolute top-1/2 -left-6 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E5E8] bg-white shadow-sm transition-colors hover:enabled:border-[#0A65CC] hover:enabled:bg-[#0A65CC] hover:enabled:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Next arrow */}
          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            className="absolute top-1/2 -right-6 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E5E8] bg-white shadow-sm transition-colors hover:enabled:border-[#0A65CC] hover:enabled:bg-[#0A65CC] hover:enabled:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: testimonials.length - VISIBLE + 1 }).map((_, i) => (
            <button
              type="button"
              key={`dot-${i}`}
              onClick={() => setStartIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === startIndex ? "w-6 bg-[#0A65CC]" : "w-2 bg-[#C5C9D6]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
