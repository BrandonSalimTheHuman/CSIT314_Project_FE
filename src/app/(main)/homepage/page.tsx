"use client";

import { Fragment } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  MapPin,
  Phone,
  ScanSearch,
  Upload,
  UserPlus,
} from "lucide-react";

import heroImage from "../../../../media/homepageimage.svg";
import logoImage from "../../../../media/logo.svg";
import { useAuth } from "@/lib/auth/auth-context";
import { HeroSearch } from "./_components/hero-search";
import { TestimonialsCarousel } from "./_components/testimonials-carousel";

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    Icon: UserPlus,
    title: "Create account",
    desc: "Sign up in minutes and build your profile to showcase your skills and experience.",
    step: 1,
  },
  {
    Icon: Upload,
    title: "Upload CV/Resume",
    desc: "Upload your latest resume so employers can discover your qualifications instantly.",
    step: 2,
  },
  {
    Icon: ScanSearch,
    title: "Find suitable job",
    desc: "Browse thousands of listings filtered by role, location, salary, and job type.",
    step: 3,
  },
  {
    Icon: CheckCircle2,
    title: "Apply job",
    desc: "Submit your application with one click and track every stage of your progress.",
    step: 4,
  },
];

const featuredJobs = [
  {
    title: "Senior UX Designer",
    company: "Nomad",
    initials: "N",
    location: "Paris, France",
    salary: "$30k–$60k/month",
    days: "4 Days Remaining",
    type: "Full Time",
    typeColor: "text-blue-700 bg-blue-50",
  },
  {
    title: "Social Media Assistant",
    company: "Udacity",
    initials: "U",
    location: "Dhaka, Bangladesh",
    salary: "$20k–$40k/month",
    days: "3 Days Remaining",
    type: "Remote",
    typeColor: "text-green-700 bg-green-50",
  },
  {
    title: "Brand Designer",
    company: "Packer",
    initials: "P",
    location: "Dhaka, Bangladesh",
    salary: "$20k–$40k/month",
    days: "5 Days Remaining",
    type: "Full Time",
    typeColor: "text-blue-700 bg-blue-50",
  },
  {
    title: "Interactive Developer",
    company: "Theme Junction",
    initials: "TJ",
    location: "Dhaka, Bangladesh",
    salary: "$50k–$70k/month",
    days: "2 Days Remaining",
    type: "Part Time",
    typeColor: "text-purple-700 bg-purple-50",
  },
  {
    title: "Product Designer",
    company: "Figma",
    initials: "F",
    location: "California, USA",
    salary: "$50k–$80k/month",
    days: "4 Days Remaining",
    type: "Full Time",
    typeColor: "text-blue-700 bg-blue-50",
  },
  {
    title: "Animation Designer",
    company: "Revolut",
    initials: "R",
    location: "California, USA",
    salary: "$50k–$80k/month",
    days: "1 Day Remaining",
    type: "Remote",
    typeColor: "text-green-700 bg-green-50",
  },
];

