'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { MagnifyingGlass, TrendUp, BookmarkSimple, ChartLine, House, Wrench, ArrowRight, X } from '@phosphor-icons/react';
import { ProgressSlider, SliderBtnGroup, SliderBtn, SliderContent, SliderWrapper } from '@/components/ui/progressive-carousel';
import PageSnapshotEmitter, { emitPageSnapshotNow } from '@/app/components/PageSnapshotEmitter';
import { useLanguage } from '@/contexts/LanguageContext';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  badge?: string;
  author: string;
  date: string; // ISO or display
  readTime: string; // e.g., '6 წთ'
  featured?: boolean;
};

type HeroSlide = {
  id: string;
  image: string;
  titleKey: string;
  descriptionKey: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'market',
    image: '/images/properties/property-14.jpg',
    titleKey: 'blogHeroSlideMarketTitle',
    descriptionKey: 'blogHeroSlideMarketDescription'
  },
  {
    id: 'historic',
    image: '/images/properties/property-2.jpg',
    titleKey: 'blogHeroSlideHistoricTitle',
    descriptionKey: 'blogHeroSlideHistoricDescription'
  },
  {
    id: 'interior',
    image: '/images/properties/property-8.jpg',
    titleKey: 'blogHeroSlideInteriorTitle',
    descriptionKey: 'blogHeroSlideInteriorDescription'
  },
  {
    id: 'investment',
    image: '/images/properties/property-5.jpg',
    titleKey: 'blogHeroSlideInvestmentTitle',
    descriptionKey: 'blogHeroSlideInvestmentDescription'
  }
];

const HERO_INITIAL_SLIDE = HERO_SLIDES[0]?.id ?? 'hero-slide-market';

const POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'რუხი, მოდერნული ბინა – ინტერიერის თანამედროვე მიდგომა',
    excerpt:
      'მოდერნისტული გადაწყვეტები და თბილი ტექსტურების ბალანსი. როგორ შევქმნათ კომფორტული და ფუნქციური სივრცე მცირე ბიუჯეტით.',
    image: '/images/photos/contact-1.jpg',
    category: 'გადაკეთებები',
    badge: 'რჩეული',
    author: 'ანა სარაბაია',
    date: '10 მაისი, 2024',
    readTime: '6 წთ',
    featured: true
  },
  {
    id: '2',
    title: 'ბაზრის ანალიზი: ფასების დინამიკა 2024 წელს',
    excerpt:
      'რა ფაქტორები განსაზღვრავს ფასების ზრდას თბილისში და რეგიონებში. რომელი უბნები ინარჩუნებს ყველაზე მაღალ მოთხოვნას.',
    image: '/images/properties/property-2.jpg',
    category: 'ბაზრის ანალიზი',
    badge: 'ახალი',
    author: 'ლიკა ქავთარაძე',
    date: '8 მაისი, 2024',
    readTime: '5 წთ',
    featured: true
  },
  {
    id: '3',
    title: 'Airbnb თუ გრძელვადიანი ქირავნება – რომელი მოდელია მოგებიანი?',
    excerpt:
      'შემოსავლიანობის შედარება, სეზონურობის ეფექტი და სამართლებრივი დეტალები. როდის სჯობს მოკლევადიანი გაქირავება და როდის — გრძელვადიანი.',
    image: '/images/properties/property-5.jpg',
    category: 'ინვესტიციები',
    badge: 'ინსაითი',
    author: 'ლევან თათარიშვილი',
    date: '3 მაისი, 2024',
    readTime: '8 წთ'
  },
  {
    id: '4',
    title: 'სახლის ყიდვის გზამკვლევი – ნაბიჯ-ნაბიჯ პროცესი',
    excerpt:
      'სესხის წინასწარი დამტკიცებიდან საბოლოო რეგისტრაციამდე. რას უნდა მიაქციოთ ყურადღება დათვალიერებისას და შესყიდვის კონტრაქტში.',
    image: '/images/properties/property-7.jpg',
    category: 'გიდები',
    author: 'გიორგი მდივანი',
    date: '29 აპრილი, 2024',
    readTime: '7 წთ'
  },
  {
    id: '5',
    title: 'ინტერიერის ტრენდები 2024: თბილი მიწისფერი პალიტრა',
    excerpt:
      'ნატურალური ხე, ქვის ტექსტურები და სხივოვანი განათება — როგორ შევქმნათ მშვიდი, მყუდრო ატმოსფერო თანამედროვე ბინაში.',
    image: '/images/properties/property-8.jpg',
    category: 'ინტერიერი',
    author: 'ელენე კოპაძე',
    date: '20 აპრილი, 2024',
    readTime: '4 წთ'
  },
  {
    id: '6',
    title: 'როგორ გავზარდოთ ქონების ღირებულება რემონტის გარეშე',
    excerpt:
      'სტაილინგი, განათლება და ფოტოების ხარისხი — პატარა ცვლილებები, რომლებიც დიდ სხვაობას ქმნის გაყიდვებში.',
    image: '/images/properties/property-10.jpg',
    category: 'გიდები',
    author: 'ნინო ქავთარაძე',
    date: '14 აპრილი, 2024',
    readTime: '5 წთ'
  }
];

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ყველა სტატია');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const { t } = useLanguage();

  const categoryIcon = (name: string) => {
    switch (name) {
      case 'ბაზრის ანალიზი':
        return <TrendUp className="w-4 h-4" />;
      case 'გიდები':
        return <BookmarkSimple className="w-4 h-4" />;
      case 'ინვესტიციები':
        return <ChartLine className="w-4 h-4" />;
      case 'ინტერიერი':
        return <House className="w-4 h-4" />;
      case 'გადაკეთებები':
        return <Wrench className="w-4 h-4" />;
      default:
        return <BookmarkSimple className="w-4 h-4" />;
    }
  };

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    POSTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return POSTS.filter((p) => {
      const matchesQuery =
        !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.excerpt.toLowerCase().includes(query.toLowerCase());
      const matchesCat = activeCategory === 'ყველა სტატია' ? true : activeCategory === 'რჩეული' ? !!p.featured : p.category === activeCategory;
      return matchesQuery && matchesCat;
    });
  }, [query, activeCategory]);

  const primaryPost = filtered[0];
  const restPosts = filtered.slice(1);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <PageSnapshotEmitter
        page="blog"
        title={`${t('blog')} — Lumina Insights`}
        summary={t('blogHeroSubtitle')}
        data={{
          total: POSTS.length,
          categories: Object.keys(POSTS.reduce((acc, p) => (acc[p.category] = (acc[p.category] || 0) + 1, acc), {} as Record<string, number>)),
          hero: t('blogHeroTitle')
        }}
        auto
      />
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 relative">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#F08336]" />
              {t('blogHeroEyebrow')}
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {t('blogHeroTitle')}
            </h1>
            <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {t('blogHeroSubtitle')}
            </p>
          </div>

          <div className="relative mt-8 pb-28">
            <ProgressSlider activeSlider={HERO_INITIAL_SLIDE} className="relative">
              <SliderContent className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/10 dark:ring-white/10">
                {HERO_SLIDES.map((slide) => (
                  <SliderWrapper key={slide.id} value={slide.id}>
                    <div className="relative h-[260px] md:h-[520px]">
                      <Image
                        src={slide.image}
                        alt={t(slide.titleKey)}
                        width={2000}
                        height={1200}
                        className="w-full h-full object-cover"
                        priority={slide.id === HERO_INITIAL_SLIDE}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/15 to-transparent" aria-hidden />
                      <div className="absolute inset-0 flex items-end pb-24 sm:pb-28 lg:pb-32">
                        <div className="w-full p-6 md:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 text-white">
                          <div className="max-w-2xl space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F6B372]">
                              {t('blogHeroEyebrow')}
                            </p>
                            <h2 className="text-2xl md:text-4xl font-semibold leading-tight">
                              {t(slide.titleKey)}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SliderWrapper>
                ))}
              </SliderContent>

              <SliderBtnGroup className="absolute left-1/2 bottom-6 sm:bottom-5 lg:bottom-6 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md shadow-xl -translate-x-1/2">
                {HERO_SLIDES.map((slide) => (
                  <SliderBtn
                    key={`indicator-${slide.id}`}
                    value={slide.id}
                    className="text-left px-4 py-3 text-sm font-medium text-gray-900 dark:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F08336]/60 focus-visible:ring-offset-transparent"
                    progressBarClass="bg-gradient-to-r from-[#F08336] to-[#F6B372] h-full top-0 left-0"
                  >
                    <span>{t(slide.titleKey)}</span>
                  </SliderBtn>
                ))}
              </SliderBtnGroup>
            </ProgressSlider>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <MagnifyingGlass className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('blogSearchPlaceholder')}
                className="w-full h-12 pl-12 pr-4 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F08336]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
              />
            </div>
            <button
              className="h-12 px-5 rounded-full bg-[#F08336] hover:bg-[#e0743a] text-white font-semibold transition flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F08336]/50 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
              onClick={() =>
                emitPageSnapshotNow({
                  page: 'blog',
                  title: `${t('blog')} — Lumina Insights`,
                  summary: t('blogHeroSubtitle'),
                  data: { activeCategory, query, visibleCount: filtered.length }
                })
              }
            >
              {t('blogLastViewed')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Filter chips */}
          <div className="mt-7 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { name: 'ყველა სტატია', count: POSTS.length },
              { name: 'რჩეული', count: POSTS.filter((p) => p.featured).length },
              ...Object.entries(categories).map(([name, count]) => ({ name, count }))
            ].map((chip) => (
              <button
                key={chip.name}
                onClick={() => setActiveCategory(chip.name)}
                className={`whitespace-nowrap h-11 px-4 rounded-full text-sm border transition flex items-center gap-2 ${
                  activeCategory === chip.name
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-black/10 dark:bg-gray-800 dark:text-gray-200 dark:border-white/10'
                }`}
              >
                {chip.name !== 'ყველა სტატია' && chip.name !== 'რჩეული' && (
                  <span className="text-gray-500">{categoryIcon(chip.name)}</span>
                )}
                {chip.name}
                <span className="ml-1 inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                  {chip.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reader Overlay */}
      {activePost && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActivePost(null)} />
          <div className="absolute inset-0 overflow-y-auto" onClick={(e) => { if (e.currentTarget === e.target) setActivePost(null); }}>
            <div className="mx-auto max-w-4xl px-4 py-10" onClick={(e) => e.stopPropagation()}>
              <article className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-xl">
                <div className="relative">
                  <button
                    onClick={() => setActivePost(null)}
                    className="absolute right-4 top-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/70"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <Image src={activePost.image} alt={activePost.title} width={1600} height={900} className="w-full aspect-[16/8] object-cover rounded-t-2xl" />
                </div>
                <div className="p-6 md:p-10">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">{activePost.category}</span>
                    <span>{activePost.date}</span>
                    <span>•</span>
                    <span>{activePost.readTime}</span>
                  </div>
                  <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">{activePost.title}</h1>
                  <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 leading-8">
                    {activePost.excerpt}
                  </p>
                  <div className="mt-6 space-y-4 text-gray-800 dark:text-gray-200 leading-8 text-[17px]">
                    <p>მარტივად წასაკითხი, ფართო შრიფტით და კარგი ინტერლაინით. აქ იქნება სტატიის ძირითადი ტექსტი მრავალ აბზაცად.</p>
                    <p>יכולתების, რჩევებისა და ნაბიჯების ჩამონათვალი მკაფიო სიებად და ქვე-სათაურებით.</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>პირველი მნიშვნელოვანი პუნქტი</li>
                      <li>მეორე მნიშვნელოვანი პუნქტი</li>
                      <li>მესამე მნიშვნელოვანი პუნქტი</li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cards */}
        <div className="lg:col-span-8 space-y-12">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">რედაქტორის არჩევანი</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {POSTS.filter((p) => p.featured).map((post) => (
                <article key={`feat-${post.id}`} className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition">
                  <div className="relative">
                    {post.badge && (
                      <span className="absolute left-4 top-4 z-10 text-xs font-semibold px-3 py-1 rounded-full bg-gray-900/90 text-white shadow">
                        {post.badge}
                      </span>
                    )}
                    <Image src={post.image} alt={post.title} width={1200} height={800} className="w-full aspect-[16/9] object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-medium text-gray-500 flex items-center gap-2">
                      <span className="text-gray-400">{categoryIcon(post.category)}</span>
                      {post.category}
                    </div>
                    <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{post.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{post.readTime}</span>
                        <button onClick={() => setActivePost(post)} className="text-[#F08336] font-semibold hover:underline flex items-center gap-1">
                          კითხვის დაწყება
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          {/* Wide first card */}
          {primaryPost && (
            <article className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition mb-8">
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7">
                  <Image src={primaryPost.image} alt={primaryPost.title} width={1200} height={800} className="w-full h-full object-cover aspect-[16/9] md:aspect-auto" />
                </div>
                <div className="md:col-span-5 p-6 md:p-8 flex flex-col">
                  <div className="text-xs font-medium text-gray-500 flex items-center gap-2">
                    <span className="text-gray-400">{categoryIcon(primaryPost.category)}</span>
                    {primaryPost.category}
                  </div>
                  <h3 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{primaryPost.title}</h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-4">{primaryPost.excerpt}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <span>{primaryPost.author}</span>
                      <span>•</span>
                      <span>{primaryPost.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{primaryPost.readTime}</span>
                      <button onClick={() => setActivePost(primaryPost)} className="text-[#F08336] font-semibold hover:underline flex items-center gap-1">
                        კითხვის დაწყება
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {restPosts.map((post) => (
              <article key={post.id} className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition">
                <div className="relative">
                  {post.badge && (
                    <span className="absolute left-4 top-4 z-10 text-xs font-semibold px-3 py-1 rounded-full bg-gray-900/90 text-white shadow">
                      {post.badge}
                    </span>
                  )}
                  <Image src={post.image} alt={post.title} width={1200} height={800} className="w-full aspect-[16/9] object-cover" />
                </div>
                <div className="p-5">
                  <div className="text-xs font-medium text-gray-500 flex items-center gap-2">
                    <span className="text-gray-400">{categoryIcon(post.category)}</span>
                    {post.category}
                  </div>
                  <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{post.title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[13px] md:text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-3 min-w-0">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                      <span className="text-gray-500">{post.readTime}</span>
                      <button onClick={() => setActivePost(post)} className="text-[#F08336] font-semibold hover:underline flex items-center gap-1">
                        კითხვის დაწყება
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center">
            <button className="px-6 py-3 rounded-full bg-[#F08336] hover:bg-[#e0743a] text-white font-semibold shadow">მეტი სტატიები</button>
          </div>

          {/* Featured detail section */}
          <div className="mt-16">
            {(() => {
              const feat = POSTS.find((p) => p.featured) || POSTS[0];
              if (!feat) return null;
              return (
                <article className="rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800">
                  <Image src={feat.image} alt={feat.title} width={1600} height={900} className="w-full aspect-[16/7] object-cover" />
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">{feat.category}</span>
                      <span>{feat.date}</span>
                      <span>•</span>
                      <span>{feat.readTime}</span>
                    </div>
                    <h3 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{feat.title}</h3>
                    <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-3xl">{feat.excerpt}</p>
                    <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300 text-sm list-disc pl-5">
                      <li>ბიუჯეტის განსაზღვრა და დაკრედიტების წინასწარი დამტკიცება</li>
                      <li>ქონების დათვალიერების ჩექლისტი — მდებარეობა, დონე, იურიდიული სისუფთავე</li>
                      <li>მოლაპარაკება, წინასწარი ხელშეკრულება და რეგისტრაცია</li>
                    </ul>
                    <div className="mt-6">
                      <button onClick={() => setActivePost(feat)} className="px-5 py-3 rounded-full bg-[#F08336] hover:bg-[#e0743a] text-white font-semibold">კითხვის დაწყება</button>
                    </div>
                  </div>
                </article>
              );
            })()}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-5">
            <div className="relative">
              <MagnifyingGlass className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="სტატიის ძიება..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F08336]/30"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-5">
            <h4 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">კატეგორიები</h4>
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory('ყველა სტატია')}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition ${
                  activeCategory === 'ყველა სტატია'
                    ? 'bg-gray-900 text-white'
                    : 'bg-black/5 dark:bg-white/10 text-gray-800 dark:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">ყველა სტატია</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">{POSTS.length}</span>
              </button>

              {Object.entries(categories).map(([name, count]) => (
                <button
                  key={name}
                  onClick={() => setActiveCategory(name)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition ${
                    activeCategory === name
                      ? 'bg-gray-900 text-white'
                      : 'bg-black/5 dark:bg-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <span>{name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">პოპულარული სტატიები</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {POSTS.map((p) => (
                <li key={`trend-${p.id}`} className="flex items-start gap-3">
                  <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[#F08336]"></span>
                  <a className="text-gray-700 dark:text-gray-300 hover:text-[#F08336]" href="#">{p.title}</a>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-black/5 dark:bg-white/10">
              <p className="text-sm text-gray-600 dark:text-gray-300">გსურთ კონსულტაცია? დაუკავშირდით ჩვენს ექსპერტებს.</p>
              <button className="mt-3 px-4 py-2 rounded-lg bg-[#F08336] hover:bg-[#e0743a] text-white font-semibold">კონსულტაციის დაჯავშნა</button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}


