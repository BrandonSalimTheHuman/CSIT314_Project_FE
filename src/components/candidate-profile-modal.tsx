import {
  Briefcase,
  Cake,
  Download,
  FileText,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';
import type { SkillOut, WorkExperienceOut } from '@/lib/api/types';

export interface CandidateProfile {
  name: string;
  title: string;
  experience: string;
  avatar: string | null;
  biography: string;
  coverLetter: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  gender: string;
  education: string;
  fieldOfStudy: string;
  preferredWorkingMode: string;
  website: string;
  location: string;
  phone: string;
  email: string;
  skills: SkillOut[];
  workExperiences: WorkExperienceOut[];
  resumeUrl: string | null;
}

interface CandidateProfileModalProps {
  candidate: CandidateProfile;
  onClose: () => void;
}

function formatDateRange(start: string | null, end: string | null): string {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `${fmt(start)} – Present`;
  return '';
}

export function CandidateProfileModal({ candidate, onClose }: CandidateProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl">
        <button
          onClick={onClose}
          className="absolute -right-14 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-colors hover:bg-gray-100"
        >
          <X className="size-6" />
        </button>

        <div className="max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white">
          {/* ── Header ── */}
          <div className="sticky top-0 z-10 border-b border-border bg-white px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 shrink-0 border border-border">
                  <AvatarImage src={candidate.avatar ?? undefined} alt={candidate.name} className="object-cover" />
                  <AvatarFallback className="text-xl font-semibold bg-sky-100 text-sky-700">
                    {getInitials(candidate.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">{candidate.name}</h1>
                  {candidate.title && (
                    <div className="mt-0.5 text-sm text-muted-foreground">{candidate.title}</div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {candidate.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3.5" />{candidate.location}
                      </span>
                    )}
                    {candidate.experience && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Briefcase className="size-3.5" />{candidate.experience} experience
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {candidate.email && (
                <a href={`mailto:${candidate.email}`}>
                  <Button variant="outline" className="gap-2 border-sky-700 py-5 px-6 text-sky-700 hover:text-sky-700">
                    <Mail className="size-4" />
                    Send Mail
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_300px]">
            {/* ── Left: main content ── */}
            <div className="space-y-8 min-w-0">
              {/* Biography */}
              {candidate.biography && (
                <div>
                  <h2 className="mb-3 text-base font-semibold uppercase tracking-wide text-foreground">Biography</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{candidate.biography}</p>
                </div>
              )}

              {/* Cover Letter — only shown for applicants */}
              {candidate.coverLetter && (
                <div>
                  <h2 className="mb-3 text-base font-semibold uppercase tracking-wide text-foreground">Cover Letter</h2>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{candidate.coverLetter}</p>
                </div>
              )}

              {/* Skills */}
              {candidate.skills.length > 0 && (
                <div>
                  <h2 className="mb-3 text-base font-semibold uppercase tracking-wide text-foreground">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((s) => (
                      <span
                        key={s.skill_id}
                        className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700"
                      >
                        {s.skill_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {candidate.workExperiences.length > 0 && (
                <div>
                  <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-foreground">Work Experience</h2>
                  <div className="space-y-4">
                    {candidate.workExperiences.map((exp) => (
                      <div key={exp.experience_id} className="flex gap-4 rounded-2xl border border-border bg-background p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100">
                          <Briefcase className="size-5 text-sky-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-foreground">{exp.job_title}</div>
                          <div className="text-sm text-muted-foreground">{exp.company_name}</div>
                          {(exp.start_date || exp.end_date) && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              {formatDateRange(exp.start_date, exp.end_date)}
                            </div>
                          )}
                          {exp.description && (
                            <p className="mt-2 text-xs leading-5 text-muted-foreground">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: sidebar ── */}
            <div className="space-y-5">
              {/* Personal Details */}
              <div className="rounded-2xl border border-border p-4">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {candidate.dateOfBirth && (
                    <div>
                      <Cake className="size-5 text-sky-700 mb-1" />
                      <div className="text-xs font-semibold uppercase text-slate-400">Date of Birth</div>
                      <div className="text-sm font-medium text-foreground">{candidate.dateOfBirth}</div>
                    </div>
                  )}
                  {candidate.nationality && (
                    <div>
                      <Globe className="size-5 text-sky-700 mb-1" />
                      <div className="text-xs font-semibold uppercase text-slate-400">Nationality</div>
                      <div className="text-sm font-medium text-foreground">{candidate.nationality}</div>
                    </div>
                  )}
                  {candidate.gender && (
                    <div>
                      <User className="size-5 text-sky-700 mb-1" />
                      <div className="text-xs font-semibold uppercase text-slate-400">Gender</div>
                      <div className="text-sm font-medium text-foreground">{candidate.gender}</div>
                    </div>
                  )}
                  {candidate.maritalStatus && (
                    <div>
                      <User className="size-5 text-sky-700 mb-1" />
                      <div className="text-xs font-semibold uppercase text-slate-400">Marital Status</div>
                      <div className="text-sm font-medium text-foreground">{candidate.maritalStatus}</div>
                    </div>
                  )}
                  {candidate.experience && (
                    <div>
                      <Briefcase className="size-5 text-sky-700 mb-1" />
                      <div className="text-xs font-semibold uppercase text-slate-400">Experience</div>
                      <div className="text-sm font-medium text-foreground">{candidate.experience}</div>
                    </div>
                  )}
                  {candidate.education && (
                    <div>
                      <GraduationCap className="size-5 text-sky-700 mb-1" />
                      <div className="text-xs font-semibold uppercase text-slate-400">Education</div>
                      <div className="text-sm font-medium text-foreground">{candidate.education}</div>
                    </div>
                  )}
                  {candidate.fieldOfStudy && (
                    <div className="col-span-2">
                      <GraduationCap className="size-5 text-sky-700 mb-1" />
                      <div className="text-xs font-semibold uppercase text-slate-400">Field of Study</div>
                      <div className="text-sm font-medium text-foreground">{candidate.fieldOfStudy}</div>
                    </div>
                  )}
                  {candidate.preferredWorkingMode && (
                    <div className="col-span-2">
                      <Briefcase className="size-5 text-sky-700 mb-1" />
                      <div className="text-xs font-semibold uppercase text-slate-400">Preferred Work Mode</div>
                      <div className="text-sm font-medium text-foreground">{candidate.preferredWorkingMode}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume */}
              {candidate.resumeUrl && (
                <div className="rounded-2xl border border-border p-4">
                  <div className="mb-3 text-sm font-semibold">Resume</div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-white p-3">
                    <div className="flex items-center gap-3">
                      <FileText strokeWidth={1} className="size-10 text-sky-700 stroke-gray-300" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{candidate.name}</div>
                        <div className="text-xs text-muted-foreground">PDF</div>
                      </div>
                    </div>
                    <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="group px-[10px] py-[20px] hover:bg-sky-100">
                        <Download className="size-5 group-hover:stroke-sky-700" />
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-4 rounded-2xl border border-border p-4">
                <div className="text-sm font-semibold text-foreground">Contact Information</div>
                <div className="space-y-4">
                  {candidate.website && (
                    <>
                      <div className="flex gap-3">
                        <Globe className="size-5 shrink-0 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Website</div>
                          <a
                            href={candidate.website.startsWith('http') ? candidate.website : `https://${candidate.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-slate-900 hover:underline break-all"
                          >
                            {candidate.website}
                          </a>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}
                  {candidate.location && (
                    <>
                      <div className="flex gap-3">
                        <MapPin className="size-5 shrink-0 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</div>
                          <div className="text-sm font-medium text-slate-900">{candidate.location}</div>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}
                  {candidate.phone && (
                    <>
                      <div className="flex gap-3">
                        <Phone className="size-5 shrink-0 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</div>
                          <div className="text-sm font-medium text-slate-900">{candidate.phone}</div>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}
                  {candidate.email && (
                    <div className="flex gap-3">
                      <Mail className="size-5 shrink-0 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</div>
                        <a href={`mailto:${candidate.email}`} className="text-sm font-medium text-slate-900 break-all">
                          {candidate.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
