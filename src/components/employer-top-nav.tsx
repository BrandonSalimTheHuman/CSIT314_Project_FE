import { Briefcase, Search, UserCircle2 } from 'lucide-react';

import { Input } from '@/components/ui/input';

export function EmployerTopNav() {
  return (
    <div className='top-0 z-20 px-2 border-b border-border bg-background/95 backdrop-blur-sm'>
      <div className='mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
        <div className='flex items-center gap-1'>
          <div className='flex h-11 w-11 items-center justify-center rounded-2xl text-primary'>
            <Briefcase color='#0A65CC' className='size-6' />
          </div>
          <div className='text-lg font-semibold'>MyJob</div>
        </div>

        <div className='relative flex w-full items-center max-w-3xl sm:w-[600px]'>
          <Search className='pointer-events-none absolute left-3 size-4 text-muted-foreground' />
          <Input
            className='pl-10'
            type='search'
            placeholder='Job title, keyword, company'
            aria-label='Search jobs'
          />
        </div>

        <div className='flex items-center gap-3'>
          <button
            type='button'
            className='flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-foreground'
            aria-label='Profile'
          >
            <UserCircle2 className='size-7' />
          </button>
        </div>
      </div>
    </div>
  );
}
