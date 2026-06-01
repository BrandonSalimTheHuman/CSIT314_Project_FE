import type { ReactNode } from 'react';

import { EmployerTopNav } from '@/components/employer-top-nav';
import { EmployerBottomNav } from '@/components/employer-bottom-nav';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <EmployerTopNav />
      {children}
      <EmployerBottomNav />
    </main>
  );
}
