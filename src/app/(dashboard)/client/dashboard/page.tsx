import { redirect } from 'next/navigation';

// Legacy client dashboard route now redirects to the unified profile experience
export default function ClientDashboardRedirect() {
  redirect('/profile');
  return null;
}


