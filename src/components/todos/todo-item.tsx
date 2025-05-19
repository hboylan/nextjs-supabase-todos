"use client";

interface Todo {
  id: string;
  title: string;
  is_complete: boolean;
  created_at: string;
  // Add other fields as needed
}

export default function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4 flex-grow overflow-hidden">
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={todo.is_complete}
            readOnly
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-not-allowed"
            aria-label={todo.is_complete ? 'Completed' : 'Not completed'}
          />
        </div>
        <div className="min-w-0 flex-grow">
          <span 
            className={`block truncate text-sm md:text-base ${
              todo.is_complete 
                ? 'line-through text-gray-400 dark:text-gray-500' 
                : 'text-gray-800 dark:text-gray-200'
            }`}
          >
            {todo.title}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
            {new Date(todo.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-2">
        {/* Edit and Delete actions will be added in a future task */}
        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
          {todo.is_complete ? 'Completed' : 'Active'}
        </span>
      </div>
    </div>
  );
} 