import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Todos - Todo App',
  description: 'Manage your todos with ease',
};

export default async function TodosPage() {
  // Check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // If not logged in, redirect to login
  if (!session) {
    redirect('/signin');
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Todos</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p>Welcome to your todos page. Todo functionality will be implemented soon.</p>
        </div>
      </div>
    </main>
  );
} 