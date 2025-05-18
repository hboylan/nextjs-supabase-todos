import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Reset Successful - Todo App',
  description: 'Your password has been reset successfully',
};

export default function ResetSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Password Reset Successful</h2>
        
        <p className="text-gray-600 mb-6">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        
        <Link href="/signin">
          <Button fullWidth>Go to Sign In</Button>
        </Link>
      </div>
    </main>
  );
} 