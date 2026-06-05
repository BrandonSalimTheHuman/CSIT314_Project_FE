'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bold, Italic, Strikethrough, Underline, List } from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { toast } from 'sonner';

import { ApiError, apiFetch } from '@/lib/api/client';
import type { JobPostingCreate } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

const educationOptions = [
  'All',
  'High School',
  'Intermediate',
  'Graduation',
  'Master Degree',
  'Bachelor Degree',
];

const experienceOptions = [
  'All',
  'Freshers',
  '1-2 years',
  '2-4 years',
  '4-6 years',
  '6-8 years',
  '8-10 years',
  '10-15 years',
  '15+ years',
];

const jobLevelOptions = ['Entry Level', 'Mid Level', 'Expert Level'];

const jobTypeOptions = [
  'Full time',
  'Part time',
  'Internship',
  'Remote',
  'Temporary',
  'Contract based',
];

const salaryOptions = [
  '$50 - $1000',
  '$1000 - $2500',
  '$2500 - $4000',
  '$4000 - $6000',
  '$6000 - $8000',
  '$8000 - $10000',
  '$10000 - $15000',
  '$15000+',
];

const editorMenu = [
  {
    label: 'Bold',
    icon: Bold,
    command: (editor: ReturnType<typeof useEditor>) =>
      editor.chain().focus().toggleBold().run(),
    active: (editor: ReturnType<typeof useEditor>) => editor.isActive('bold'),
  },
  {
    label: 'Italic',
    icon: Italic,
    command: (editor: ReturnType<typeof useEditor>) =>
      editor.chain().focus().toggleItalic().run(),
    active: (editor: ReturnType<typeof useEditor>) => editor.isActive('italic'),
  },
  {
    label: 'Underline',
    icon: Underline,
    command: (editor: ReturnType<typeof useEditor>) =>
      editor.chain().focus().toggleUnderline().run(),
    active: (editor: ReturnType<typeof useEditor>) =>
      editor.isActive('underline'),
  },
  {
    label: 'Strikethrough',
    icon: Strikethrough,
    command: (editor: ReturnType<typeof useEditor>) =>
      editor.chain().focus().toggleStrike().run(),
    active: (editor: ReturnType<typeof useEditor>) => editor.isActive('strike'),
  },
  {
    label: 'Bullet list',
    icon: List,
    command: (editor: ReturnType<typeof useEditor>) =>
      editor.chain().focus().toggleBulletList().run(),
    active: (editor: ReturnType<typeof useEditor>) =>
      editor.isActive('bulletList'),
  },
];

/** Map the form's jobType display string to the backend WorkingMode enum when possible. */
function mapWorkMode(jobType: string): string {
  const map: Record<string, string> = {
    'Remote': 'remote',
    'Full time': 'onsite',
    'Part time': 'onsite',
    'Internship': 'onsite',
    'Temporary': 'onsite',
    'Contract based': 'onsite',
  };
  return map[jobType] ?? jobType;
}

/** Parse the experience option string into a number (years). */
function parseExperience(exp: string): number | undefined {
  if (exp === 'All' || exp === 'Freshers') return 0;
  const match = exp.match(/^(\d+)/);
  return match ? Number(match[1]) : undefined;
}

