import { Briefcase } from 'lucide-react';

export function EmployerBottomNav() {
  return (
    <footer className='grid gap-8 w-full px-6 py-10 bg-[#18191C] text-white lg:px-28 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <Briefcase className='size-8 text-white' />
          <div className='text-2xl font-bold'>MyJob</div>
        </div>
        <div className='mt-2'>
          <p className='text-gray-400'>
            Call now:{' '}
            <span className='text-white font-medium'>(319) 555-0115</span>
          </p>
          <p className='text-gray-500 text-sm mt-3 max-w-[250px] leading-relaxed'>
            6391 Elgin St. Celina, Delaware 10299, New York, United States of
            America
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <h1 className='text-lg font-medium'>Quick Link</h1>
        <div className='flex flex-col gap-3 text-gray-400 text-sm'>
          <a href='#' className='hover:text-white transition-colors'>
            About
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Contact
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Pricing
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Blog
          </a>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <h1 className='text-lg font-medium'>Candidate</h1>
        <div className='flex flex-col gap-3 text-gray-400 text-sm'>
          <a href='#' className='hover:text-white transition-colors'>
            Browse Jobs
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Browse Employers
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Candidate Dashboard
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Saved Jobs
          </a>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <h1 className='text-lg font-medium'>Employers</h1>
        <div className='flex flex-col gap-3 text-gray-400 text-sm'>
          <a href='#' className='hover:text-white transition-colors'>
            Post a Job
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Browse Candidates
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Employers Dashboard
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Applications
          </a>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <h1 className='text-lg font-medium'>Support</h1>
        <div className='flex flex-col gap-3 text-gray-400 text-sm'>
          <a href='#' className='hover:text-white transition-colors'>
            FAQs
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Privacy Policy
          </a>
          <a href='#' className='hover:text-white transition-colors'>
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
}
