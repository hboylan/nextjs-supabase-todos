import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Todos - Todo App',
  description: 'Manage your todos with ease',
};

export default async function TodosPage() {
  const supabase = await createClient();
  
  // Get user data for display
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <ProtectedRoute>
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Todos</h1>
            {user && (
              <p className="text-sm text-gray-600">
                Logged in as: {user.email}
              </p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p>Welcome to your todos page. Todo functionality will be implemented soon.</p>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
} 