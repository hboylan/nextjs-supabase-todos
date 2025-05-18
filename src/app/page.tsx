import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  // Check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Organize your day with <span className="text-blue-600">Todo App</span>
          </h1>
          
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-600">
            A simple, fast, and effective way to keep track of your tasks. 
            Sign up for free and start managing your todos today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!session ? (
              <>
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/signin">
                  <Button size="lg" variant="outline">Sign In</Button>
                </Link>
              </>
            ) : (
              <Link href="/todos">
                <Button size="lg">Go to My Todos</Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      
      <div className="bg-white p-8 border-t">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold mb-2">Easy Task Management</h3>
              <p className="text-gray-600">Create, update, and complete tasks with a simple and intuitive interface.</p>
            </div>
            
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-600">Your data is protected with our secure authentication system.</p>
            </div>
            
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Changes to your todo list are synced immediately across all your devices.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
