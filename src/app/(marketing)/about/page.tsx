'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { AddressBook, Article, Users, Heart, Star, Trophy } from '@phosphor-icons/react';
import Image from 'next/image';

export default function AboutPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const aboutCards = [
    {
      title: t('contact'),
      description: 'Get in touch with our team and find your perfect property',
      icon: AddressBook,
      href: '/contact',
      color: 'bg-blue-500',
      stats: 'Available 24/7'
    },
    {
      title: 'ბლოგი', // Blog in Georgian
      description: 'Read the latest real estate insights and market trends',
      icon: Article,
      href: '/blog',
      color: 'bg-purple-500',
      stats: 'Coming Soon'
    }
  ];

  const teamMembers = [
    {
      name: 'Sarah Wilson',
      role: 'Senior Real Estate Agent',
      image: '/images/photos/contact-1.jpg',
      experience: '8+ years'
    },
    {
      name: 'Michael Chen',
      role: 'Property Investment Advisor',
      image: '/images/photos/contact-2.jpg',
      experience: '12+ years'
    },
    {
      name: 'Emma Thompson',
      role: 'Market Research Analyst',
      image: '/images/photos/contact-3.jpg',
      experience: '6+ years'
    },
    {
      name: 'David Rodriguez',
      role: 'Luxury Properties Specialist',
      image: '/images/photos/contact-4.jpg',
      experience: '10+ years'
    }
  ];

  const stats = [
    { label: 'Properties Sold', value: '500+', icon: Trophy },
    { label: 'Happy Clients', value: '1,200+', icon: Heart },
    { label: 'Team Members', value: '25+', icon: Users },
    { label: 'Years Experience', value: '15+', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('about')} Lumina Estate
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We are Georgia's premier real estate agency, dedicated to helping you find your perfect home 
            or investment opportunity in Tbilisi and beyond.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
                <Icon size={32} className="mx-auto mb-3 text-[#F08336]" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main About Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {aboutCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.href}
                onClick={() => router.push(card.href)}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-[#F08336] hover:scale-105"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${card.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-[#F08336] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {card.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {card.stats}
                      </span>
                      <span className="text-[#F08336] font-medium text-sm group-hover:underline">
                        {card.href === '/blog' ? 'Coming Soon' : 'Get Started →'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Our Story */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-16 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            <p className="mb-4">
              Founded in 2009, Lumina Estate has been at the forefront of Georgia's real estate revolution. 
              We started with a simple mission: to make property buying, selling, and investing accessible 
              to everyone, from first-time homebuyers to seasoned investors.
            </p>
            <p className="mb-4">
              Over the years, we've helped thousands of families find their dream homes and assisted 
              international investors in discovering lucrative opportunities in Georgia's growing market. 
              Our expertise spans residential, commercial, and luxury properties across Tbilisi, Batumi, 
              and other key Georgian cities.
            </p>
            <p>
              Today, we combine traditional real estate expertise with cutting-edge technology to provide 
              an unparalleled service experience. Our multilingual team speaks Georgian, English, and Russian, 
              ensuring we can serve both local and international clients with equal excellence.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {member.role}
                </p>
                <p className="text-xs text-[#F08336] font-medium">
                  {member.experience}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-r from-[#F08336] to-[#D4AF37] rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Transparency</h3>
              <p className="text-sm opacity-90">
                Clear communication and honest pricing in every transaction
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Excellence</h3>
              <p className="text-sm opacity-90">
                Delivering exceptional service that exceeds expectations
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-sm opacity-90">
                Using technology to simplify and enhance the real estate experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 