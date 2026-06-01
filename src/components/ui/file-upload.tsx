'use client';

import * as React from 'react';
import { FileText, ImageIcon, UploadCloud, X } from 'lucide-react';

import { cn } from '@/lib/utils';

// ── helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── ProfilePictureUpload ──────────────────────────────────────────────────────

interface ProfilePictureUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  id?: string;
  'aria-invalid'?: boolean;
}

export function ProfilePictureUpload({
  value,
  onChange,
  className,
  id = 'profile-picture-upload',
  'aria-invalid': ariaInvalid,
}: ProfilePictureUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        'grid cursor-pointer place-items-center rounded-3xl border border-blue-500/20 bg-muted p-6 shadow-sm transition hover:shadow-md',
        ariaInvalid && 'border-destructive',
        className,
      )}
    >
      {value && previewUrl ? (
        <>
          <div className='relative'>
            <img
              src={previewUrl}
              alt='Profile picture preview'
              className='h-32 w-32 rounded-2xl object-cover'
            />
            <button
              type='button'
              onClick={handleRemove}
              className='absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow hover:bg-destructive/90'
              aria-label='Remove profile picture'
            >
              <X className='size-3' />
            </button>
          </div>
          <p className='mt-3 max-w-[140px] truncate text-center text-xs text-muted-foreground'>
            {value.name}
          </p>
          <p className='text-xs text-muted-foreground'>{formatBytes(value.size)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>Click to change</p>
        </>
      ) : (
        <>
          <ImageIcon className='size-10' />
          <div className='mt-4 text-center text-sm'>Profile Picture</div>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            File types: JPEG, PNG
          </p>
        </>
      )}
      <input
        ref={inputRef}
        id={id}
        type='file'
        accept='image/*'
        className='sr-only'
        onChange={handleChange}
      />
    </label>
  );
}

// ── CompanyPictureUpload ──────────────────────────────────────────────────────

interface CompanyPictureUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  id?: string;
  'aria-invalid'?: boolean;
}

export function CompanyPictureUpload({
  value,
  onChange,
  className,
  id = 'company-picture-upload',
  'aria-invalid': ariaInvalid,
}: CompanyPictureUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        'mx-auto flex w-full max-w-xl cursor-pointer items-center justify-center rounded-[2rem] border border-blue-500 bg-muted text-muted-foreground shadow-sm transition hover:shadow-md',
        ariaInvalid && 'border-destructive',
        value ? 'h-auto flex-col overflow-hidden p-0' : 'h-[220px]',
        className,
      )}
    >
      {value && previewUrl ? (
        <>
          <div className='relative w-full'>
            <img
              src={previewUrl}
              alt='Company picture preview'
              className='h-48 w-full rounded-[2rem] object-cover'
            />
            <button
              type='button'
              onClick={handleRemove}
              className='absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow hover:bg-destructive/90'
              aria-label='Remove company picture'
            >
              <X className='size-3.5' />
            </button>
          </div>
          <div className='flex w-full items-center gap-2 px-4 py-3'>
            <ImageIcon className='size-4 shrink-0 text-blue-500' />
            <p className='flex-1 truncate text-sm font-medium text-slate-900 dark:text-slate-100'>
              {value.name}
            </p>
            <p className='shrink-0 text-xs text-slate-500'>{formatBytes(value.size)}</p>
          </div>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center gap-3 px-6'>
          <UploadCloud className='size-12' />
          <div className='font-medium text-lg text-slate-900 dark:text-slate-100'>
            Upload Your Company Picture
          </div>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            File types: JPEG, PNG
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        id={id}
        type='file'
        accept='.jpeg,.jpg,.png,image/*'
        className='sr-only'
        onChange={handleChange}
      />
    </label>
  );
}

// ── ResumeUpload ──────────────────────────────────────────────────────────────

interface ResumeUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  id?: string;
}

export function ResumeUpload({
  value,
  onChange,
  className,
  id = 'resume-upload',
}: ResumeUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        'mx-auto flex w-full max-w-xl cursor-pointer items-center justify-center rounded-[2rem] border border-blue-500 bg-muted text-muted-foreground shadow-sm transition hover:shadow-md',
        value ? 'h-auto gap-4 px-6 py-5' : 'h-[220px]',
        className,
      )}
    >
      {value ? (
        <>
          <FileText className='size-10 shrink-0 text-blue-500' />
          <div className='flex-1 overflow-hidden'>
            <p className='truncate font-medium text-slate-900 dark:text-slate-100'>
              {value.name}
            </p>
            <p className='text-sm text-slate-500'>{formatBytes(value.size)}</p>
          </div>
          <button
            type='button'
            onClick={handleRemove}
            className='shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            aria-label='Remove resume'
          >
            <X className='size-4' />
          </button>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center gap-3 px-6'>
          <UploadCloud className='size-12' />
          <div className='font-medium text-lg text-slate-900 dark:text-slate-100'>
            Upload Your Resume
          </div>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            File type: PDF
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        id={id}
        type='file'
        accept='.pdf'
        className='sr-only'
        onChange={handleChange}
      />
    </label>
  );
}