export default function EmployerJobPostPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [education, setEducation] = useState('All');
  const [experience, setExperience] = useState('All');
  const [jobType, setJobType] = useState('Full time');
  const [expiryDate, setExpiryDate] = useState('');
  const [jobLevel, setJobLevel] = useState('Entry Level');
  const [salary, setSalary] = useState('$50 - $1000');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p></p>',
    immediatelyRender: false,
  });

  const editorIsMounted = Boolean(editor);

  const handlePostJob = async () => {
    if (!jobTitle.trim()) {
      toast.error('Please enter a job title.');
      return;
    }

    setSubmitting(true);
    try {
      const body: JobPostingCreate = {
        title: jobTitle,
        company_info: editor?.getText() ?? '',
        location: jobLocation || undefined,
        work_mode: mapWorkMode(jobType) as JobPostingCreate['work_mode'],
        salary_range: salary,
        required_education: education === 'All' ? undefined : education,
        required_experience: parseExperience(experience),
        status: 'published',
        required_skills: [],
      };

      await apiFetch('/job-postings', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      toast.success('Job posted successfully!');
      router.push('/employer/jobs');
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Failed to post job. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-10'>
          <div className='mb-8 text-3xl font-semibold'>Post a job</div>

          <div className='grid gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='job-title'>Job Title</Label>
              <Input
                id='job-title'
                placeholder='Add job title, role, vacancies etc'
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                className='h-10'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='job-location'>Job Location</Label>
              <Textarea
                id='job-location'
                placeholder='Add job location'
                className='min-h-[100px]'
                value={jobLocation}
                onChange={(event) => setJobLocation(event.target.value)}
              />
            </div>
          </div>

          <div className='mt-10 grid gap-2'>
            <div className='mb-4 text-lg font-semibold'>
              Advanced Information
            </div>
            <div className='grid gap-4 sm:grid-cols-3'>
              <div className='grid gap-2'>
                <Label htmlFor='education'>Education</Label>
                <Select value={education} onValueChange={setEducation}>
                  <SelectTrigger id='education' className='w-full py-5'>
                    <SelectValue placeholder='Select...' />
                  </SelectTrigger>
                  <SelectContent>
                    {educationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='experience'>Year of Experience</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger id='experience' className='w-full py-5'>
                    <SelectValue placeholder='Select...' />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='job-type'>Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger id='job-type' className='w-full py-5'>
                    <SelectValue placeholder='Select...' />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='mt-4 grid gap-4 sm:grid-cols-3'>
              <div className='grid gap-2'>
                <Label htmlFor='expiry-date'>Expiration Date</Label>
                <Input
                  id='expiry-date'
                  type='date'
                  placeholder='DD/MM/YYYY'
                  value={expiryDate}
                  onChange={(event) => setExpiryDate(event.target.value)}
                  className='py-5'
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='job-level'>Job Level</Label>
                <Select value={jobLevel} onValueChange={setJobLevel}>
                  <SelectTrigger id='job-level' className='w-full py-5'>
                    <SelectValue placeholder='Select...' />
                  </SelectTrigger>
                  <SelectContent>
                    {jobLevelOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='salary'>Salary</Label>
                <Select value={salary} onValueChange={setSalary}>
                  <SelectTrigger id='salary' className='w-full py-5'>
                    <SelectValue placeholder='Select...' />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className='mt-10'>
            <div className='mb-4 text-lg font-semibold'>
              Description & Responsibility
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <div className='rounded-3xl border border-border bg-white shadow-sm'>
                <div className='flex flex-wrap gap-2 border-b border-border/70 bg-slate-100 p-3'>
                  {editorMenu.map((item) => {
                    const Icon = item.icon;
                    const active = editor ? item.active(editor) : false;

                    return (
                      <Button
                        key={item.label}
                        type='button'
                        variant={active ? 'secondary' : 'outline'}
                        size='sm'
                        className='min-w-[3rem]'
                        onClick={() => editor && item.command(editor)}
                        disabled={!editor}
                      >
                        <Icon className='size-4' />
                      </Button>
                    );
                  })}
                </div>
                <div
                  className='min-h-[220px] rounded-b-3xl'
                  onClick={() => editor?.commands.focus()}
                >
                  {editorIsMounted ? (
                    <EditorContent
                      className='min-h-[220px] focus:outline-none list-disc [&_.tiptap]:min-h-[220px] [&_.tiptap]:p-4 [&_.tiptap]:focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:list-item'
                      editor={editor}
                    />
                  ) : (
                    <Textarea
                      readOnly
                      value='Loading editor...'
                      className='min-h-[180px]'
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className='my-10' />

          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <Button
              type='button'
              variant='default'
              className='w-full bg-sky-700 py-6 text-lg font-semibold'
              disabled={submitting}
              onClick={handlePostJob}
            >
              {submitting ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
