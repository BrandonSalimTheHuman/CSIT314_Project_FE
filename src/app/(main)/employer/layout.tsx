import type { ReactNode } from 'react';

import { TopNav } from '@/components/top-nav';
import { EmployerBottomNav } from '@/components/employer-bottom-nav';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <TopNav role="employer" />
      {children}
      <EmployerBottomNav />
    </main>
  );
}
