import {
  RegisterFormCandidate,
  RegisterFormEmployer,
} from '../../_components/register-form';
import Link from 'next/link';

export default async function RegisterV2({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  const isCandidate = type === 'candidate';
  const isEmployer = type === 'employer';
  return (
    <>
      <div className='mx-auto flex w-full max-w-6xl flex-col justify-center space-y-8 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='space-y-2 text-center -mt-4'>
          <h1 className='font-medium text-3xl'>Let’s Set You Up</h1>
          <h3 className='text-muted-foreground text-sm'>
            Fill in your personal information or upload your resume.
          </h3>
        </div>

        {isCandidate ? (
          <RegisterFormCandidate />
        ) : isEmployer ? (
          <RegisterFormEmployer />
        ) : (
          <div className='rounded-3xl border border-muted p-6 text-center'>
            <p className='text-lg font-medium'>Select an account type first.</p>
            <p className='mt-2 text-sm text-muted-foreground'>
              Please choose candidate or employer from the onboarding page.
            </p>
          </div>
        )}
      </div>

      <div className='absolute top-5 flex w-full justify-end px-8'>
        <div className='text-muted-foreground text-sm'>
          Already have an account?{' '}
          <Link prefetch={false} className='text-foreground' href='../login'>
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
