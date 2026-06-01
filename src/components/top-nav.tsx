"use client";

import Link from "next/link";

import { Briefcase, LogOut, Search, Settings, UserCircle2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface TopNavProps {
  role: "employer" | "candidate";
}

export function TopNav({ role }: TopNavProps) {
  const homePath = `/${role}/jobs`;
  const settingsPath = `/${role}/settings`;

  return (
    <div className="top-0 z-20 border-border border-b bg-background/95 px-2 backdrop-blur-sm">
      <div className="mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href={homePath} className="flex items-center gap-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-primary">
            <Briefcase color="#0A65CC" className="size-6" />
          </div>
          <div className="font-semibold text-lg">MyJob</div>
        </Link>

        <div className="relative flex w-full max-w-3xl items-center sm:w-[600px]">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            type="search"
            placeholder="Job title, keyword, company"
            aria-label="Search jobs"
          />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-foreground transition hover:bg-muted/80"
                aria-label="Profile menu"
              >
                <UserCircle2 className="size-7" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={settingsPath} className="flex items-center">
                  <Settings className="mr-2 size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/auth/login"
                  className="flex items-center text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Log Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
