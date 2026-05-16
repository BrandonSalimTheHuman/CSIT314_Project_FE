import { useState } from 'react';
import {
  Star,
  Download,
  Globe,
  X,
  Mail,
  MapPin,
  Phone,
  Cake,
  ClipboardList,
  CircleUser,
  BriefcaseBusiness,
  GraduationCap,
  ArrowRightCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface CandidateProfile {
  name: string;
  title: string;
  experience: string;
  avatar: string;
  biography: string;
  coverLetter: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  gender: string;
  education: string;
  website: string;
  location: string;
  phone: string;
  email: string;
}

interface CandidateProfileModalProps {
  candidate: CandidateProfile;
  onClose: () => void;
}

export function CandidateProfileModal({
  candidate,
  onClose,
}: CandidateProfileModalProps) {
  const [isStarred, setIsStarred] = useState(false);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='relative max-h-[90vh] w-full max-w-4xl'>
        <button
          onClick={onClose}
          className='absolute -right-16 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg hover:bg-gray-100 transition-colors'
        >
          <X className='size-6' />
        </button>
        <div className='max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white'>
          <div className='sticky top-0 border-b border-border bg-white p-6 sm:p-8'>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className='h-20 w-20 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <h1 className='text-2xl font-semibold'>{candidate.name}</h1>
                </div>
              </div>
              <div className='mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex gap-3'>
                  <Button
                    variant='outline'
                    className='border-sky-700 text-sky-700 gap-2 py-5 px-6 hover:text-sky-700'
                  >
                    <Mail className='size-5' />
                    Send Mail
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className='grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_320px]'>
            <div className='space-y-8'>
              <div>
                <h2 className='mb-3 text-lg font-semibold uppercase tracking-wide text-foreground'>
                  Biography
                </h2>
                <p className='text-sm leading-7 text-muted-foreground'>
                  {candidate.biography}
                </p>
              </div>

              <div>
                <h2 className='mb-3 text-lg font-semibold uppercase tracking-wide text-foreground'>
                  Cover Letter
                </h2>
                <p className='whitespace-pre-wrap text-sm leading-7 text-muted-foreground'>
                  {candidate.coverLetter}
                </p>
              </div>
            </div>

            <div className='space-y-6'>
              <div className='space-y-4 grid grid-cols-2 rounded-2xl border border-border p-4'>
                <div className='items-center gap-3'>
                  <Cake className='size-6 text-sky-700 my-2' />
                  <div className='grid gap-1'>
                    <div className='text-xs font-semibold uppercase text-slate-400'>
                      Date of Birth
                    </div>
                    <div className='text-sm font-medium text-foreground'>
                      {candidate.dateOfBirth}
                    </div>
                  </div>
                </div>

                <div className='items-center gap-3'>
                  <Globe className='size-6 text-sky-700 my-2' />
                  <div className='grid gap-1'>
                    <div className='text-xs font-semibold uppercase text-slate-400'>
                      Nationality
                    </div>
                    <div className='text-sm font-medium text-foreground'>
                      {candidate.nationality}
                    </div>
                  </div>
                </div>

                <div className='items-center gap-3'>
                  <BriefcaseBusiness className='size-6 text-sky-700 my-2' />
                  <div className='grid gap-1'>
                    <div className='text-xs font-semibold uppercase text-slate-400'>
                      Experience
                    </div>
                    <div className='text-sm font-medium text-foreground'>
                      {candidate.experience}
                    </div>
                  </div>
                </div>

                <div className='items-center gap-3'>
                  <GraduationCap className='size-6 text-sky-700 my-2' />
                  <div className='grid gap-1'>
                    <div className='text-xs font-semibold uppercase text-slate-400'>
                      Educations
                    </div>
                    <div className='text-sm font-medium text-foreground'>
                      {candidate.education}
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-2xl border border-border p-4'>
                <div className='mb-3 text-sm font-semibold'>
                  Download My Resume
                </div>
                <div className='flex items-center justify-between rounded-lg border border-border bg-white p-3'>
                  <div className='flex gap-3 items-center'>
                    <FileText
                      strokeWidth='1'
                      className='size-11 text-sky-700 stroke-gray-300'
                    />
                    <div className='grid gap-1'>
                      <div className='text-sm font-medium text-foreground'>
                        {candidate.name}
                      </div>
                      <div className='text-xs text-muted-foreground'>PDF</div>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='group hover:bg-sky-100 px-[10px] py-[20px]'
                  >
                    <Download className='size-5 group-hover:stroke-sky-700' />
                  </Button>
                </div>
              </div>

              <div className='space-y-6 rounded-3xl border border-slate-200 p-6 shadow-sm bg-white'>
                <div className='text-lg font-bold text-slate-900'>
                  Contact Information
                </div>

                <div className='space-y-5'>
                  <div className='flex gap-4'>
                    <div className='flex-shrink-0'>
                      <Globe className='size-7 text-blue-600' />
                    </div>
                    <div className='space-y-1'>
                      <div className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
                        Website
                      </div>
                      <a
                        href={`https://${candidate.website}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block font-medium text-slate-900 hover:underline'
                      >
                        {candidate.website}
                      </a>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-3'>
                    <div className='flex gap-4'>
                      <div className='flex-shrink-0'>
                        <MapPin className='size-7 text-blue-600' />
                      </div>
                      <div className='space-y-1'>
                        <div className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
                          Location
                        </div>
                        <div className='font-medium text-slate-900'>
                          {candidate.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className='flex gap-4'>
                    <div className='flex-shrink-0'>
                      <Phone className='size-7 text-blue-600' />
                    </div>
                    <div className='space-y-4'>
                      <div className='space-y-1'>
                        <div className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
                          Phone
                        </div>
                        <div className='font-medium text-slate-900'>
                          {candidate.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className='flex gap-4'>
                    <div className='flex-shrink-0'>
                      <Mail className='size-7 text-blue-600' />
                    </div>
                    <div className='space-y-1'>
                      <div className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
                        Email Address
                      </div>
                      <a
                        href={`mailto:${candidate.email}`}
                        className='block font-medium text-slate-900'
                      >
                        {candidate.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
