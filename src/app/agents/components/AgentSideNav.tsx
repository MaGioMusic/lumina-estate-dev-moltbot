'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  House, Buildings, Briefcase, Users, Handshake, FileText, Calendar,
  Pulse, AddressBook, Storefront, Megaphone, Folder, Gear, Question
} from '@phosphor-icons/react';

type Item = { key: string; label: string; icon: any; tab?: string; href?: string };

export default function AgentSideNav() {
  const router = useRouter();
  const sp = useSearchParams();
  const activeTab = sp.get('tab') || 'dashboard';
  const [collapsed, setCollapsed] = useState(true);
  const [hovered, setHovered] = useState(false);
  const expanded = !collapsed || hovered;

  const items: Item[] = useMemo(() => ([
    { key: 'dashboard', label: 'Dashboard', icon: House, tab: 'dashboard' },
    { key: 'properties', label: 'Properties', icon: Buildings, tab: 'properties' },
    { key: 'projects', label: 'Projects', icon: Briefcase, tab: 'projects' },
    { key: 'clients', label: 'Leads', icon: Users, tab: 'clients' },
    { key: 'offers', label: 'Offers', icon: Handshake, tab: 'offers' },
    { key: 'agreements', label: 'Agreements', icon: FileText, tab: 'agreements' },
    { key: 'calendar', label: 'Calendar', icon: Calendar, tab: 'calendar' },
    { key: 'analytics', label: 'Analytics', icon: Pulse, tab: 'analytics' },
    { key: 'contacts', label: 'Contacts & Orgs', icon: AddressBook, tab: 'contacts' },
    { key: 'brokers', label: 'Brokers & Agents', icon: Storefront, tab: 'brokers' },
    { key: 'campaigns', label: 'Campaigns', icon: Megaphone, tab: 'campaigns' },
    { key: 'documents', label: 'Documents', icon: Folder, tab: 'documents' },
    { key: 'settings', label: 'Settings', icon: Gear, tab: 'settings' },
    { key: 'help', label: 'Help', icon: Question, tab: 'help' },
  ]), []);

  const go = (it: Item) => {
    if (it.href) router.push(it.href);
    else if (it.tab) router.push(`/agents?tab=${it.tab}`);
  };

  const SHOW_HANDLE = process.env.NEXT_PUBLIC_FLAG_AGENT_SIDEBAR_HANDLE === 'true';

  return (
    <div className="flex-shrink-0 relative">
      <motion.aside
        className="sticky top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
        initial={false}
        animate={{ width: expanded ? 240 : 64 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="p-2 flex items-center justify-between">
          <span className={`text-sm font-semibold text-gray-700 dark:text-gray-200 ${expanded ? '' : 'opacity-0 pointer-events-none'}`}>
            Navigation
          </span>
          <button
            className="text-gray-500 hover:text-orange-500 p-1"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
            onClick={() => setCollapsed(v => !v)}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        <nav className="px-2 space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = activeTab === it.tab;
            return (
              <button
                key={it.key}
                onClick={() => go(it)}
                className={`w-full flex items-center ${expanded ? 'gap-3 justify-start px-3' : 'justify-center px-0'} py-2 rounded-lg transition 
                  ${active ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60'}`}
                title={!expanded ? it.label : undefined}
              >
                <Icon className="w-5 h-5" weight={active ? 'fill' : 'regular'} />
                {expanded && <span className="text-sm truncate">{it.label}</span>}
              </button>
            );
          })}
        </nav>
        {SHOW_HANDLE && collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="absolute top-1/2 -right-3 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-500 text-white shadow-md opacity-80 hover:opacity-100 focus:opacity-100 transition flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}
      </motion.aside>
    </div>
  );
}


