'use client';

import { SessionIndicator } from '@/components/auth/session-indicator';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Todo App
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/todos" className="text-gray-600 hover:text-gray-900">
              My Todos
            </Link>
          </nav>
          
          <div>
            <SessionIndicator />
          </div>
        </div>
      </div>
    </header>
  );
} 