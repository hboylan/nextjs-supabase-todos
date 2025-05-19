import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { NewTodoForm } from '@/components/todos/new-todo-form';
import { Suspense } from 'react';

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
            <Suspense fallback={<div>Loading form...</div>}>
              <NewTodoForm />
            </Suspense>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h2 className="text-lg font-medium mb-4">Your Tasks</h2>
              <p className="text-gray-500">Your todos will appear here once you add them.</p>
              {/* Todo list will be added in the next task */}
            </div>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  );
} 