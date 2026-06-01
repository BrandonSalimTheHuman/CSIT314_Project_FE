import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import Candidate from "../_components/Candidate.png";
import Employer from "../_components/Employer.png";

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col space-y-8 px-4 py-10 sm:px-6 lg:px-0">
      <div className="flex justify-end text-sm">
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Link prefetch={false} className="font-medium text-foreground hover:underline" href="login">
            Login
          </Link>
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="font-extrabold text-3xl">Join Us!</h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          To begin this journey, tell us what type of account you'd be opening.
        </p>
      </div>

      <div className="grid gap-4">
        <Link
          href="/auth/onboarding/register?type=candidate"
          className="group flex items-center gap-4 rounded-3xl border border-blue-500/50 bg-background p-5 transition hover:border-blue-600 hover:bg-blue-50"
        >
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-border">
            <Image src={Candidate} alt="Candidate" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">Job Seeker</p>
            <p className="text-base text-muted-foreground">Personal account to find a job</p>
          </div>
          <ArrowRight className="size-5 text-blue-500 opacity-0 transition duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
        </Link>

        <Link
          href="/auth/onboarding/register?type=employer"
          className="group flex items-center gap-4 rounded-3xl border border-blue-500/30 bg-background p-5 transition hover:border-blue-500 hover:bg-blue-50"
        >
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-border">
            <Image src={Employer} alt="Employer" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">Employer</p>
            <p className="text-base text-muted-foreground">Post your job, own or belong to a company.</p>
          </div>
          <ArrowRight className="size-5 text-blue-500 opacity-0 transition duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
        </Link>
      </div>
    </div>
  );
}
