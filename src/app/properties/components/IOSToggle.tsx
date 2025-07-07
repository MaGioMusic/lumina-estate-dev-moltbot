'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import gsap from 'gsap';

interface IOSToggleProps {
  isGrid: boolean;
  onToggle: (view: 'grid' | 'map') => void;
}

export default function IOSToggle({ isGrid, onToggle }: IOSToggleProps) {
  const { theme } = useTheme();
  const toggleRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const gridIconRef = useRef<SVGSVGElement>(null);
  const mapIconRef = useRef<SVGSVGElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current || !gridIconRef.current || !mapIconRef.current || !backgroundRef.current) return;

    const tl = gsap.timeline();
    
    if (isGrid) {
      // Grid view selected
      tl.to(sliderRef.current, {
        x: 0,
        duration: 0.35,
        ease: "power2.inOut"
      })
      .to(backgroundRef.current, {
        backgroundColor: theme === 'dark' ? "#374151" : "#f3f4f6", // gray-700 : gray-100
        duration: 0.3
      }, "-=0.35")
      .to(gridIconRef.current, {
        scale: 1,
        opacity: 1,
        color: theme === 'dark' ? "#f9fafb" : "#111827", // gray-50 : gray-900
        duration: 0.2
      }, "-=0.25")
      .to(mapIconRef.current, {
        scale: 0.85,
        opacity: 0.4,
        color: theme === 'dark' ? "#9ca3af" : "#6b7280", // gray-400 : gray-500
        duration: 0.2
      }, "-=0.2");
    } else {
      // Map view selected
      tl.to(sliderRef.current, {
        x: 40,
        duration: 0.35,
        ease: "power2.inOut"
      })
      .to(backgroundRef.current, {
        backgroundColor: theme === 'dark' ? "#ea580c" : "#FED7AA", // orange-600 : orange-200
        duration: 0.3
      }, "-=0.35")
      .to(mapIconRef.current, {
        scale: 1,
        opacity: 1,
        color: theme === 'dark' ? "#fff7ed" : "#EA580C", // orange-50 : orange-600
        duration: 0.2
      }, "-=0.25")
      .to(gridIconRef.current, {
        scale: 0.85,
        opacity: 0.4,
        color: theme === 'dark' ? "#9ca3af" : "#6b7280", // gray-400 : gray-500
        duration: 0.2
      }, "-=0.2");
    }
  }, [isGrid, theme]);

  const handleClick = () => {
    // Add haptic-like bounce effect
    if (toggleRef.current) {
      gsap.to(toggleRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
    onToggle(isGrid ? 'map' : 'grid');
  };

  return (
    <div 
      ref={toggleRef}
      onClick={handleClick}
      className="relative w-[80px] h-[40px] rounded-full p-1 cursor-pointer select-none"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Background */}
      <div 
        ref={backgroundRef}
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}
      />
      
      {/* Slider - No shadow for cleaner look */}
      <div 
        ref={sliderRef}
        className={`absolute top-1 left-1 w-[32px] h-[32px] rounded-full z-10 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      />
      
      {/* Icons Container - Better centered */}
      <div className="relative flex items-center h-full">
        {/* Grid Icon - Centered in left half */}
        <div className="w-[40px] flex items-center justify-center">
          <svg 
            ref={gridIconRef}
            className={`w-5 h-5 z-20 ${
              theme === 'dark' ? 'text-gray-50' : 'text-gray-900'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        </div>
        
        {/* Map Icon - Centered in right half */}
        <div className="w-[40px] flex items-center justify-center">
          <svg 
            ref={mapIconRef}
            className={`w-5 h-5 z-20 opacity-40 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
} 