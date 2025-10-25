'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SocialLoginButtonsProps {
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  disabled?: boolean;
}

export default function SocialLoginButtons({ 
  onGoogleLogin, 
  onFacebookLogin, 
  disabled = false 
}: SocialLoginButtonsProps) {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Google Login Button */}
      <button
        onClick={onGoogleLogin}
        disabled={disabled}
        className="google-button"
        type="button"
      >
        <svg className="svg" viewBox="0 0 24 24">
          <path className="red" fill="#EB4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path className="blue" fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path className="green" fill="#34A853" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path className="yellow" fill="#FBBC05" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text">Google</span>
      </button>

      {/* Facebook Login Button */}
      <button
        onClick={onFacebookLogin}
        disabled={disabled}
        className="facebook-button"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="#0163E0">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span className="text">Facebook</span>
      </button>

      <style jsx>{`
        /* Google Button Styles */
        .google-button {
          padding: 8px 12px;
          font-weight: 600;
          display: flex;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          align-items: center;
          justify-content: center;
          border: solid 2px ${theme === 'dark' ? '#374151' : '#000'};
          outline: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 44px;
        }

        .google-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .google-button .svg {
          height: 20px;
          width: 20px;
          margin-right: 8px;
          z-index: 6;
          flex-shrink: 0;
        }

        .google-button .text {
          z-index: 10;
          font-size: 14px;
          color: ${theme === 'dark' ? '#f3f4f6' : '#000'};
          white-space: nowrap;
        }

        .google-button:hover:not(:disabled) .text {
          animation: text forwards 0.3s;
        }

        @keyframes text {
          from {
            color: ${theme === 'dark' ? '#f3f4f6' : '#000'};
          }
          to {
            color: white;
          }
        }

        .google-button:hover:not(:disabled)::before {
          content: "";
          display: block;
          position: absolute;
          top: 50%;
          left: 9%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          opacity: 0;
          border-radius: 300px;
          animation: wave1 2.5s ease-in-out forwards;
        }

        .google-button:hover:not(:disabled)::after {
          content: "";
          display: block;
          position: absolute;
          top: 50%;
          left: 9%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          opacity: 0;
          border-radius: 300px;
          animation: wave2 2.5s ease-in-out forwards;
        }

        @keyframes wave1 {
          0% {
            z-index: 1;
            background: #EB4335;
            width: 0;
            height: 0;
            opacity: 1;
          }
          1% {
            z-index: 1;
            background: #EB4335;
            width: 0;
            height: 0;
            opacity: 1;
          }
          25% {
            z-index: 1;
            background: #EB4335;
            width: 800px;
            height: 800px;
            opacity: 1;
          }
          26% {
            z-index: 3;
            background: #34A853;
            width: 0;
            height: 0;
            opacity: 1;
          }
          50% {
            z-index: 3;
            background: #34A853;
            width: 800px;
            height: 800px;
            opacity: 1;
          }
          70% {
            z-index: 3;
            background: #34A853;
            width: 800px;
            height: 800px;
            opacity: 1;
          }
          100% {
            z-index: 3;
            background: #34A853;
            width: 800px;
            height: 800px;
            opacity: 1;
          }
        }

        @keyframes wave2 {
          0% {
            z-index: 2;
            background: #FBBC05;
            width: 0;
            height: 0;
            opacity: 1;
          }
          11% {
            z-index: 2;
            background: #FBBC05;
            width: 0;
            height: 0;
            opacity: 1;
          }
          35% {
            z-index: 2;
            background: #FBBC05;
            width: 800px;
            height: 800px;
            opacity: 1;
          }
          39% {
            z-index: 2;
            background: #FBBC05;
            width: 800px;
            height: 800px;
            opacity: 1;
          }
          40% {
            z-index: 4;
            background: #4285F4;
            width: 0;
            height: 0;
            opacity: 1;
          }
          64% {
            z-index: 4;
            background: #4285F4;
            width: 800px;
            height: 800px;
            opacity: 1;
          }
          100% {
            z-index: 4;
            background: #4285F4;
            width: 800px;
            height: 800px;
            opacity: 1;
          }
        }

        .google-button:hover:not(:disabled) .red {
          animation: disappear 0.1s forwards;
          animation-delay: 0.1s;
        }

        .google-button:hover:not(:disabled) .yellow {
          animation: disappear 0.1s forwards;
          animation-delay: 0.3s;
        }

        .google-button:hover:not(:disabled) .green {
          animation: disappear 0.1s forwards;
          animation-delay: 0.7s;
        }

        .google-button:hover:not(:disabled) .blue {
          animation: disappear 0.1s forwards;
          animation-delay: 1.1s;
        }

        @keyframes disappear {
          from {
            filter: brightness(1);
          }
          to {
            filter: brightness(100);
          }
        }

        /* Facebook Button Styles */
        .facebook-button {
          background: transparent;
          position: relative;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: 2px solid #0163E0;
          border-radius: 20px;
          outline: none;
          overflow: hidden;
          color: #0163E0;
          transition: color 0.3s 0.1s ease-out;
          text-align: center;
          min-height: 44px;
        }

        .facebook-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .facebook-button svg {
          fill: #0163E0;
          height: 20px;
          width: 20px;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .facebook-button span { white-space: nowrap; }

        /* Facebook dual-wave animation (blue), mirroring Google style */
        .facebook-button .text {
          z-index: 10;
          font-size: 14px;
          color: #0163E0;
          white-space: nowrap;
        }

        .facebook-button:hover:not(:disabled) .text {
          animation: fbText forwards 0.3s;
        }

        @keyframes fbText {
          from { color: #0163E0; }
          to { color: #ffffff; }
        }

        .facebook-button:hover:not(:disabled)::before {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          opacity: 0;
          border-radius: 300px;
          animation: fbWave1 1.6s ease-in-out forwards;
        }

        .facebook-button:hover:not(:disabled)::after {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          opacity: 0;
          border-radius: 300px;
          animation: fbWave2 1.6s ease-in-out forwards;
        }

        @keyframes fbWave1 {
          0% { z-index: 1; background: #1A6FF2; width: 0; height: 0; opacity: 1; }
          1% { z-index: 1; background: #1A6FF2; width: 0; height: 0; opacity: 1; }
          25% { z-index: 1; background: #1A6FF2; width: 600px; height: 600px; opacity: 1; }
          26% { z-index: 3; background: #3B82F6; width: 0; height: 0; opacity: 1; }
          50% { z-index: 3; background: #3B82F6; width: 600px; height: 600px; opacity: 1; }
          70% { z-index: 3; background: #3B82F6; width: 600px; height: 600px; opacity: 1; }
          100% { z-index: 3; background: #3B82F6; width: 600px; height: 600px; opacity: 1; }
        }

        @keyframes fbWave2 {
          0% { z-index: 2; background: #60A5FA; width: 0; height: 0; opacity: 1; }
          11% { z-index: 2; background: #60A5FA; width: 0; height: 0; opacity: 1; }
          35% { z-index: 2; background: #60A5FA; width: 600px; height: 600px; opacity: 1; }
          39% { z-index: 2; background: #60A5FA; width: 600px; height: 600px; opacity: 1; }
          40% { z-index: 4; background: #93C5FD; width: 0; height: 0; opacity: 1; }
          64% { z-index: 4; background: #93C5FD; width: 600px; height: 600px; opacity: 1; }
          100% { z-index: 4; background: #93C5FD; width: 600px; height: 600px; opacity: 1; }
        }

        .facebook-button:hover:not(:disabled) {
          color: #fff;
          border: 2px solid #0163E0;
        }

        .facebook-button:hover:not(:disabled) svg {
          fill: #ffffff;
        }
      `}</style>
    </div>
  );
} 