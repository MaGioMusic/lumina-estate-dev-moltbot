import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { getUserProfile } from '@/lib/profile';
import { ProfileStats } from './components/profileStats';
import { PerformanceOverviewSection } from './components/performanceOverviewSection';
import { ProfileSkeleton } from './components/profileSkeleton';
import EditProfileHost from './components/editProfileHost';
import { NotificationsPanel } from './components/notificationsPanel';
import AssignedAgentCard from './components/assignedAgentCard';
import { QuickActionsCard } from './components/quickActionsCard';

// Icons
import { 
  HouseLine, 
  CalendarCheck, 
  ChatsCircle,
  FileText,
  Gear,
  SignOut
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

async function resolveLocale(): Promise<string> {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('lumina_language')?.value;
  if (langCookie === 'en' || langCookie === 'ru' || langCookie === 'ka') return langCookie;
  return 'ka';
}

export default async function ProfilePage() {
  const locale = await resolveLocale();
  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-8 dark:bg-slate-950/50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProfileContent({ locale }: { locale: string }) {
  const profile = await getUserProfile({ locale });
  const favoritesStat = profile.stats.find((stat) => stat.id === 'favorites');
  const appointmentsStat = profile.stats.find((stat) => stat.id === 'appointments');

  const heroMetrics = [
    {
      id: 'active-listings',
      labelKey: 'activeListings' as const,
      value: typeof appointmentsStat?.value === 'number' ? appointmentsStat.value : profile.appointments.length,
    },
    {
      id: 'saved-properties',
      labelKey: 'savedProperties' as const,
      value: typeof favoritesStat?.value === 'number' ? favoritesStat.value : profile.favorites.length,
    },
    {
      id: 'open-inquiries',
      labelKey: 'openInquiries' as const,
      value: profile.inquiries.length,
    },
  ];

  const unreadNotifications = profile.notifications.filter((notification) => !notification.isRead).length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* --- COLUMN 1: Main Profile & Navigation (Left Sidebar feel but part of grid) --- */}
      <div className="lg:col-span-3 space-y-6">
        {/* User Profile Card */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
           <EditProfileHost
              initialUser={profile.user}
              overviewMetrics={heroMetrics}
              unreadNotifications={unreadNotifications}
              savedSearchesCount={profile.savedSearches.length}
            />
        </section>

        {/* Agent Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
           <AssignedAgentCard agent={profile.user.assignedAgent} />
        </div>

        {/* Quick Navigation Menu (Bento style links) */}
        <div className="grid gap-2">
          <MenuLink href="/profile/listings" icon={HouseLine} label="My Listings" count={profile.favorites.length} />
          <MenuLink href="/profile/appointments" icon={CalendarCheck} label="Appointments" count={profile.appointments.length} />
          <MenuLink href="/profile/inquiries" icon={ChatsCircle} label="Inquiries" count={profile.inquiries.length} />
          <MenuLink href="/profile/documents" icon={FileText} label="Documents" count={profile.documents.length} />
        </div>
      </div>

      {/* --- COLUMN 2: Main Content & Stats (Center/Right) --- */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* Row 1: Stats Grid */}
        <ProfileStats stats={profile.stats} />

        {/* Row 2: Chart & Notifications */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PerformanceOverviewSection 
              favoritesCount={profile.favorites.length}
              appointments={profile.appointments}
              inquiries={profile.inquiries}
            />
          </div>
          <div className="lg:col-span-1">
             <NotificationsPanel notifications={profile.notifications} />
          </div>
        </div>

        {/* Row 3: Quick Actions Row */}
        <div className="grid gap-6 lg:grid-cols-3">
           <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
              <QuickActionsCard />
           </div>
           {/* Placeholder for future widget or ad */}
           <div className="flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
              <p className="text-sm text-slate-400 font-medium">Coming Soon</p>
           </div>
        </div>

      </div>
    </div>
  );
}

function MenuLink({ href, icon: Icon, label, count }: any) {
  return (
    <Link href={href} className="group flex items-center justify-between rounded-2xl border border-transparent bg-white px-5 py-4 text-slate-600 shadow-sm transition-all hover:border-slate-200 hover:shadow-md dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-900 transition-colors group-hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:group-hover:bg-slate-700">
          <Icon size={20} weight="duotone" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && (
        <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {count}
        </span>
      )}
    </Link>
  )
}
