import { SignupForm } from '@/components/auth/signup-form';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Todo App',
  description: 'Create a new account to use the Todo App',
};

export default async function SignupPage() {
  // Check if user is already logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // If already logged in, redirect to todos
  if (session) {
    redirect('/todos');
  }
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <SignupForm />
    </main>
  );
} 