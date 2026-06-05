"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Briefcase, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/auth-context";
import { useProfile } from "@/lib/auth/use-profile";
import { getInitials } from "@/lib/utils";

export function EmployerTopNav() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { name, email, profilePicture } = useProfile();

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  return (
    <div className="top-0 z-20 border-border border-b bg-background/95 px-2 backdrop-blur-sm">
      <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/employer/jobs" className="flex items-center gap-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-primary">
            <Briefcase color="#0A65CC" className="size-6" />
          </div>
          <div className="font-semibold text-lg">MyJob</div>
        </Link>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted transition hover:bg-muted/80"
                aria-label="Profile menu"
              >
                <Avatar className="size-10">
                  <AvatarImage src={profilePicture ?? undefined} alt={name ?? "Profile"} />
                  <AvatarFallback className="text-sm">
                    {name ? getInitials(name) : "?"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex items-center gap-3 px-3 py-3">
                <Avatar className="size-12 shrink-0">
                  <AvatarImage src={profilePicture ?? undefined} alt={name ?? "Profile"} />
                  <AvatarFallback>{name ? getInitials(name) : "?"}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold text-sm text-foreground">
                    {name ?? "—"}
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    {email ?? "—"}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/employer/settings" className="flex items-center">
                  <Settings className="mr-2 size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 size-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
