'use client';

import { useState } from 'react';
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
    const fields = step === 1 ? STEP1_FIELDS : STEP2_FIELDS;
    const valid = await form.trigger(fields);
    if (valid) setStep(step + 1);
  };

  const onSubmit = (data: CandidateFormData) => {
    toast('You submitted the following values', {
      description: (
        <pre className='mt-2 w-[320px] rounded-md bg-neutral-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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

          <Button className='h-12 w-full' type='button' onClick={handleContinue}>
            Continue
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
              <ResumeUpload id='register-resume' value={field.value} onChange={field.onChange} />
            )}
          />

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
            <Button className='h-12 flex-1' type='button' variant='outline' onClick={() => setStep(2)}>
              <ChevronLeft className='mr-1 size-4' />
              Back
            </Button>
            <Button className='h-12 flex-1' type='submit'>Submit</Button>
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

  const handleContinue = async () => {
    const valid = await form.trigger(['email', 'password', 'confirmPassword']);
    if (valid) setStep(2);
  };

  const onSubmit = (data: z.infer<typeof formSchema2>) => {
    toast('You submitted the following values', {
      description: (
        <pre className='mt-2 w-[320px] rounded-md bg-neutral-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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

          <Button className='h-12 w-full' type='button' onClick={handleContinue}>
            Continue
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
            <Button className='h-12 flex-1' type='button' variant='outline' onClick={() => setStep(1)}>
              <ChevronLeft className='mr-1 size-4' />
              Back
            </Button>
            <Button className='h-12 flex-1' type='submit'>Submit</Button>
          </div>
        </>
      )}
    </form>
  );
}
