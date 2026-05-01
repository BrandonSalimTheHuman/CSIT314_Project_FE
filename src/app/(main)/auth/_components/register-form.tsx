'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UploadCloud, ImageIcon } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
  educationLevel: z
    .string()
    .min(1, { message: 'Please select your education level.' }),
  fieldOfStudy: z.string().min(1, { message: 'Field of study is required.' }),
  yearsOfExperience: z
    .string()
    .min(1, { message: 'Please select your experience range.' }),
  skills: z.string().min(1, { message: 'Skills are required.' }),
  resume: z.any().optional(),
  profilePicture: z.any().optional(),
});

export function RegisterFormCandidate() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      educationLevel: '',
      fieldOfStudy: '',
      yearsOfExperience: '',
      skills: '',
      resume: undefined,
      profilePicture: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
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
      className='grid gap-0 divide-y divide-border rounded-3xl border border-blue-500/20 bg-background p-6 shadow-sm sm:p-8'
    >
      <label
        htmlFor='register-resume'
        className='mx-auto flex h-[220px] w-full max-w-xl cursor-pointer items-center justify-center rounded-[2rem] border border-blue-500 bg-muted text-muted-foreground shadow-sm transition hover:shadow-md'
      >
        <div className='flex flex-col items-center justify-center gap-3 px-6'>
          <UploadCloud className='size-12 text-black-600' />
          <div className='font-medium text-lg text-slate-900 dark:text-slate-100'>
            Upload Your Resume
          </div>
          <p className='text-slate-500 text-sm dark:text-slate-400'>
            File type: PDF
          </p>
          <input
            id='register-resume'
            type='file'
            accept='.pdf'
            className='sr-only'
            {...form.register('resume')}
          />
        </div>
      </label>

      <div className='grid gap-6 pt-10 lg:grid-cols-[200px_minmax(0,1fr)]'>
        <label
          htmlFor='register-profile-picture'
          className='grid cursor-pointer place-items-center rounded-3xl border border-blue-500/20 bg-muted p-6 shadow-sm transition hover:shadow-md'
        >
          <ImageIcon className='size-10' />
          <div className='mt-4 text-center text-sm'>Profile Picture</div>
          <p className='text-slate-500 text-sm dark:text-slate-400'>
            File types: JPEG, PNG
          </p>
          <input
            id='register-profile-picture'
            type='file'
            accept='image/*'
            className='sr-only'
            {...form.register('profilePicture')}
          />
        </label>

        <div className='grid gap-4'>
          <FieldGroup className='grid gap-4'>
            <Controller
              control={form.control}
              name='fullName'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-full-name'>
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id='register-full-name'
                    placeholder='Value'
                    className='py-6'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='phoneNumber'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-phone-number'>
                    Phone Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id='register-phone-number'
                    placeholder='Value'
                    className='py-6'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      </div>

      <div className='grid gap-4 pt-6 lg:grid-cols-2'>
        <Controller
          control={form.control}
          name='educationLevel'
          render={({ field, fieldState }) => (
            <Field className='gap-1.5' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='register-education-level'>
                Level of Education
              </FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id='register-education-level' className='py-6'>
                  <SelectValue placeholder='Select your education' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='high-school'>
                    High school or GED
                  </SelectItem>
                  <SelectItem value='associate'>Associate degree</SelectItem>
                  <SelectItem value='bachelor'>Bachelor’s degree</SelectItem>
                  <SelectItem value='master'>Master’s degree</SelectItem>
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
              <FieldLabel htmlFor='register-field-of-study'>
                Field of Study
              </FieldLabel>
              <Input
                {...field}
                id='register-field-of-study'
                placeholder='Value'
                className='py-6'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className='pt-6'>
        <Controller
          control={form.control}
          name='yearsOfExperience'
          render={({ field, fieldState }) => (
            <Field className='gap-1.5' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='register-years-of-experience'>
                Years of Experience
              </FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id='register-years-of-experience'
                  className='py-6'
                >
                  <SelectValue placeholder='Select your experience' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='0-1'>0-1 years</SelectItem>
                  <SelectItem value='1-3'>1-3 years</SelectItem>
                  <SelectItem value='3-5'>3-5 years</SelectItem>
                  <SelectItem value='5-10'>5-10 years</SelectItem>
                  <SelectItem value='10+'>10+ years</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className='pt-6'>
        <Controller
          control={form.control}
          name='skills'
          render={({ field, fieldState }) => (
            <Field className='gap-1.5' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='register-skills'>Skills</FieldLabel>
              <Textarea
                {...field}
                id='register-skills'
                placeholder='Value'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className='flex w-full flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between'>
        <Button className='h-12 w-full' type='submit'>
          Continue
        </Button>
      </div>
    </form>
  );
}

const formSchema2 = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  companyInformation: z
    .string()
    .min(1, { message: 'Company information is required.' }),
  companyPicture: z.any().optional(),
  profilePicture: z.any().optional(),
});

export function RegisterFormEmployer() {
  const form = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      companyName: '',
      companyInformation: '',
      companyPicture: undefined,
      profilePicture: undefined,
    },
  });

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
      className='grid gap-0 rounded-3xl border border-blue-500/20 bg-background p-6 shadow-sm sm:p-8 divide-y divide-border'
    >
      <div className='grid gap-6 pb-10 lg:grid-cols-[200px_minmax(0,1fr)]'>
        <label
          htmlFor='register-profile-picture'
          className='grid cursor-pointer place-items-center rounded-3xl border border-blue-500/20 bg-muted p-6 shadow-sm transition hover:shadow-md'
        >
          <ImageIcon className='size-10' />
          <div className='mt-4 text-center text-sm'>Profile Picture</div>
          <p className='text-slate-500 text-sm dark:text-slate-400'>
            File types: JPEG, PNG
          </p>
          <input
            id='register-profile-picture'
            type='file'
            accept='.jpeg, .png'
            className='sr-only'
            {...form.register('profilePicture')}
          />
        </label>

        <div className='grid gap-4'>
          <FieldGroup className='grid gap-4'>
            <Controller
              control={form.control}
              name='fullName'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-full-name'>
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id='register-full-name'
                    placeholder='Value'
                    className='py-6'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='phoneNumber'
              render={({ field, fieldState }) => (
                <Field className='gap-1.5' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='register-phone-number'>
                    Phone Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id='register-phone-number'
                    placeholder='Value'
                    className='py-6'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      </div>

      <label
        htmlFor='register-company-picture'
        className='mx-auto flex h-[220px] w-full max-w-xl cursor-pointer items-center justify-center rounded-[2rem] border border-blue-500 bg-muted text-muted-foreground shadow-sm transition hover:shadow-md'
      >
        <div className='flex flex-col items-center justify-center gap-3 px-6'>
          <UploadCloud className='size-12 text-black-600' />
          <div className='font-medium text-lg text-slate-900 dark:text-slate-100'>
            Upload Your Company Picture
          </div>
          <p className='text-slate-500 text-sm dark:text-slate-400'>
            File type: JPEG, PNG
          </p>
          <input
            id='register-company-picture'
            type='file'
            accept='.jpeg, .png'
            className='sr-only'
            {...form.register('companyPicture')}
          />
        </div>
      </label>

      <div className='pt-6'>
        <Controller
          control={form.control}
          name='companyName'
          render={({ field, fieldState }) => (
            <Field className='gap-1.5' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='register-company-name'>
                Company Name
              </FieldLabel>
              <Input
                {...field}
                id='register-company-name'
                placeholder='Value'
                className='py-6'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className='pt-6'>
        <Controller
          control={form.control}
          name='companyInformation'
          render={({ field, fieldState }) => (
            <Field className='gap-1.5' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='register-company-information'>
                Company Information
              </FieldLabel>
              <Textarea
                {...field}
                id='register-company-information'
                placeholder='Value'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className='flex w-full flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between'>
        <Button className='h-12 w-full' type='submit'>
          Continue
        </Button>
      </div>
    </form>
  );
}
