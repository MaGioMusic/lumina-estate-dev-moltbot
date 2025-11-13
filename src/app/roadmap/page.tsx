'use client';

import Image, { type StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapTrifold } from '@phosphor-icons/react';
import PageSnapshotEmitter from '@/app/components/PageSnapshotEmitter';
import { GradualSpacing } from '@/components/ui/gradual-spacing';
import { RevealText } from '@/components/reveal-text';
import luminaAppPreview from '@/../public/images/photos/Roadmap Photos/Lumina App Preview.png';
import advancedAnalytics from '@/../public/images/photos/Roadmap Photos/Advanced Analytics.png';

type RoadmapStatus = 'completed' | 'in-progress' | 'planned';

const STATUS_STYLES: Record<RoadmapStatus, {
  badge: string;
  pill: string;
  glow: string;
  ring: string;
  dot: string;
}> = {
  completed: {
    badge: 'bg-emerald-500 text-white',
    pill: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
    glow: 'from-emerald-400/50 via-emerald-500/20 to-transparent',
    ring: 'border-emerald-300/50 dark:border-emerald-500/40',
    dot: 'bg-emerald-400'
  },
  'in-progress': {
    badge: 'bg-orange-500 text-white',
    pill: 'bg-orange-50 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300',
    glow: 'from-orange-400/50 via-orange-500/20 to-transparent',
    ring: 'border-orange-300/50 dark:border-orange-500/40',
    dot: 'bg-orange-400'
  },
  planned: {
    badge: 'bg-slate-500 text-white',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-300',
    glow: 'from-slate-400/40 via-slate-500/15 to-transparent',
    ring: 'border-slate-300/40 dark:border-slate-500/30',
    dot: 'bg-slate-400'
  }
};

type RoadmapBlueprintItem = {
  quarter: string;
  status: RoadmapStatus;
  titleKey: string;
  itemKeys: string[];
  image: string | StaticImageData;
  imageAltKey: string;
};

const HERO_LETTER_IMAGES = [
  '/images/photos/Roadmap Photos/Lumina App Preview.png',
  '/images/photos/Roadmap Photos/Lumina App Preview 1.png',
  '/images/photos/Roadmap Photos/Lumina App Preview 2.png',
  '/images/photos/Roadmap Photos/Advanced Analytics.png'
];

