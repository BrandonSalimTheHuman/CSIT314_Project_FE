import Link from "next/link";

import { RegisterFormCandidate, RegisterFormEmployer } from "../../_components/register-form";

export default async function RegisterV2({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;

  const isCandidate = type === "candidate";
  const isEmployer = type === "employer";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col space-y-6 px-4 py-10 sm:px-6">
      <div className="flex justify-end text-sm">
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Link prefetch={false} className="font-medium text-foreground hover:underline" href="../login">
            Login
          </Link>
        </span>
      </div>

      <div className="space-y-1 text-center">
        <h1 className="font-medium text-3xl">{"Let's Set You Up"}</h1>
        <h3 className="text-muted-foreground text-sm">Fill in your personal information or upload your resume.</h3>
      </div>

      {isCandidate ? (
        <RegisterFormCandidate />
      ) : isEmployer ? (
        <RegisterFormEmployer />
      ) : (
        <div className="rounded-3xl border border-muted p-6 text-center">
          <p className="font-medium text-lg">Select an account type first.</p>
          <p className="mt-2 text-muted-foreground text-sm">
            Please choose candidate or employer from the onboarding page.
          </p>
        </div>
      )}
    </div>
  );
}
