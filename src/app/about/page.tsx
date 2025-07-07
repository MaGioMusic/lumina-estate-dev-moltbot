'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

export default function AboutPage() {
  const { t } = useLanguage();

  const teamMembers = [
    {
      name: 'ნინო გელაშვილი',
      role: 'CEO & Founder',
      image: '/images/photos/contact-1.jpg',
      experience: '15 წელი',
      description: 'Real Estate industry veteran with extensive experience in luxury properties'
    },
    {
      name: 'დავით მამაცაშვილი', 
      role: 'Head of Sales',
      image: '/images/photos/contact-2.jpg',
      experience: '12 წელი',
      description: 'Expert in property investment and commercial real estate'
    },
    {
      name: 'ანა ხუციშვილი',
      role: 'Marketing Director',
      image: '/images/photos/contact-3.jpg',
      experience: '8 წელი',
      description: 'Specialized in digital marketing and brand development'
    },
    {
      name: 'გიორგი ნადირაძე',
      role: 'Technical Director',
      image: '/images/photos/contact-4.jpg',
      experience: '10 წელი',
      description: 'Leading our digital transformation and technology initiatives'
    }
  ];

  const stats = [
    { number: '2,500+', label: 'Properties Sold' },
    { number: '15+', label: 'Years Experience' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '50+', label: 'Expert Agents' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-orange-500 to-red-500 flex items-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              About Lumina Estate
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Your trusted partner in finding the perfect property in Georgia. 
              We combine local expertise with cutting-edge technology to deliver exceptional results.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                <p>
                  Founded in 2008, Lumina Estate has been at the forefront of Georgia's real estate revolution. 
                  What started as a small family business has grown into one of the most trusted names in Georgian real estate.
                </p>
                <p>
                  We believe that finding the perfect property should be an exciting journey, not a stressful ordeal. 
                  That's why we've invested heavily in technology, training, and customer service to make your 
                  property search as smooth as possible.
                </p>
                <p>
                  Today, we're proud to serve thousands of satisfied clients across Georgia, from first-time buyers 
                  to seasoned investors, helping them find their dream homes and investment properties.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/images/photos/hero-background.jpg"
                alt="Lumina Estate Office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These core principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Integrity</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We believe in honest, transparent dealings in every transaction. Your trust is our most valuable asset.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We leverage cutting-edge technology and innovative approaches to deliver superior results.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We strive for excellence in every aspect of our service, from initial consultation to closing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our experienced professionals are here to guide you through your real estate journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-orange-500 font-semibold mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {member.description}
                </p>
                <p className="text-sm text-orange-500 font-semibold">
                  Experience: {member.experience}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let our experienced team help you navigate the Georgian real estate market
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-500 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-orange-500 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 