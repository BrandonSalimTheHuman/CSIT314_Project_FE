import type { ReactNode } from 'react';

import { CandidateTopNav } from '@/components/candidate-top-nav';
import { EmployerBottomNav } from '@/components/employer-bottom-nav';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <CandidateTopNav />
      {children}
      <EmployerBottomNav />
    </main>
  );
}
