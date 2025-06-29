'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef, ReactNode } from 'react';

interface AnimatedIconProps {
  children: ReactNode;
  animationType?: 'hover' | 'click' | 'scale' | 'rotate' | 'bounce' | 'pulse';
  isActive?: boolean;
  className?: string;
}

export function AnimatedIcon({ 
  children, 
  animationType = 'hover', 
  isActive = false,
  className = '' 
}: AnimatedIconProps) {
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // Set initial state
    gsap.set(icon, { 
      scale: 1,
      rotation: 0,
      y: 0
    });

    const handleMouseEnter = () => {
      switch (animationType) {
        case 'hover':
          gsap.to(icon, {
            scale: 1.2,
            rotation: 5,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
          break;
        case 'scale':
          gsap.to(icon, {
            scale: 1.15,
            duration: 0.2,
            ease: "power2.out"
          });
          break;
        case 'rotate':
          gsap.to(icon, {
            rotation: 15,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
          });
          break;
        case 'bounce':
          gsap.to(icon, {
            y: -5,
            scale: 1.1,
            duration: 0.2,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
          });
          break;
        case 'pulse':
          gsap.to(icon, {
            scale: 1.2,
            duration: 0.3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1
          });
          break;
      }
    };

    const handleMouseLeave = () => {
      gsap.to(icon, {
        scale: isActive ? 1.1 : 1,
        rotation: isActive ? 10 : 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleClick = () => {
      // Click animation - quick scale down and up
      gsap.to(icon, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(icon, {
            scale: isActive ? 1.1 : 1,
            duration: 0.2,
            ease: "back.out(1.7)"
          });
        }
      });
    };

    // Active state animation
    if (isActive) {
      gsap.to(icon, {
        scale: 1.1,
        rotation: 10,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
    }

    icon.addEventListener('mouseenter', handleMouseEnter);
    icon.addEventListener('mouseleave', handleMouseLeave);
    icon.addEventListener('click', handleClick);

    return () => {
      icon.removeEventListener('mouseenter', handleMouseEnter);
      icon.removeEventListener('mouseleave', handleMouseLeave);
      icon.removeEventListener('click', handleClick);
    };
  }, [animationType, isActive]);

  return (
    <div 
      ref={iconRef}
      className={`inline-block cursor-pointer ${className}`}
      style={{ transformOrigin: 'center' }}
    >
      {children}
    </div>
  );
}

// Floating animation for special effects
export function FloatingIcon({ children, className = '' }: { children: ReactNode; className?: string }) {
  const floatRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = floatRef.current;
    if (!element) return;

    gsap.to(element, {
      y: -10,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });
  }, []);

  return (
    <div ref={floatRef} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}

// Stagger animation for multiple icons
export function StaggeredIcons({ children, className = '' }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const icons = container.children;
    
    gsap.fromTo(icons, 
      { 
        opacity: 0, 
        scale: 0.5,
        y: 20 
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1
      }
    );
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
} 