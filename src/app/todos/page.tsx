import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { NewTodoForm } from '@/components/todos/new-todo-form';
import { Suspense } from 'react';
import TodoList from '@/components/todos/todo-list';
import TodoListSkeleton from '@/components/todos/todo-list-skeleton';
import { FormErrorBoundary } from '@/components/ui/form-error-boundary';

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
              <FormErrorBoundary>
                <Suspense fallback={<TodoListSkeleton />}>
                  <TodoList />
                </Suspense>
              </FormErrorBoundary>
            </div>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  );
} 