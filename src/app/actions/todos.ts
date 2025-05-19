'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { AppError, ErrorType, formatErrorResponse } from '@/utils/error-handler';
import type { Todo } from '@/types/database';

export type TodoInput = {
  title: string;
};

export type TodoUpdateInput = {
  title?: string;
  is_complete?: boolean;
};

export type TodoResponse = {
  data?: Todo;
  error?: string;
};

/**
 * Create a new todo
 */
export async function createTodo(formData: FormData): Promise<TodoResponse> {
  try {
    const supabase = await createClient();
    const title = formData.get('title') as string;
    
    // Validate input
    if (!title || title.trim() === '') {
      throw new AppError({
        type: ErrorType.VALIDATION,
        message: 'Todo title cannot be empty'
      });
    }
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new AppError({
        type: ErrorType.AUTHENTICATION,
        message: 'You must be logged in to create todos',
        originalError: userError || new Error('No user found')
      });
    }
    
    // Insert the todo
    const { data, error } = await supabase
      .from('todos')
      .insert({ title, user_id: user.id })
      .select()
      .single();
    
    if (error) {
      throw new AppError({
        type: ErrorType.DATABASE,
        message: 'Failed to create todo',
        originalError: error
      });
    }
    
    // Revalidate the todos page to show the new todo
    revalidatePath('/todos');
    return { data };
  } catch (error) {
    return formatErrorResponse(error);
  }
}

/**
 * Get all todos for the current user
 */
export async function getTodos() {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new AppError({
        type: ErrorType.AUTHENTICATION,
        message: 'You must be logged in to view todos',
        originalError: userError || new Error('No user found')
      });
    }
    
    // Get todos for current user
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new AppError({
        type: ErrorType.DATABASE,
        message: 'Failed to fetch todos',
        originalError: error
      });
    }
    
    return { data };
  } catch (error) {
    return formatErrorResponse(error);
  }
}

/**
 * Update a todo
 */
export async function updateTodo(id: string, updates: TodoUpdateInput): Promise<TodoResponse> {
  try {
    const supabase = await createClient();
    
    // Validate title if it's being updated
    if (updates.title !== undefined && (!updates.title || updates.title.trim() === '')) {
      throw new AppError({
        type: ErrorType.VALIDATION,
        message: 'Todo title cannot be empty'
      });
    }
    
    // Update the todo
    const { data, error } = await supabase
      .from('todos')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new AppError({
        type: ErrorType.DATABASE,
        message: 'Failed to update todo',
        originalError: error
      });
    }
    
    // Revalidate the todos page
    revalidatePath('/todos');
    return { data };
  } catch (error) {
    return formatErrorResponse(error);
  }
}

/**
 * Toggle a todo's completion status
 */
export async function toggleTodoCompletion(id: string, isComplete: boolean): Promise<TodoResponse> {
  return updateTodo(id, { is_complete: !isComplete });
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new AppError({
        type: ErrorType.DATABASE,
        message: 'Failed to delete todo',
        originalError: error
      });
    }
    
    // Revalidate the todos page
    revalidatePath('/todos');
    return { success: true };
  } catch (error) {
    return formatErrorResponse(error);
  }
} 