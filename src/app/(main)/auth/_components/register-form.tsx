'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
} from 'lucide-react';

import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CompanyPictureUpload,
  ProfilePictureUpload,
  ResumeUpload,
} from '@/components/ui/file-upload';
import { Separator } from '@/components/ui/separator';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import { ApiError, apiFetch } from '@/lib/api/client';
import type { CandidateOut, ResumeOut, WorkExperienceOut } from '@/lib/api/types';
import { supabase } from '@/lib/supabase/client';

// ─── Candidate schema ────────────────────────────────────────────────────────

const workExpSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  jobTitle: z.string().min(1, 'Job title is required.'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const candidateSchema = z.object({
  // Step 1 – account
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string().min(1, 'Please confirm your password.'),
  // Step 1 – personal info
  fullName: z.string().min(1, 'Full name is required.'),
  phoneNumber: z.string().min(1, 'Phone number is required.'),
  gender: z.string().min(1, 'Please select your gender.'),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.string().optional(),
  website: z.string().optional(),
  preferredLocation: z.string().optional(),
  preferredWorkingMode: z.string().optional(),
  yearsOfExperience: z.string().min(1, 'Please select your experience range.'),
  candidateLevel: z.string().min(1, 'Please select your level.'),
  biography: z.string().optional(),
  skills: z.array(z.string()).min(1, 'Please add at least one skill.'),
  resume: z.any().optional(),
  profilePicture: z.any().optional(),
  // Step 2 – education & work experience
  educationLevel: z.string().min(1, 'Please select your education level.'),
  fieldOfStudy: z.string().min(1, 'Field of study is required.'),
  workExperiences: z.array(workExpSchema),
}).superRefine((data, ctx) => {
  if (data.confirmPassword.length > 0 && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    });
  }
});

type CandidateFormData = z.infer<typeof candidateSchema>;

const STEP1_FIELDS: (keyof CandidateFormData)[] = [
  'email',
  'password',
  'confirmPassword',
];

const STEP2_FIELDS: (keyof CandidateFormData)[] = [
  'fullName',
  'phoneNumber',
  'gender',
  'yearsOfExperience',
  'candidateLevel',
  'skills',
];

// ─── RegisterFormCandidate ────────────────────────────────────────────────────

