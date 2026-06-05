import type { ReactNode } from 'react';

import {
  BriefcaseBusiness,
  MapPin,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className='grid h-dvh justify-center p-2 lg:grid-cols-2'>

        {/* ── Right panel – MyJob branding ───────────────────────────────── */}
        <div
          className='relative order-2 hidden h-full overflow-hidden rounded-3xl lg:flex lg:flex-col'
          style={{ background: 'linear-gradient(145deg, #0A65CC 0%, #0550a8 60%, #033d84 100%)' }}
        >
          {/* Decorative background circles */}
          <div className='pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5' />
          <div className='pointer-events-none absolute top-1/3 -left-16 h-56 w-56 rounded-full bg-white/5' />
          <div className='pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-white/5' />

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <div className='relative z-10 flex items-center gap-2 px-10 pt-10'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
              <BriefcaseBusiness className='size-5 text-white' />
            </div>
            <span className='font-bold text-white text-2xl'>
              My<span className='text-blue-200'>Job</span>
            </span>
          </div>

          {/* ── Main headline ──────────────────────────────────────────────── */}
          <div className='relative z-10 flex flex-1 flex-col justify-center px-10'>
            <h1 className='mb-4 font-bold text-white leading-tight' style={{ fontSize: '2.1rem' }}>
              Your next great<br />
              opportunity is<br />
              <span className='text-blue-200'>waiting for you.</span>
            </h1>
            <p className='mb-10 max-w-xs text-blue-100 text-sm leading-7'>
              Connect with top companies, discover roles that match your skills,
              and take the next step in your career — all in one place.
            </p>

            {/* Feature highlights */}
            <div className='space-y-3'>
              {[
                {
                  icon: <Zap className='size-4 text-yellow-300' />,
                  title: 'Smart Job Matching',
                  desc: 'Upload your resume and we parse it instantly to match you with the right roles',
                },
                {
                  icon: <Users className='size-4 text-green-300' />,
                  title: 'One Profile, Every Door',
                  desc: 'Build your profile once and let employers come to you',
                },
                {
                  icon: <MapPin className='size-4 text-pink-300' />,
                  title: 'Remote & On-site Roles',
                  desc: 'Find flexible work that fits your lifestyle',
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className='flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm'
                >
                  <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15'>
                    {icon}
                  </div>
                  <div>
                    <p className='font-semibold text-white text-sm'>{title}</p>
                    <p className='text-blue-200 text-xs leading-5'>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='pb-8' />
        </div>

        {/* ── Left panel – form ──────────────────────────────────────────── */}
        <div className='relative order-1 flex h-full overflow-y-auto'>{children}</div>
      </div>
    </main>
  );
}
