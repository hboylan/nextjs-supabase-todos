import { Metadata } from 'next';
import { NewTodoForm } from '@/components/todos/new-todo-form';
import { Suspense } from 'react';
import TodoList from '@/components/todos/todo-list';
import TodoListSkeleton from '@/components/todos/todo-list-skeleton';
import { FormErrorBoundary } from '@/components/ui/form-error-boundary';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Your Todos - Todo App',
  description: 'Manage your todos with ease',
};

export default function TodosPage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto max-w-3xl px-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Todo App</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Manage your tasks efficiently.
            </p>
            
            <FormErrorBoundary>
              <NewTodoForm />
            </FormErrorBoundary>
            
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