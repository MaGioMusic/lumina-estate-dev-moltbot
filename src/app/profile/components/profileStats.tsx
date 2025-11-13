'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  CalendarDots,
  ChatCircleDots,
  TrendUp,
} from '@phosphor-icons/react';
import type { ProfileStat } from '@/types/profile';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, ComponentType<{ size?: number }>> = {
  Star,
  Calendar: CalendarDots,
  Chat: ChatCircleDots,
  TrendUp,
};

interface ProfileStatsProps {
  stats: ProfileStat[];
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

type AccentKey = NonNullable<ProfileStat['accent']>;

const accentClasses: Record<
  AccentKey,
  {
    glow: string;
    text: string;
    ring: string;
    icon: string;
    iconBg: string;
    badge: string;
  }
> = {
  emerald: {
    glow: 'bg-emerald-400/20 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-300',
    ring: 'ring-emerald-500/20',
    icon: 'text-emerald-600 dark:text-emerald-200',
    iconBg: 'border-emerald-500/30 bg-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-500/15',
    badge: 'border-emerald-500/25 bg-emerald-500/12 dark:border-emerald-500/30 dark:bg-emerald-500/15',
  },
  amber: {
    glow: 'bg-amber-400/20 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-200',
    ring: 'ring-amber-500/20',
    icon: 'text-amber-600 dark:text-amber-200',
    iconBg: 'border-amber-500/30 bg-amber-500/10 dark:border-amber-500/30 dark:bg-amber-500/15',
    badge: 'border-amber-500/25 bg-amber-500/12 dark:border-amber-500/30 dark:bg-amber-500/15',
  },
  sky: {
    glow: 'bg-sky-400/20 dark:bg-sky-500/15',
    text: 'text-sky-600 dark:text-sky-300',
    ring: 'ring-sky-500/20',
    icon: 'text-sky-600 dark:text-sky-200',
    iconBg: 'border-sky-500/30 bg-sky-500/10 dark:border-sky-500/30 dark:bg-sky-500/15',
    badge: 'border-sky-500/25 bg-sky-500/12 dark:border-sky-500/30 dark:bg-sky-500/15',
  },
  rose: {
    glow: 'bg-rose-400/20 dark:bg-rose-500/15',
    text: 'text-rose-600 dark:text-rose-200',
    ring: 'ring-rose-500/20',
    icon: 'text-rose-600 dark:text-rose-200',
    iconBg: 'border-rose-500/30 bg-rose-500/10 dark:border-rose-500/30 dark:bg-rose-500/15',
    badge: 'border-rose-500/25 bg-rose-500/12 dark:border-rose-500/30 dark:bg-rose-500/15',
  },
  slate: {
    glow: 'bg-slate-400/15 dark:bg-slate-500/15',
    text: 'text-slate-600 dark:text-slate-200',
    ring: 'ring-slate-500/15',
    icon: 'text-slate-600 dark:text-slate-200',
    iconBg: 'border-slate-500/25 bg-slate-500/10 dark:border-slate-500/25 dark:bg-slate-500/15',
    badge: 'border-slate-500/20 bg-slate-500/12 dark:border-slate-500/25 dark:bg-slate-500/15',
  },
};

export function ProfileStats({ stats, isLoading }: ProfileStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`stat-skeleton-${idx}`}
            className="h-32 animate-pulse rounded-2xl border border-white/20 bg-white/40 dark:border-slate-800/50 dark:bg-slate-900/40"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const accent = stat.accent ? accentClasses[stat.accent] : accentClasses.slate;
        const trend = stat.change?.type;
        const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
        const IconComponent = stat.icon ? ICON_MAP[stat.icon] : undefined;
        const trendColor =
          trend === 'up'
            ? 'text-emerald-600 dark:text-emerald-300'
            : trend === 'down'
            ? 'text-rose-500 dark:text-rose-300'
            : 'text-slate-400 dark:text-slate-500';

        return (
          <motion.article
            key={stat.id}
            variants={cardVariants}
            className={cn(
              'relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:border-slate-800/60 dark:bg-slate-900/70',
              accent.ring
            )}
          >
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full blur-3xl',
                accent.glow
              )}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {stat.label}
                </p>
                <h3 className={cn('text-3xl font-semibold', accent.text)}>{stat.value}</h3>
              </div>
              {IconComponent && (
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl border text-xl shadow-sm',
                    accent.iconBg,
                    accent.icon
                  )}
                >
                  <IconComponent size={24} />
                </div>
              )}
            </div>

            <p className="mt-4 max-w-[85%] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {stat.description}
            </p>

            {stat.change && (
              <span
                className={cn(
                  'mt-5 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition dark:border-slate-700 dark:bg-slate-800/60',
                  accent.badge
                )}
              >
                <TrendIcon size={14} weight="bold" className={trendColor} />
                <span className={trendColor}>
                  {stat.change.percentage
                    ? `${stat.change.percentage}%`
                    : stat.change.label ?? ''}
                </span>
              </span>
            )}
          </motion.article>
        );
      })}
    </motion.div>
  );
}