export default function RoadmapPage() {
  const { t } = useLanguage();

  const roadmapBlueprint: RoadmapBlueprintItem[] = [
    {
      quarter: 'Q1 2025',
      status: 'completed',
      titleKey: 'roadmapQuarter1Title',
      itemKeys: [
        'roadmapQuarter1Item1',
        'roadmapQuarter1Item2',
        'roadmapQuarter1Item3',
        'roadmapQuarter1Item4'
      ],
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
      imageAltKey: 'roadmapQuarter1ImageAlt'
    },
    {
      quarter: 'Q2 2025',
      status: 'in-progress',
      titleKey: 'roadmapQuarter2Title',
      itemKeys: [
        'roadmapQuarter2Item1',
        'roadmapQuarter2Item2',
        'roadmapQuarter2Item3',
        'roadmapQuarter2Item4'
      ],
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
      imageAltKey: 'roadmapQuarter2ImageAlt'
    },
    {
      quarter: 'Q3 2025',
      status: 'planned',
      titleKey: 'roadmapQuarter3Title',
      itemKeys: [
        'roadmapQuarter3Item1',
        'roadmapQuarter3Item2',
        'roadmapQuarter3Item3',
        'roadmapQuarter3Item4'
      ],
      image: luminaAppPreview,
      imageAltKey: 'roadmapQuarter3ImageAlt'
    },
    {
      quarter: 'Q4 2025',
      status: 'planned',
      titleKey: 'roadmapQuarter4Title',
      itemKeys: [
        'roadmapQuarter4Item1',
        'roadmapQuarter4Item2',
        'roadmapQuarter4Item3',
        'roadmapQuarter4Item4'
      ],
      image: advancedAnalytics,
      imageAltKey: 'roadmapQuarter4ImageAlt'
    }
  ];

  const statusLabels: Record<RoadmapStatus, string> = {
    completed: t('roadmapStatusCompleted'),
    'in-progress': t('roadmapStatusInProgress'),
    planned: t('roadmapStatusPlanned')
  };

  const roadmapItems = roadmapBlueprint.map((section) => ({
    quarter: section.quarter,
    status: section.status,
    title: t(section.titleKey),
    items: section.itemKeys.map((key) => t(key)),
    image: section.image,
    imageAlt: t(section.imageAltKey)
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PageSnapshotEmitter
        page="roadmap"
        title="Roadmap — Lumina Estate"
        summary="პროექტის განვითარების გეგმა და მომავალი ფუნქციები."
        data={{ roadmapItems: roadmapItems.length }}
        auto
      />
      
      {/* Hero Section */}
      <div className="relative flex h-[400px] items-center overflow-hidden bg-gradient-to-r from-orange-500 to-red-500">
        <div className="absolute inset-0 bg-black/30" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          className="container relative z-10 mx-auto max-w-6xl px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 shadow-inner shadow-black/20 backdrop-blur-lg"
              >
                <MapTrifold className="h-7 w-7 text-white" weight="fill" />
              </motion.div>
              <RevealText
                text={t('roadmap')}
                textColor="text-white"
                overlayColor="text-orange-400"
                fontSize="text-7xl sm:text-8xl lg:text-9xl"
                letterDelay={0.06}
                overlayDelay={0.08}
                overlayDuration={0.45}
                springDuration={550}
                letterImages={HERO_LETTER_IMAGES}
                containerClassName="justify-start"
                letterClassName="leading-tight"
              />
            </div>
            <GradualSpacing
              text={t('roadmapHeroDescription')}
              className="text-xl font-medium leading-relaxed text-white/90"
              containerClassName="justify-start max-w-3xl"
              delayMultiple={0.025}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Roadmap Timeline */}
      <section className="relative py-24 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-100/40 via-transparent to-white dark:from-orange-500/10 dark:via-transparent dark:to-gray-950" />
        <div className="absolute inset-y-24 left-1/2 w-[480px] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-br from-orange-200/20 via-transparent to-orange-400/20 dark:from-orange-500/10 dark:via-transparent dark:to-orange-600/20" />

        <div className="container relative z-10 mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, ease: [0.33, 1, 0.68, 1] }}
            className="flex flex-col items-start gap-6 pb-12"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-500 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-orange-300">
              {t('roadmapTimelineLabel')}
            </span>
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-white sm:text-5xl">
              {t('roadmapTimelineTitle')}
            </h2>
            <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              {t('roadmapTimelineSubtitle')}
            </p>
          </motion.div>

          <div className="relative md:ml-8">
            <div className="pointer-events-none absolute inset-y-0 left-6 hidden w-px bg-gradient-to-b from-orange-400/50 via-white/50 to-transparent dark:from-orange-400/40 dark:via-white/10 dark:to-transparent md:block" />

            <div className="space-y-12">
              {roadmapItems.map((item, index) => {
                const style = STATUS_STYLES[item.status] ?? STATUS_STYLES.planned;

                return (
                  <motion.div
                    key={item.quarter}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: [0.33, 1, 0.68, 1] }}
                    className="relative md:pl-24"
                  >
                    <div className="absolute left-0 top-10 hidden md:block">
                      <span className={`absolute -left-1 top-1 h-14 w-14 rounded-full blur-xl bg-gradient-to-br ${style.glow}`} />
                      <span className={`relative flex h-14 w-14 items-center justify-center rounded-full border bg-white/90 text-base font-semibold text-gray-900 shadow-lg shadow-orange-500/10 dark:bg-gray-950/80 dark:text-white dark:shadow-orange-500/5 ${style.ring}`}>
                        {index + 1}
                      </span>
                    </div>

                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="rounded-3xl border border-white/60 bg-white/80 shadow-[0_20px_55px_-35px_rgba(249,115,22,0.65)] backdrop-blur-xl transition-all duration-300 hover:border-white dark:border-white/10 dark:bg-gray-950/70 dark:hover:border-white/20"
                    >
                      <div className="flex flex-col gap-6 p-8 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold ${style.pill}`}>
                            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                            {item.quarter}
                          </span>
                          <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
                            {item.title}
                          </h3>
                        </div>

                        <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${style.badge}`}>
                          {statusLabels[item.status]}
                        </span>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="relative mx-8 mb-6 overflow-hidden rounded-2xl border border-white/40 bg-gray-100/60 shadow-sm dark:border-white/5 dark:bg-gray-900/40"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-black/0 to-white/20 dark:from-black/40 dark:via-black/10 dark:to-white/10" />
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          width={640}
                          height={360}
                          sizes="(min-width: 1024px) 480px, 100vw"
                          className="h-48 w-full object-cover sm:h-52"
                          priority={item.quarter === 'Q1 2025'}
                        />
                        <div className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-700 shadow-sm backdrop-blur dark:bg-black/60 dark:text-gray-200">
                          <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-500" />
                          {item.quarter}
                        </div>
                      </motion.div>

                      <div className="px-8 pb-8">
                        <div className="grid gap-3 sm:grid-cols-2">
                          {item.items.map((feature) => (
                            <motion.div
                              key={feature}
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="group flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:border-orange-200 hover:bg-orange-50/80 hover:text-gray-900 dark:border-white/5 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:border-orange-500/40 dark:hover:bg-orange-500/10"
                            >
                              <span className="flex h-2.5 w-2.5 flex-none rounded-full bg-gradient-to-br from-orange-400 to-orange-500 opacity-90 transition-all group-hover:scale-110 group-hover:opacity-100" />
                              <span>{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="mb-4 text-3xl font-bold text-gray-900 dark:text-white"
          >
            {t('roadmapCtaTitle')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="mb-8 text-lg text-gray-600 dark:text-gray-300"
          >
            {t('roadmapCtaDescription')}
          </motion.p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:from-orange-600 hover:to-red-600"
          >
            {t('roadmapCtaButton')}
          </motion.a>
        </div>
      </div>
    </div>
  );
}

