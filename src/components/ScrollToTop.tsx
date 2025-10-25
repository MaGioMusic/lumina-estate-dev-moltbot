'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ScrollToTop() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 
               bg-primary-400 hover:bg-primary-500 
               text-white p-3 rounded-full shadow-lg hover:shadow-xl
               transition-all duration-300 transform hover:scale-110 hover:-translate-y-1
               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
               animate-bounce-gentle"
      aria-label={t('scrollToTop')}
      title={t('scrollToTop')}
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
} 