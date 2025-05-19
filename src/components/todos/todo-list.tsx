import { createClient } from '@/utils/supabase/server';
import TodoItem from './todo-item';
import { ErrorMessage } from '@/components/ui/error-message';

export default async function TodoList() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return (
        <ErrorMessage
          message="Failed to authenticate your session. Please try signing in again."
          variant="default"
          action={{ label: 'Sign In', href: '/signin' }}
        />
      );
    }
    
    if (!user) {
      return (
        <ErrorMessage
          message="Please sign in to view your todos."
          variant="default"
          action={{ label: 'Sign In', href: '/signin' }}
        />
      );
    }

    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
      return (
        <ErrorMessage
          message="We couldn't load your todos. Please try again later."
          details={error.message}
          variant="default"
          action={{ label: 'Refresh', href: '/todos' }}
        />
      );
    }

    if (!todos || todos.length === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-8 text-center" role="status" aria-live="polite">
          <svg 
            className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-1">No todos yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Create your first todo using the form above</p>
        </div>
      );
    }

    return (
      <div aria-label="Your todos" role="region" aria-live="polite" className="space-y-3 pb-6">
        <h3 className="sr-only">Your todo items</h3>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
          Showing {todos.length} todo{todos.length !== 1 ? 's' : ''}
        </p>
      </div>
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return (
      <ErrorMessage
        message="Something went wrong while trying to load your todos."
        variant="default"
        action={{ label: 'Refresh', href: '/todos' }}
      />
    );
  }
} 