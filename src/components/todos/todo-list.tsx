import { createClient } from '@/utils/supabase/server';
import TodoItem from './todo-item';

export default async function TodoList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="text-red-500">Please sign in to view your todos.</div>;

  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg">
        <p className="font-medium">Error loading todos</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-8 text-center">
        <svg 
          className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-1">No todos yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Create your first todo using the form above</p>
      </div>
    );
  }

  return (
    <div aria-label="Your todos" className="space-y-3 pb-6">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
        Showing {todos.length} todo{todos.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
} 