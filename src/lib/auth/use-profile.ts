"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api/client";
import type { CandidateOut, EmployerOut } from "@/lib/api/types";

import { useAuth } from "./auth-context";

interface ProfileInfo {
  name: string | null;
  email: string | null;
  profilePicture: string | null;
}

export function useProfile(): ProfileInfo {
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<ProfileInfo>({
    name: null,
    email: null,
    profilePicture: null,
  });

  useEffect(() => {
    if (!role) return;
    const endpoint = role === "candidate" ? "/candidates/me" : "/employers/me";
    apiFetch<CandidateOut | EmployerOut>(endpoint)
      .then((data) => {
        setProfile({
          name: data.full_name,
          email: user?.email ?? null,
          profilePicture: data.profile_picture,
        });
      })
      .catch(() => {});
  }, [role, user?.email]);

  return profile;
}
