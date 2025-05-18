import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Verified - Todo App',
  description: 'Your email has been successfully verified',
};

export default function EmailVerifiedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full h-16 w-16 flex items-center justify-center bg-green-100">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-4">Email Verified</h1>
        
        <p className="text-gray-600 text-center mb-6">
          Your email has been successfully verified. You can now access all features of the Todo App.
        </p>
        
        <div className="flex justify-center">
          <Link href="/todos" passHref>
            <Button>
              Go to Todos
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 