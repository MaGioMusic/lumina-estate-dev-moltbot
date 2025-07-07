'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      setEmail('');
      console.log('Newsletter subscription:', email);
      
      // Hide success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 1000);
  };

  const handleSocialClick = (platform: string) => {
    const urls = {
      facebook: 'https://facebook.com/luminaestate',
      twitter: 'https://twitter.com/luminaestate',
      instagram: 'https://instagram.com/luminaestate',
      linkedin: 'https://linkedin.com/company/luminaestate'
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const handleQuickLinkClick = (link: string) => {
    console.log(`Navigating to ${link}`);
    alert(`Navigating to ${link} page`);
  };

  const quickLinks = [
    { key: 'home', href: '/' },
    { key: 'properties', href: '/properties' },
    { key: 'agents', href: '/agents' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' }
  ];

  const services = [
    { key: 'buyProperty' },
    { key: 'sellProperty' },
    { key: 'rentProperty' },
    { key: 'propertyManagement' }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.896 5.896a.896.896 0 11-1.792 0 .896.896 0 011.792 0zM10 13a3 3 0 100-6 3 3 0 000 6zm0-1a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/icons/logo.svg"
                alt="Lumina Estate Logo"
                width={32}
                height={32}
                className="object-cover transition-transform duration-200 hover:scale-110"
              />
              <span className="text-gray-900 dark:text-gray-100 font-archivo-black text-subtitle leading-7 transition-colors duration-300">Lumina Estate</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-inter leading-6 transition-colors duration-300">
              {t('footerDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-gray-900 dark:text-gray-100 font-archivo-black text-subtitle leading-7 mb-4 transition-colors duration-300">{t('quickLinks')}</h3>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => handleQuickLinkClick(link.key)}
                  className="block text-gray-600 dark:text-gray-400 font-inter leading-6 text-left hover:text-[#F08336] transition-all duration-300 hover:translate-x-1"
                >
                  {t(link.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-gray-900 dark:text-gray-100 font-archivo-black text-subtitle leading-7 mb-4 transition-colors duration-300">Contact</h3>
            <div className="space-y-4">
              {/* Call Us */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-500 mt-1 stroke-2" />
                <div className="space-y-1">
                  <div className="text-gray-900 dark:text-gray-100 font-inter text-caption transition-colors duration-300">Call Us</div>
                  <div className="text-gray-600 dark:text-gray-400 font-inter text-caption transition-colors duration-300">+1 (555) 123-4567</div>
                </div>
              </div>
              
              {/* Email Us */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-500 mt-1 stroke-2" />
                <div className="space-y-1">
                  <div className="text-gray-900 dark:text-gray-100 font-inter text-caption transition-colors duration-300">Email Us</div>
                  <div className="text-gray-600 dark:text-gray-400 font-inter text-caption transition-colors duration-300">contact@luminaestate.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-gray-900 dark:text-gray-100 font-archivo-black text-subtitle leading-7 mb-4 transition-colors duration-300">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 font-inter text-caption mb-4 transition-colors duration-300">
              Subscribe to get the latest investment opportunities
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 transition-all duration-300 focus-within:border-[#F08336] dark:focus-within:border-orange-500">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full text-gray-900 dark:text-gray-100 font-inter text-caption bg-transparent outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors duration-300"
                />
              </div>
              
              <button
                onClick={handleNewsletterSubmit}
                disabled={isSubscribing}
                className="w-full bg-orange-500 hover:bg-orange-600 rounded-lg px-4 py-2 text-white font-inter text-caption transition-all duration-300 disabled:opacity-50 hover:scale-105 hover:shadow-lg"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="text-gray-600 dark:text-gray-400 font-inter text-caption transition-colors duration-300">
              © 2024 Lumina Estate. {t('allRightsReserved')}.
            </div>
            
            <div className="flex gap-4">
              {/* Social Media Icons */}
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  onClick={() => handleSocialClick(social.name.toLowerCase())}
                  className="bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700 rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-orange-500 dark:hover:bg-orange-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {isSubscribed && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-scale-in">
            Successfully subscribed to newsletter!
          </div>
        )}
      </div>
    </footer>
  );
} 