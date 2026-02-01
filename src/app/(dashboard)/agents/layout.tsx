import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from '@/lib/auth/nextAuthOptions';

/**
 * Server-side authentication guard for agent dashboard
 * 
 * SECURITY: This runs on the server and validates the session
 * before rendering any client components. Bypassing localStorage
 * will not work here because the session is validated server-side
 * using HTTP-only cookies.
 */
export default async function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session server-side - this validates the JWT from HTTP-only cookies
  const session = await getServerSession(nextAuthOptions);

  // If no session exists, redirect to login
  if (!session?.user) {
    redirect('/login?callbackUrl=/agents/dashboard');
  }

  // Check if user has agent or admin role
  const userRole = (session.user as any).accountRole;
  const allowedRoles = ['AGENT', 'ADMIN'];
  
  if (!allowedRoles.includes(userRole)) {
    // User is authenticated but not authorized for this area
    redirect('/profile?error=unauthorized');
  }

  // User is authenticated and authorized - render the dashboard
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
