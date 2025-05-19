'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTodo } from '@/app/actions/todos';
import { ValidationErrorDisplay } from '@/components/ui/validation-error-display';
import { ValidationError } from '@/utils/validation';
import { useToast } from '@/components/ui/toast';

export function NewTodoForm() {
  const [title, setTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  
  // Focus the input on initial render
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Client-side validation
  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];
    
    if (!title || title.trim() === '') {
      errors.push({ field: 'title', message: 'Todo title cannot be empty' });
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset validation errors
    setValidationErrors([]);
    
    // Run client-side validation
    if (!validateForm()) {
      return;
    }
    
    // Create FormData object
    const formData = new FormData();
    formData.append('title', title);
    
    // Submit the form
    startTransition(async () => {
      const result = await createTodo(formData);
      
      if ('error' in result && result.error) {
        setValidationErrors([{ field: 'title', message: result.error }]);
        showToast(result.error, 'error');
      } else {
        // Clear form after successful submission
        setTitle('');
        showToast('Todo added successfully!', 'success');
        
        // Focus the input field after form submission
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6" data-testid="new-todo-form">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Add a New Todo</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-grow">
            <Input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              error={validationErrors.some(e => e.field === 'title')}
              disabled={isPending}
              fullWidth
              aria-label="New todo title"
              data-testid="new-todo-input"
            />
            <ValidationErrorDisplay errors={validationErrors} field="title" />
          </div>
          <Button 
            type="submit" 
            disabled={isPending}
            isLoading={isPending}
            data-testid="add-todo-button"
          >
            Add Todo
          </Button>
        </div>
      </div>
    </form>
  );
} 