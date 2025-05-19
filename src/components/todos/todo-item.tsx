"use client";

import { useState, useTransition, useCallback } from 'react';
import { toggleTodoCompletion, updateTodo, deleteTodo } from '@/app/actions/todos';
import { Todo } from '@/types/database';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [optimisticTodo, setOptimisticTodo] = useState(todo);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);
  const { showToast } = useToast();
  
  // Retry mechanism for failed operations
  const withRetry = useCallback((action: () => Promise<any>, successMessage: string) => {
    return async () => {
      try {
        // Store the retry function
        setRetryAction(() => withRetry(action, successMessage));
        
        const result = await action();
        
        if (result.error) {
          showToast(result.error, 'error');
          return false;
        } else {
          // Only show success message if there was no error
          showToast(successMessage, 'success');
          // Clear the retry function on success
          setRetryAction(null);
          return true;
        }
      } catch (err) {
        showToast('An unexpected error occurred. Please try again.', 'error');
        return false;
      }
    };
  }, [showToast]);

  // Handle toggle completion
  const handleToggle = async () => {
    // Optimistic update
    const previousState = optimisticTodo.is_complete;
    setOptimisticTodo({
      ...optimisticTodo,
      is_complete: !optimisticTodo.is_complete
    });
    
    // Update in the database
    startTransition(async () => {
      const success = await withRetry(
        async () => toggleTodoCompletion(todo.id, previousState),
        `Todo marked as ${!previousState ? 'complete' : 'incomplete'}`
      )();
      
      if (!success) {
        // Revert optimistic update on error
        setOptimisticTodo(prev => ({
          ...prev,
          is_complete: previousState
        }));
      }
    });
  };
  
  // Handle title edit start
  const handleEditStart = () => {
    setIsEditing(true);
  };
  
  // Handle title update
  const handleTitleUpdate = () => {
    // Validate
    if (!title.trim()) {
      showToast('Todo title cannot be empty', 'error');
      return;
    }
    
    // If unchanged, just exit edit mode
    if (title === todo.title) {
      setIsEditing(false);
      return;
    }
    
    const previousTitle = optimisticTodo.title;
    
    // Optimistic update
    setOptimisticTodo({
      ...optimisticTodo,
      title: title
    });
    
    // Update in the database
    startTransition(async () => {
      const success = await withRetry(
        async () => updateTodo(todo.id, { title }),
        'Todo updated successfully'
      )();
      
      if (!success) {
        // Revert optimistic update on error
        setOptimisticTodo(prev => ({
          ...prev,
          title: previousTitle
        }));
        setTitle(previousTitle);
      }
      
      setIsEditing(false);
    });
  };
  
  // Handle key press in input field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title); // Reset to original
      setError(null);
    }
  };

  // Handle delete
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    
    startTransition(async () => {
      const success = await withRetry(
        async () => deleteTodo(todo.id),
        'Todo deleted successfully'
      )();
      
      if (!success) {
        setIsDeleting(false);
      }
      // The todo will be removed from the list automatically due to revalidation
    });
  };

  // If optimistic delete is active, don't render the component
  if (isDeleting) {
    return null;
  }

  return (
    <>
      <div 
        className={`flex items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 ${isPending ? 'opacity-70' : 'hover:shadow-md'}`}
        aria-busy={isPending}
      >
        <div className="flex items-center gap-4 flex-grow overflow-hidden">
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={optimisticTodo.is_complete}
              onChange={handleToggle}
              disabled={isPending}
              className={`h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${isPending ? 'cursor-wait' : 'cursor-pointer'}`}
              aria-label={optimisticTodo.is_complete ? 'Mark as incomplete' : 'Mark as complete'}
            />
          </div>
          <div className="min-w-0 flex-grow">
            {isEditing ? (
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleUpdate}
                  onKeyDown={handleKeyDown}
                  disabled={isPending}
                  className={`w-full bg-white dark:bg-gray-700 rounded px-2 py-1 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  autoFocus
                  aria-invalid={!!error}
                  aria-errormessage={error ? "title-error" : undefined}
                />
                {error && (
                  <p id="title-error" className="text-red-500 text-xs mt-1 absolute">{error}</p>
                )}
              </div>
            ) : (
              <div onClick={handleEditStart} className={`cursor-pointer ${isPending ? 'cursor-wait' : ''}`}>
                <span 
                  className={`block truncate text-sm md:text-base ${
                    optimisticTodo.is_complete 
                      ? 'line-through text-gray-400 dark:text-gray-500' 
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {optimisticTodo.title}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                  {new Date(optimisticTodo.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          {/* Status badge */}
          {!isEditing && (
            <span className={`text-xs ${optimisticTodo.is_complete ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded-full transition-colors`}>
              {optimisticTodo.is_complete ? 'Completed' : 'Active'}
            </span>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center">
            {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setTitle(todo.title);
                  setError(null);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                disabled={isPending}
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            )}
            
            {!isEditing && (
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                aria-label="Delete todo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            
            {/* Retry button */}
            {retryAction && (
              <button
                onClick={() => retryAction && retryAction()}
                className="ml-2 text-yellow-500 hover:text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full p-1"
                aria-label="Retry failed operation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Todo"
        message={`Are you sure you want to delete "${todo.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        destructive={true}
      />
    </>
  );
} 