export function RegisterFormCandidate() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [resumeStatus, setResumeStatus] = useState<
    'idle' | 'uploading' | 'parsing' | 'done' | 'failed'
  >('idle');
  const router = useRouter();

  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      gender: '',
      dateOfBirth: '',
      nationality: '',
      maritalStatus: '',
      website: '',
      preferredLocation: '',
      preferredWorkingMode: '',
      yearsOfExperience: '',
      candidateLevel: '',
      biography: '',
      skills: [],
      resume: undefined,
      profilePicture: undefined,
      educationLevel: '',
      fieldOfStudy: '',
      workExperiences: [],
    },
  });

  const {
    fields: workExpFields,
    append: appendWorkExp,
    remove: removeWorkExp,
  } = useFieldArray({ control: form.control, name: 'workExperiences' });

  const handleContinue = async () => {
    const valid = await form.trigger(STEP2_FIELDS);
    if (valid) setStep(step + 1);
  };

  // Step 1: validate account fields, then create the Supabase auth account.
  // On success we advance to Step 2 (resume upload) using the issued session.
  const handleSignup = async () => {
    const valid = await form.trigger(STEP1_FIELDS);
    if (!valid) return;

    const { email, password } = form.getValues();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: 'candidate' } },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Email-confirmation enabled → no session is returned. The user must
      // confirm before they can hit authenticated backend endpoints.
      if (!data.session) {
        toast.info(
          'Account created. Please check your email to confirm, then log in to continue.',
        );
        return;
      }

      toast.success('Account created.');
      setStep(2);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Poll the resume's parse_status until the backend background task finishes.
  const pollParseStatus = async (
    resumeId: number,
  ): Promise<'success' | 'failed'> => {
    const deadline = Date.now() + 60_000; // give the LLM parser up to 60s
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const resume = await apiFetch<ResumeOut>(`/resumes/${resumeId}`);
      if (resume.parse_status === 'success') return 'success';
      if (resume.parse_status === 'failed') return 'failed';
    }
    return 'failed';
  };

  // Populate the form from the parsed candidate profile.
  const applyAutofill = (candidate: CandidateOut) => {
    if (candidate.skills?.length) {
      form.setValue(
        'skills',
        candidate.skills.map((s) => s.skill_name),
        { shouldValidate: true },
      );
    }
    if (candidate.work_experiences?.length) {
      form.setValue(
        'workExperiences',
        candidate.work_experiences.map((w) => ({
          companyName: w.company_name ?? '',
          jobTitle: w.job_title ?? '',
          startDate: w.start_date ?? '',
          endDate: w.end_date ?? '',
          description: w.description ?? '',
        })),
      );
    }
    if (candidate.education_level) {
      form.setValue('educationLevel', candidate.education_level);
    }
    if (candidate.field_of_study) {
      form.setValue('fieldOfStudy', candidate.field_of_study);
    }
  };

  // Step 2: upload the resume, wait for parsing, then autofill skills /
  // work experience / education from the parsed candidate profile.
  const handleResumeUpload = async (file: File) => {
    setResumeStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const resume = await apiFetch<ResumeOut>('/resumes', {
        method: 'POST',
        body: formData,
      });

      setResumeStatus('parsing');
      const result = await pollParseStatus(resume.resume_id);
      if (result === 'failed') {
        setResumeStatus('failed');
        toast.error(
          "We couldn't read your resume automatically. Please fill in the fields manually.",
        );
        return;
      }

      const candidate = await apiFetch<CandidateOut>('/candidates/me');
      applyAutofill(candidate);
      setResumeStatus('done');
      toast.success('Resume parsed — we filled in what we found.');
    } catch (err) {
      setResumeStatus('failed');
      toast.error(
        err instanceof ApiError ? err.message : 'Resume upload failed.',
      );
    }
  };

  // Replace all of the candidate's work experiences with the form's list.
  // Parsed rows already in the DB are cleared and re-created as manual so the
  // saved state always matches what the user sees in the form.
  const syncWorkExperiences = async (
    items: CandidateFormData['workExperiences'],
  ) => {
    const existing = await apiFetch<WorkExperienceOut[]>(
      '/candidates/me/work-experiences',
    );
    await Promise.all(
      existing.map((w) =>
        apiFetch(`/work-experiences/${w.experience_id}`, { method: 'DELETE' }),
      ),
    );
    for (const w of items) {
      if (!w.companyName && !w.jobTitle) continue;
      await apiFetch('/candidates/me/work-experiences', {
        method: 'POST',
        body: JSON.stringify({
          company_name: w.companyName,
          job_title: w.jobTitle,
          start_date: w.startDate || null,
          end_date: w.endDate || null,
          description: w.description || null,
          source: 'manual',
        }),
      });
    }
  };

  const onSubmit = async (data: CandidateFormData) => {
    setSubmitting(true);
    try {
      // 1. Profile fields + skills (skills replace all existing rows).
      await apiFetch<CandidateOut>('/candidates/me', {
        method: 'PATCH',
        body: JSON.stringify({
          full_name: data.fullName,
          phone_number: data.phoneNumber || null,
          gender: data.gender || null,
          date_of_birth: data.dateOfBirth || null,
          nationality: data.nationality || null,
          marital_status: data.maritalStatus || null,
          website: data.website || null,
          preferred_location: data.preferredLocation || null,
          preferred_working_mode: data.preferredWorkingMode || null,
          biography: data.biography || null,
          years_of_experience: data.yearsOfExperience || null,
          candidate_level: data.candidateLevel || null,
          education_level: data.educationLevel || null,
          field_of_study: data.fieldOfStudy || null,
          skills: data.skills,
        }),
      });

      // 2. Profile picture (optional).
      if (data.profilePicture instanceof File) {
        const pictureData = new FormData();
        pictureData.append('file', data.profilePicture);
        await apiFetch('/candidates/me/profile-picture', {
          method: 'POST',
          body: pictureData,
        });
      }

      // 3. Work experiences.
      await syncWorkExperiences(data.workExperiences);

      toast.success('Your profile has been saved.');
      router.push('/candidate/jobs');
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'Could not save your profile.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col rounded-3xl border border-blue-500/20 bg-background p-6 shadow-sm sm:p-8'
    >
      {/* Step indicator */}
      <div className='flex items-center justify-between text-sm text-muted-foreground'>
        <span className='font-medium text-foreground'>Step {step} of 3</span>
        <div className='flex gap-1.5'>
          <span className={`h-2 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <span className={`h-2 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <span className={`h-2 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>

      {/* ─── STEP 1 ───────────────────────────────────────────────────────── */}
      {step === 1 && (
        <>
          <Separator className='my-6' />

          {/* Account */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <Controller
              control={form.control}
              name='email'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5 sm:col-span-2' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-email'>Email Address</FieldLabel>
                  <Input {...field} id='register-email' type='email' placeholder='you@example.com' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='password'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-password'>Password</FieldLabel>
                  <Input {...field} id='register-password' type='password' placeholder='Create a password' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='confirmPassword'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-confirm-password'>Confirm Password</FieldLabel>
                  <Input {...field} id='register-confirm-password' type='password' placeholder='Re-enter password' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Separator className='my-6' />

          <Button
            className='h-12 w-full'
            type='button'
            onClick={handleSignup}
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Submit'}
          </Button>
        </>
      )}

      {/* ─── STEP 2 ───────────────────────────────────────────────────────── */}
      {step === 2 && (
        <>
          <Separator className='my-6' />

          {/* Resume */}
          <Controller
            control={form.control}
            name='resume'
            render={({ field }) => (
              <ResumeUpload
                id='register-resume'
                value={field.value}
                onChange={(file) => {
                  field.onChange(file);
                  if (file) {
                    void handleResumeUpload(file);
                  } else {
                    setResumeStatus('idle');
                  }
                }}
              />
            )}
          />

          {resumeStatus === 'uploading' && (
            <p className='mt-3 text-center text-sm text-muted-foreground'>
              Uploading your resume…
            </p>
          )}
          {resumeStatus === 'parsing' && (
            <p className='mt-3 text-center text-sm text-muted-foreground'>
              Reading your resume — autofilling your skills and experience…
            </p>
          )}
          {resumeStatus === 'done' && (
            <p className='mt-3 text-center text-sm text-green-600'>
              We filled in what we found. Review and edit below.
            </p>
          )}
          {resumeStatus === 'failed' && (
            <p className='mt-3 text-center text-sm text-destructive'>
              Couldn't read your resume automatically — please fill the fields
              manually.
            </p>
          )}

          <Separator className='my-6' />

          {/* Profile picture + Name + Phone */}
          <div className='grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]'>
            <Controller
              control={form.control}
              name='profilePicture'
              render={({ field }) => (
                <ProfilePictureUpload id='register-profile-picture' value={field.value} onChange={field.onChange} />
              )}
            />
            <FieldGroup className='grid gap-4 content-start'>
              <Controller
                control={form.control}
                name='fullName'
                render={({ field, fieldState }) => (
                  <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='register-full-name'>Full Name</FieldLabel>
                    <Input {...field} id='register-full-name' placeholder='Your full name' className='py-6' aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='phoneNumber'
                render={({ field, fieldState }) => (
                  <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='register-phone-number'>Phone Number</FieldLabel>
                    <Input {...field} id='register-phone-number' placeholder='+1 (555) 000-0000' className='py-6' aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <Separator className='my-6' />

          {/* Personal details */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <Controller
              control={form.control}
              name='gender'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-gender'>Gender</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='register-gender' className='py-6'><SelectValue placeholder='Select your gender' /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                      <SelectItem value='prefer-not-to-say'>Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='maritalStatus'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-marital-status'>Marital Status</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='register-marital-status' className='py-6'><SelectValue placeholder='Select marital status' /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='single'>Single</SelectItem>
                      <SelectItem value='married'>Married</SelectItem>
                      <SelectItem value='divorced'>Divorced</SelectItem>
                      <SelectItem value='widowed'>Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='dateOfBirth'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-dob'>Date of Birth</FieldLabel>
                  <Input {...field} id='register-dob' type='date' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='nationality'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-nationality'>Nationality</FieldLabel>
                  <Input {...field} id='register-nationality' placeholder='e.g. American' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='website'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5 sm:col-span-2' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-website'>
                    Website / Portfolio{' '}
                    <span className='font-normal text-muted-foreground'>(optional)</span>
                  </FieldLabel>
                  <Input {...field} id='register-website' placeholder='https://example.com' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='preferredLocation'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-preferred-location'>
                    Preferred Location{' '}
                    <span className='font-normal text-muted-foreground'>(optional)</span>
                  </FieldLabel>
                  <Input {...field} id='register-preferred-location' placeholder='e.g. Singapore, Remote' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='preferredWorkingMode'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-preferred-work-mode'>
                    Preferred Work Mode{' '}
                    <span className='font-normal text-muted-foreground'>(optional)</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='register-preferred-work-mode' className='py-6'>
                      <SelectValue placeholder='Select work mode' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='remote'>Remote</SelectItem>
                      <SelectItem value='onsite'>On-site</SelectItem>
                      <SelectItem value='hybrid'>Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Separator className='my-6' />

          {/* Professional details */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <Controller
              control={form.control}
              name='yearsOfExperience'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-years-of-experience'>Years of Experience</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='register-years-of-experience' className='py-6'><SelectValue placeholder='Select your experience' /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='0-1'>0–1 years</SelectItem>
                      <SelectItem value='1-3'>1–3 years</SelectItem>
                      <SelectItem value='3-5'>3–5 years</SelectItem>
                      <SelectItem value='5-10'>5–10 years</SelectItem>
                      <SelectItem value='10+'>10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='candidateLevel'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-candidate-level'>Candidate Level</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='register-candidate-level' className='py-6'><SelectValue placeholder='Select your level' /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='entry'>Entry Level</SelectItem>
                      <SelectItem value='mid'>Mid Level</SelectItem>
                      <SelectItem value='expert'>Expert Level</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='skills'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5 sm:col-span-2' data-invalid={fieldState.invalid}>
                  <FieldLabel>Skills</FieldLabel>
                  <TagInput value={field.value} onChange={field.onChange} placeholder='Type a skill and press Enter…' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='biography'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5 sm:col-span-2' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-biography'>
                    Biography{' '}
                    <span className='font-normal text-muted-foreground'>(optional)</span>
                  </FieldLabel>
                  <Textarea {...field} id='register-biography' placeholder='Tell us about yourself…' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Separator className='my-6' />

          <div className='flex gap-3'>
            <Button className='h-12 flex-1' type='button' variant='outline' onClick={() => setStep(1)}>
              <ChevronLeft className='mr-1 size-4' />
              Back
            </Button>
            <Button className='h-12 flex-1' type='button' onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </>
      )}

      {/* ─── STEP 2 ───────────────────────────────────────────────────────── */}
      {step === 3 && (
        <>
          <Separator className='my-6' />

          {/* Education */}
          <div>
            <h2 className='mb-4 text-base font-semibold'>Education</h2>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Controller
                control={form.control}
                name='educationLevel'
                render={({ field, fieldState }) => (
                  <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='register-education-level'>Level of Education</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id='register-education-level' className='py-6'><SelectValue placeholder='Select your education' /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value='high-school'>High school or GED</SelectItem>
                        <SelectItem value='associate'>Associate degree</SelectItem>
                        <SelectItem value='bachelor'>Bachelor's degree</SelectItem>
                        <SelectItem value='master'>Master's degree</SelectItem>
                        <SelectItem value='doctorate'>Doctorate / PhD</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='fieldOfStudy'
                render={({ field, fieldState }) => (
                  <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='register-field-of-study'>Field of Study</FieldLabel>
                    <Input {...field} id='register-field-of-study' placeholder='e.g. Computer Science' className='py-6' aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </div>

          <Separator className='my-6' />

          {/* Work Experience */}
          <div>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-base font-semibold'>Work Experience</h2>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => appendWorkExp({ companyName: '', jobTitle: '', startDate: '', endDate: '', description: '' })}
                className='gap-1.5'
              >
                <Plus className='size-4' />
                Add Experience
              </Button>
            </div>

            {workExpFields.length === 0 && (
              <p className='rounded-2xl border border-dashed py-6 text-center text-sm text-muted-foreground'>
                No work experience yet — click "Add Experience" to add one.
              </p>
            )}

            <div className='grid gap-4'>
              {workExpFields.map((workField, index) => (
                <div key={workField.id} className='relative grid gap-4 rounded-2xl border border-border p-4 pt-10'>
                  <div className='absolute right-3 top-3 flex items-center gap-1 text-xs text-muted-foreground'>
                    <span>#{index + 1}</span>
                    <Button type='button' variant='ghost' size='sm' onClick={() => removeWorkExp(index)} className='size-7 p-0 hover:text-destructive'>
                      <Trash2 className='size-3.5' />
                    </Button>
                  </div>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <Controller control={form.control} name={`workExperiences.${index}.companyName`}
                      render={({ field, fieldState }) => (
                        <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`work-company-${index}`}>Company Name</FieldLabel>
                          <Input {...field} id={`work-company-${index}`} placeholder='Company name' className='py-6' aria-invalid={fieldState.invalid} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller control={form.control} name={`workExperiences.${index}.jobTitle`}
                      render={({ field, fieldState }) => (
                        <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`work-title-${index}`}>Job Title</FieldLabel>
                          <Input {...field} id={`work-title-${index}`} placeholder='Your job title' className='py-6' aria-invalid={fieldState.invalid} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller control={form.control} name={`workExperiences.${index}.startDate`}
                      render={({ field }) => (
                        <Field className='gap-1.5'>
                          <FieldLabel htmlFor={`work-start-${index}`}>Start Date</FieldLabel>
                          <Input {...field} id={`work-start-${index}`} type='date' className='py-6' />
                        </Field>
                      )}
                    />
                    <Controller control={form.control} name={`workExperiences.${index}.endDate`}
                      render={({ field }) => (
                        <Field className='gap-1.5'>
                          <FieldLabel htmlFor={`work-end-${index}`}>End Date</FieldLabel>
                          <Input {...field} id={`work-end-${index}`} type='date' className='py-6' />
                        </Field>
                      )}
                    />
                    <Controller control={form.control} name={`workExperiences.${index}.description`}
                      render={({ field, fieldState }) => (
                        <Field className='gap-1.5 sm:col-span-2' data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`work-desc-${index}`}>
                            Description <span className='font-normal text-muted-foreground'>(optional)</span>
                          </FieldLabel>
                          <Textarea {...field} id={`work-desc-${index}`} placeholder='Describe your responsibilities…' aria-invalid={fieldState.invalid} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className='my-6' />

          {/* Navigation */}
          <div className='flex gap-3'>
            <Button className='h-12 flex-1' type='button' variant='outline' onClick={() => setStep(2)} disabled={submitting}>
              <ChevronLeft className='mr-1 size-4' />
              Back
            </Button>
            <Button className='h-12 flex-1' type='submit' disabled={submitting}>
              {submitting ? 'Saving…' : 'Submit'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

// ─── RegisterFormEmployer ─────────────────────────────────────────────────────

const formSchema2 = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password.' }),
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  companyInformation: z
    .string()
    .min(1, { message: 'Company information is required.' }),
  companyPicture: z.any().optional(),
  profilePicture: z.any().optional(),
}).superRefine((data, ctx) => {
  if (data.confirmPassword.length > 0 && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    });
  }
});

export function RegisterFormEmployer() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: '',
      companyName: '',
      companyInformation: '',
      companyPicture: undefined,
      profilePicture: undefined,
    },
  });

  // Step 1: create Supabase auth account with role=employer
  const handleSignup = async () => {
    const valid = await form.trigger(['email', 'password', 'confirmPassword']);
    if (!valid) return;

    const { email, password } = form.getValues();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: 'employer' } },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.session) {
        toast.info(
          'Account created. Please check your email to confirm, then log in to continue.',
        );
        return;
      }

      toast.success('Account created.');
      setStep(2);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema2>) => {
    setSubmitting(true);
    try {
      // 1. Update employer profile
      await apiFetch('/employers/me', {
        method: 'PATCH',
        body: JSON.stringify({
          full_name: data.fullName,
          company_name: data.companyName,
          phone_number: data.phoneNumber || null,
          company_information: data.companyInformation || null,
        }),
      });

      // 2. Profile picture (optional)
      if (data.profilePicture instanceof File) {
        const pictureData = new FormData();
        pictureData.append('file', data.profilePicture);
        await apiFetch('/employers/me/profile-picture', {
          method: 'POST',
          body: pictureData,
        });
      }

      // 3. Company picture (optional)
      if (data.companyPicture instanceof File) {
        const companyPicData = new FormData();
        companyPicData.append('file', data.companyPicture);
        await apiFetch('/employers/me/company-picture', {
          method: 'POST',
          body: companyPicData,
        });
      }

      toast.success('Your profile has been saved.');
      router.push('/employer/jobs');
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'Could not save your profile.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col rounded-3xl border border-blue-500/20 bg-background p-6 shadow-sm sm:p-8'
    >
      {/* Step indicator */}
      <div className='flex items-center justify-between text-sm text-muted-foreground'>
        <span className='font-medium text-foreground'>Step {step} of 2</span>
        <div className='flex gap-1.5'>
          <span className={`h-2 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <span className={`h-2 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>

      {/* ─── STEP 1 ───────────────────────────────────────────────────────── */}
      {step === 1 && (
        <>
          <Separator className='my-6' />

          {/* Account */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <Controller
              control={form.control}
              name='email'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5 sm:col-span-2' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-email'>Email Address</FieldLabel>
                  <Input {...field} id='register-email' type='email' placeholder='you@company.com' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='password'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-password'>Password</FieldLabel>
                  <Input {...field} id='register-password' type='password' placeholder='Create a password' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='confirmPassword'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-confirm-password'>Confirm Password</FieldLabel>
                  <Input {...field} id='register-confirm-password' type='password' placeholder='Re-enter password' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Separator className='my-6' />

          <Button
            className='h-12 w-full'
            type='button'
            onClick={handleSignup}
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Submit'}
          </Button>
        </>
      )}

      {/* ─── STEP 2 ───────────────────────────────────────────────────────── */}
      {step === 2 && (
        <>
          {/* Profile picture + Name + Phone */}
          <div className='mt-6 grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]'>
            <Controller
              control={form.control}
              name='profilePicture'
              render={({ field }) => (
                <ProfilePictureUpload id='register-profile-picture' value={field.value} onChange={field.onChange} />
              )}
            />
            <FieldGroup className='grid gap-4 content-start'>
              <Controller
                control={form.control}
                name='fullName'
                render={({ field, fieldState }) => (
                  <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='register-full-name'>Full Name</FieldLabel>
                    <Input {...field} id='register-full-name' placeholder='Your full name' className='py-6' aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='phoneNumber'
                render={({ field, fieldState }) => (
                  <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='register-phone-number'>Phone Number</FieldLabel>
                    <Input {...field} id='register-phone-number' placeholder='+1 (555) 000-0000' className='py-6' aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <Separator className='my-6' />

          {/* Company picture */}
          <Controller
            control={form.control}
            name='companyPicture'
            render={({ field }) => (
              <CompanyPictureUpload id='register-company-picture' value={field.value} onChange={field.onChange} />
            )}
          />

          <Separator className='my-6' />

          {/* Company details */}
          <div className='grid gap-4'>
            <Controller
              control={form.control}
              name='companyName'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-company-name'>Company Name</FieldLabel>
                  <Input {...field} id='register-company-name' placeholder='Your company name' className='py-6' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='companyInformation'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-company-information'>Company Information</FieldLabel>
                  <Textarea {...field} id='register-company-information' placeholder='Describe your company…' rows={4} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Separator className='my-6' />

          <div className='flex gap-3'>
            <Button className='h-12 flex-1' type='button' variant='outline' onClick={() => setStep(1)} disabled={submitting}>
              <ChevronLeft className='mr-1 size-4' />
              Back
            </Button>
            <Button className='h-12 flex-1' type='submit' disabled={submitting}>
              {submitting ? 'Saving…' : 'Submit'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
