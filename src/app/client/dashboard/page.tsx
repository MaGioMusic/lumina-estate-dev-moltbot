'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookmarkSimple, Bell, CalendarCheck, ChatCircleDots, FileText, Heart, Plus, TrendUp } from '@phosphor-icons/react';

interface SavedSearch { id: string; name: string; query: string; alerts: boolean; }
interface Favorite { id: string; title: string; note?: string; }
interface Viewing { id: string; property: string; date: string; time: string; }

export default function ClientDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    { id: '1', name: 'ვაკე • 2-საძინებელი • ₾250k', query: 'district=vake&beds=2&price<=250000', alerts: true },
  ]);
  const [favorites, setFavorites] = useState<Favorite[]>([
    { id: 'p1', title: 'ვაკე • თბილი ინტერიერი', note: 'ნახვა შაბათს' },
    { id: 'p2', title: 'საბურთალო • ახალი კორპუსი' }
  ]);
  const [viewings] = useState<Viewing[]>([
    { id: 'v1', property: 'ვაკე • თბილი ინტერიერი', date: '2025-08-25', time: '15:00' }
  ]);

  const addSavedSearch = () => setSavedSearches(prev => [...prev, { id: String(Date.now()), name: 'ახალი ძიება', query: '', alerts: false }]);
  const toggleAlert = (id: string) => setSavedSearches(prev => prev.map(s => s.id === id ? { ...s, alerts: !s.alerts } : s));
  const addNote = (id: string, note: string) => setFavorites(prev => prev.map(f => f.id === id ? { ...f, note } : f));

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">მოგესალმებით, {user?.name}</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">თქვენი პირადი დეშბორდი — შენახული ძიებები, ფავორიტები, დათვალიერებები და დოკუმენტები.</p>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[
            { icon: Heart, title: 'ფავორიტები', value: favorites.length },
            { icon: CalendarCheck, title: 'დათვალიერებები', value: viewings.length },
            { icon: Bell, title: 'ალერტები', value: savedSearches.filter(s => s.alerts).length },
            { icon: TrendUp, title: 'ბაზრის ანალიზი', value: 'ახალი' }
          ].map((card, idx) => (
            <motion.div key={idx} whileHover={{ y: -2 }} className="bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-xl p-5 flex items-center gap-3">
              <card.icon className="w-6 h-6 text-[#F08336]" />
              <div>
                <div className="text-sm text-gray-500">{card.title}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">{card.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Saved Searches & Scheduler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <section className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"><BookmarkSimple className="w-5 h-5" /> შენახული ძიებები</h2>
              <button onClick={addSavedSearch} className="px-3 py-1.5 rounded-lg bg-[#F08336] text-white text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> დამატება</button>
            </div>
            <div className="mt-4 space-y-3">
              {savedSearches.map(s => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/10">
                  <div className="text-sm text-gray-800 dark:text-gray-200">{s.name}</div>
                  <button onClick={() => toggleAlert(s.id)} className={`px-2 py-1 rounded text-xs ${s.alerts ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>{s.alerts ? 'ალერტები ჩ' : 'ალერტები გამ'}</button>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"><CalendarCheck className="w-5 h-5" /> დათვალიერებების განრიგი</h2>
            <div className="mt-4 space-y-3">
              {viewings.map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg:white/10">
                  <div className="text-sm text-gray-800 dark:text-gray-200">{v.property}</div>
                  <div className="text-xs text-gray-500">{v.date} • {v.time}</div>
                </div>
              ))}
            </div>
            <button className="mt-4 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm">ახალი დათვალიერება</button>
          </section>
        </div>

        {/* Favorites with notes & Chat link */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <section className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text:white flex items-center gap-2"><Heart className="w-5 h-5" /> ფავორიტები და ნოტები</h2>
            <div className="mt-4 space-y-3">
              {favorites.map(f => (
                <div key={f.id} className="rounded-lg border border-black/10 dark:border-white/10 p-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{f.title}</div>
                  <input defaultValue={f.note} placeholder="დამატე შენიშვნა..." onBlur={(e) => addNote(f.id, e.target.value)} className="mt-2 w-full px-3 py-2 rounded bg-black/5 dark:bg-white/10 text-sm outline-none" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-black/10 dark:border:white/10 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text:white flex items-center gap-2"><ChatCircleDots className="w-5 h-5" /> ჩატი აგენტთან</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">მოაზერბად即时 დაკავშირება აგენტთან, ფაილების გაგზავნა და შეხვედრის შეთანხმება.</p>
            <button onClick={() => router.push('/agents/chat')} className="mt-4 px-4 py-2 rounded-lg bg-[#F08336] text-white text-sm">გახსენით ჩატი</button>
          </section>
        </div>

        {/* Analytics & Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <section className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text:white flex items-center gap-2"><TrendUp className="w-5 h-5" /> Rent vs Buy / ფასები</h2>
            <div className="mt-4 h-48 rounded-lg bg-gradient-to-b from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-500">Chart Placeholder</div>
          </section>
          <section className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text:white flex items-center gap-2"><FileText className="w-5 h-5" /> დოკუმენტები & შეთავაზებები</h2>
            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-black/5 dark:bg-white/10 text-sm">კონტრაქტი — ვერსია 1.pdf</div>
              <div className="p-3 rounded-lg bg-black/5 dark:bg-white/10 text-sm">KYC • ID.png</div>
              <div className="p-3 rounded-lg bg-black/5 dark:bg:white/10 text-sm">შეთავაზება • სტატუსი: განხილვაში</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


