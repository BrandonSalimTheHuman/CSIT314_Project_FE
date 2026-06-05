import type { ReactNode } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import { EmployerBottomNav } from '@/components/employer-bottom-nav';
import { TopNav } from '@/components/top-nav';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AuthGuard requiredRole="employer">
      <main>
        <TopNav role="employer" />
        {children}
        <EmployerBottomNav />
      </main>
    </AuthGuard>
  );
}