const footerLinks = {
  "Quick Link": ["About", "Contact", "Pricing", "Blog"],
  Candidate: ["Browse Jobs", "Browse Employers", "Candidate Dashboard", "Saved Jobs"],
  Employers: ["Post a Job", "Browse Candidates", "Employers Dashboard", "Applications"],
  Support: ["FAQs", "Privacy Policy", "Terms & Conditions"],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomepagePage() {
  const { role } = useAuth();
  const router = useRouter();

  const candidateRoute = role === "candidate"
    ? "/candidate/jobs"
    : role === "employer"
    ? "/employer/jobs"
    : "/auth/login";

  const registerRoute = "/auth/onboarding";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-inter)" }}>
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="flex h-[72px] w-full items-center border-[#E4E5E8] border-b bg-white">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-6 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <Image src={logoImage} alt="MyJob logo" width={40} height={40} />
              <span className="font-bold text-2xl text-[#0A65CC]">My</span>
              <span className="font-bold text-2xl text-[#18191C]">Job</span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 font-medium text-[#18191C] text-sm transition-colors hover:text-[#0A65CC]"
            >
              Sign In
            </Link>
            <Link
              href={registerRoute}
              className="rounded-lg bg-[#0A65CC] px-5 py-2 font-medium text-sm text-white transition-colors hover:bg-[#0855b0]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#F1F2F4] py-20">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-12 px-4">
          {/* Left */}
          <div className="max-w-[600px] flex-1">
            <h1 className="mb-5 font-bold text-5xl text-[#18191C] leading-tight">
              Find a job that suits your interest &amp; skills.
            </h1>
            <p className="mb-10 max-w-[500px] text-[#767F8C] text-base leading-7">
              Search thousands of job listings across industries, connect with top employers, and take the next step in
              your career — all in one place.
            </p>

            <HeroSearch />
          </div>

          {/* Right – Hero Illustration */}
          <Image
            src={heroImage}
            alt="Hero illustration"
            width={492}
            height={382}
            className="hidden shrink-0 lg:block"
          />
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="bg-[#F1F2F4] py-20">
        <div className="mx-auto max-w-[1320px] px-4">
          <h2 className="mb-16 text-center font-bold text-3xl text-[#18191C]">How My Job work</h2>

          <div className="flex items-start justify-between">
            {steps.map(({ Icon, title, desc }) => (
              <Fragment key={title}>
                <div className="flex w-[22%] flex-col items-center rounded-2xl px-4 py-6 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#E4E5E8] bg-white shadow-sm">
                    <Icon size={26} className="text-[#0A65CC]" />
                  </div>
                  <h3 className="mb-2 font-semibold text-[#18191C] text-base">{title}</h3>
                  <p className="text-[#767F8C] text-sm leading-6">{desc}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Jobs ──────────────────────────────────────────────────── */}
      <section className="border-[#E4E5E8] border-t bg-white py-20">
        <div className="mx-auto max-w-[1320px] px-4">
          {/* Heading row */}
          <div className="mb-10 flex items-center justify-between">
            <h2 className="font-bold text-3xl text-[#18191C]">Featured job</h2>
            <button
              type="button"
              onClick={() => router.push(candidateRoute)}
              className="flex items-center gap-2 font-medium text-[#0A65CC] text-sm hover:underline"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {/* Job list */}
          <div className="flex flex-col divide-y divide-[#E4E5E8] overflow-hidden rounded-xl border border-[#E4E5E8]">
            {featuredJobs.map((job) => (
              <div
                key={job.title + job.company}
                className="flex items-center justify-between bg-white px-8 py-5 transition-colors hover:bg-[#F8F9FA]"
              >
                {/* Left: logo + info */}
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#E4E5E8] bg-[#F1F2F4]">
                    <span className="font-bold text-[#0A65CC] text-sm">{job.initials}</span>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-semibold text-[#18191C] text-base">{job.title}</span>
                      <span className="rounded bg-blue-50 px-2 py-0.5 font-medium text-[#0A65CC] text-xs">
                        Featured
                      </span>
                      <span className={`rounded px-2 py-0.5 font-medium text-xs ${job.typeColor}`}>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#767F8C] text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={14} /> {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {job.days}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Apply button */}
                <button
                  type="button"
                  onClick={() => router.push(candidateRoute)}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-[#0A65CC] px-5 py-2 font-semibold text-[#0A65CC] text-sm transition-colors hover:bg-[#0A65CC] hover:text-white"
                >
                  Apply Job <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsCarousel />

      {/* ── Call to Action ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-6 px-4">
          {/* Candidate */}
          <div className="flex min-h-[290px] flex-col justify-between rounded-2xl bg-[#F1F2F4] p-12">
            <div>
              <h3 className="mb-4 font-bold text-2xl text-[#18191C]">Become a Candidate</h3>
              <p className="max-w-xs text-[#767F8C] text-sm leading-6">
                Create your free profile, upload your resume, and get discovered by top companies hiring right now.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(registerRoute)}
              className="mt-8 flex items-center gap-2 self-start rounded-lg border border-[#E4E5E8] bg-white px-6 py-3 font-semibold text-[#18191C] text-sm transition-colors hover:border-[#0A65CC] hover:bg-[#0A65CC] hover:text-white"
            >
              Register now <ArrowRight size={16} />
            </button>
          </div>

          {/* Employer */}
          <div className="flex min-h-[290px] flex-col justify-between rounded-2xl bg-[#0A65CC] p-12">
            <div>
              <h3 className="mb-4 font-bold text-2xl text-white">Become an Employer</h3>
              <p className="max-w-xs text-blue-200 text-sm leading-6">
                Post jobs, search qualified candidates, and hire faster with smart matching tools built for modern
                teams.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(registerRoute)}
              className="mt-8 flex items-center gap-2 self-start rounded-lg bg-white px-6 py-3 font-semibold text-[#0A65CC] text-sm transition-colors hover:bg-blue-50"
            >
              Register now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#18191C] text-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-5 gap-10 px-4 py-16">
          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-6 flex items-center gap-1">
              <span className="font-bold text-[#0A65CC] text-xl">My</span>
              <span className="font-bold text-white text-xl">Job</span>
            </div>
            <div className="mb-3 flex items-center gap-2 text-[#9199A3] text-sm">
              <Phone size={14} />
              <span>
                Call now: <span className="text-white">(319) 555-0115</span>
              </span>
            </div>
            <p className="text-[#9199A3] text-xs leading-5">Level 12, 300 George St, Sydney NSW 2000, Australia</p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <h4 className="mb-5 font-semibold text-white">{col}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-[#9199A3] text-sm transition-colors hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright bar */}
        <div className="border-[#2D2D2D] border-t py-5 text-center text-[#9199A3] text-xs">
          @ 2026 MyJob - Job Portal. All rights Reserved
        </div>
      </footer>
    </div>
  );
}
