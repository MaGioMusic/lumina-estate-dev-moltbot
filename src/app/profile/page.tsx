import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { ProfileStats } from './components/profileStats';
import AssignedAgentCard from './components/assignedAgentCard';
import { NotificationsPanel } from './components/notificationsPanel';
import { ProfileSkeleton } from './components/profileSkeleton';
import { getUserProfile } from '@/lib/profile';
import EditProfileHost from './components/editProfileHost';
import { ActivityTimeline } from './components/activityTimeline';
import { MyListingsSection } from './components/myListingsSection';
import { PerformanceOverviewSection } from './components/performanceOverviewSection';
import { SavedSearchesSection } from './components/savedSearchesSection';
import { AppointmentsSection } from './components/appointmentsSection';
import { InquiriesSection } from './components/inquiriesSection';
import { DocumentsSection } from './components/documentsSection';
import { QuickActionsCard } from './components/quickActionsCard';
import { RemindersCard } from './components/remindersCard';
import { MarketTrendsCard } from './components/marketTrendsCard';

async function resolveLocale(): Promise<string> {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('lumina_language')?.value;
  if (langCookie === 'en' || langCookie === 'ru' || langCookie === 'ka') return langCookie;
  return 'ka';
}

export default async function ProfilePage() {
  const locale = await resolveLocale();
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent locale={locale} />
    </Suspense>
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
      value:
        typeof appointmentsStat?.value === 'number'
          ? appointmentsStat.value
          : profile.appointments.length,
    },
    {
      id: 'saved-properties',
      labelKey: 'savedProperties' as const,
      value:
        typeof favoritesStat?.value === 'number' ? favoritesStat.value : profile.favorites.length,
    },
    {
      id: 'open-inquiries',
      labelKey: 'openInquiries' as const,
      value: profile.inquiries.length,
    },
  ];

  const unreadNotifications = profile.notifications.filter((notification) => !notification.isRead).length;

  return (
    <>
      <section
        id="dashboard-top"
        className="rounded-[40px] border border-white/60 bg-white/95 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70 sm:p-8"
      >
        <EditProfileHost
          initialUser={profile.user}
          overviewMetrics={heroMetrics}
          unreadNotifications={unreadNotifications}
          savedSearchesCount={profile.savedSearches.length}
        />
      </section>

      <section
        id="dashboard-stats"
        className="rounded-[36px] border border-white/60 bg-white/95 p-6 shadow-[0_18px_100px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70 sm:p-7"
      >
        <ProfileStats stats={profile.stats} />
      </section>

      <section
        id="dashboard-overview"
        className="grid gap-6 rounded-[40px] border border-white/60 bg-white/95 p-6 shadow-[0_26px_130px_rgba(15,23,42,0.1)] backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70 sm:p-8 2xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      >
        <div className="space-y-6">
          <MyListingsSection listings={profile.favorites} />
          <PerformanceOverviewSection
            favoritesCount={profile.favorites.length}
            appointments={profile.appointments}
            inquiries={profile.inquiries}
          />
          <SavedSearchesSection savedSearches={profile.savedSearches} />
          <div className="grid gap-6 lg:grid-cols-2">
            <AppointmentsSection appointments={profile.appointments} />
            <InquiriesSection inquiries={profile.inquiries} />
          </div>
          <DocumentsSection documents={profile.documents} />
        </div>

        <div className="space-y-6">
          <NotificationsPanel notifications={profile.notifications} />
          <QuickActionsCard />
          <div id="assigned-agent-card">
            <AssignedAgentCard agent={profile.user.assignedAgent} />
          </div>
          <RemindersCard appointments={profile.appointments} notifications={profile.notifications} />
          <MarketTrendsCard favorites={profile.favorites} />
          <ActivityTimeline activity={profile.activity} />
        </div>
      </section>
    </>
  );
}


