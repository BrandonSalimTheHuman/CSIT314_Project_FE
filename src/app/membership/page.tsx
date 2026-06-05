'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ApiError, apiFetch } from '@/lib/api/client';
import type { MembershipCheckoutOut } from '@/lib/api/types';

export default function MembershipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChooseMembership = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<MembershipCheckoutOut>('/memberships/checkout', {
        method: 'POST',
      });
      // Redirect to Stripe-hosted checkout
      window.location.href = data.url;
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : 'Failed to start checkout. Please log in first.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-6xl flex-col gap-10 text-center'>
        <div className='mx-auto max-w-3xl space-y-4'>
          <p className='text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground'>
            Membership Plans
          </p>
          <h1 className='text-4xl font-semibold tracking-tight sm:text-4xl'>
            Choose your plan
          </h1>
          <p className='mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-sm'>
            Choose the best plan whether you are searching for jobs or hiring
            candidates. The free plan gives core search and posting access,
            while membership unlocks unlimited recommended results and stronger
            candidate/job discovery.
          </p>
        </div>

        <div className='flex flex-col md:flex-row items-center md:items-start w-full justify-center gap-6 md:gap-0 p-8'>
          {/* Free plan */}
          <section className='relative z-0 w-full max-w-sm rounded-[2rem] border border-border bg-white p-8 shadow-sm'>
            <div className='space-y-4'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground'>
                  Free
                </p>
                <p className='mt-4 text-base text-slate-700'>
                  Ideal for job seekers and employers with basic search and
                  limited recommended results for jobs or candidate matches.
                </p>
              </div>

              <div className='flex items-end gap-2'>
                <p className='text-5xl font-semibold tracking-tight text-slate-950'>
                  $0
                </p>
                <span className='pb-1 text-sm text-muted-foreground'>/month</span>
              </div>

              <div className='rounded-3xl bg-slate-50 p-4 text-sm text-slate-700'>
                Recommended searches return up to{' '}
                <span className='font-semibold text-slate-900'>10 results</span>{' '}
                in the free tier.
              </div>

              <Button
                className='w-full rounded-full bg-slate-950 text-white hover:bg-slate-800'
                onClick={() => router.push('/')}
              >
                Start for free
              </Button>

              <div className='space-y-3 pt-6 text-sm text-slate-700'>
                <div className='flex items-start gap-3'>
                  <Check className='mt-1.5 h-4 w-4 shrink-0 text-slate-950' />
                  <p className='text-left'>
                    Up to 10 recommended search results for jobs or candidate matches
                  </p>
                </div>
                <div className='flex items-start gap-3'>
                  <Check className='mt-1.5 h-4 w-4 shrink-0 text-slate-950' />
                  <p className='text-left'>
                    Browse job alerts, hiring alerts, and recommendations
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Membership plan — blue */}
          <section className='relative z-10 w-full max-w-sm rounded-[2rem] bg-[#0A65CC] p-8 shadow-xl md:-ml-5 md:-mt-4 transition-transform hover:scale-[1.01]'>
            <div className='space-y-4'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.24em] text-blue-200'>
                  Membership
                </p>
                <p className='mt-4 text-base text-blue-100'>
                  Best for job seekers and employers who want unlimited
                  recommended results and priority discovery for jobs and
                  candidate matches.
                </p>
              </div>

              <div className='flex items-end gap-2'>
                <p className='text-5xl font-semibold tracking-tight text-white'>
                  $9
                </p>
                <span className='pb-1 text-sm text-blue-200'>/month</span>
              </div>

              <div className='rounded-3xl bg-white/10 p-4 text-sm text-blue-100'>
                Recommended searches are{' '}
                <span className='font-semibold text-white'>unlimited</span>{' '}
                with membership.
              </div>

              <Button
                className='w-full rounded-full bg-white font-semibold text-[#0A65CC] hover:bg-blue-50'
                onClick={handleChooseMembership}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Redirecting…
                  </>
                ) : (
                  'Choose membership'
                )}
              </Button>

              <div className='space-y-3 pt-6 text-sm text-blue-100'>
                <div className='flex items-start gap-3'>
                  <Check className='mt-1.5 h-4 w-4 shrink-0 text-white' />
                  <p className='text-left'>
                    Unlimited recommended search results for jobs and candidate matches
                  </p>
                </div>
                <div className='flex items-start gap-3'>
                  <Check className='mt-1.5 h-4 w-4 shrink-0 text-white' />
                  <p className='text-left'>
                    Access premium matching and priority discovery for both sides
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
