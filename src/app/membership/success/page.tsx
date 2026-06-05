'use client';

import { useRouter } from 'next/navigation';

import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function MembershipSuccessPage() {
  const router = useRouter();

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-lg flex-col items-center gap-8 text-center'>
        <div className='flex flex-col items-center gap-4'>
          <CheckCircle className='h-16 w-16 text-[#0A65CC]' />
          <div className='space-y-2'>
            <h1 className='text-3xl font-semibold tracking-tight'>
              You're a member!
            </h1>
            <p className='text-sm leading-7 text-muted-foreground'>
              Your payment was successful. You now have unlimited recommended
              search results and priority discovery.
            </p>
          </div>
        </div>

        <div className='flex w-full flex-col gap-3 sm:flex-row sm:justify-center'>
          <Button
            className='rounded-full bg-[#0A65CC] text-white hover:bg-[#0A65CC]/90'
            onClick={() => router.push('/')}
          >
            Go to homepage
          </Button>
          <Button
            variant='outline'
            className='rounded-full'
            onClick={() => router.push('/membership')}
          >
            View membership plans
          </Button>
        </div>
      </div>
    </div>
  );
}
