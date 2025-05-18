import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Todo App',
  description: 'Set a new password for your Todo App account',
};

export default async function ResetPasswordPage() {
  // Check if the auth parameter exists - Supabase automatically adds hash parameters
  // We can't directly access these on the server due to Next.js's handling of hash fragments
  // This page will handle the token validation client-side through the Supabase SDK
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <ResetPasswordForm />
    </main>
  );
} 