'use client';

import { useTheme } from '@/contexts/ThemeContext';

interface FancySwitchProps {
  checked: boolean;
  onChange: () => void;
  leftLabel: string;
  rightLabel: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ariaLabel?: string;
}

export default function FancySwitch({ 
  checked, 
  onChange, 
  leftLabel, 
  rightLabel, 
  leftIcon, 
  rightIcon, 
  ariaLabel 
}: FancySwitchProps) {
  const { theme } = useTheme();

  return (
    <div className="fancy-switch-container">
      <style jsx>{`
        .fancy-switch {
          --_switch-bg-clr: #ff8c00;
          --_switch-padding: 4px;
          --_slider-bg-clr: rgba(255, 140, 0, 0.65);
          --_slider-bg-clr-on: rgba(255, 140, 0, 1);
          --_slider-txt-clr: #ffffff;
          --_label-padding: 0.75rem 1.25rem;
          --_switch-easing: cubic-bezier(0.47, 1.64, 0.41, 0.8);
          
          color: white;
          width: fit-content;
          display: flex;
          justify-content: center;
          position: relative;
          border-radius: 9999px;
          cursor: pointer;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          position: relative;
          isolation: isolate;
          min-width: 140px;
          height: 44px;
          font-size: 14px;
          font-weight: 500;
        }

        .fancy-switch input[type="checkbox"] {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .fancy-switch > span {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: opacity 300ms ease-in-out 150ms;
          padding: var(--_label-padding);
          z-index: 10;
          white-space: nowrap;
        }

        .fancy-switch::before,
        .fancy-switch::after {
          content: "";
          position: absolute;
          border-radius: inherit;
          transition: inset 150ms ease-in-out;
        }

        /* switch slider */
        .fancy-switch::before {
          background-color: var(--_slider-bg-clr);
          inset: var(--_switch-padding) 50% var(--_switch-padding) var(--_switch-padding);
          transition: inset 500ms var(--_switch-easing), background-color 500ms ease-in-out;
          z-index: -1;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.3);
        }

        /* switch bg color */
        .fancy-switch::after {
          background-color: var(--_switch-bg-clr);
          inset: 0;
          z-index: -2;
        }

        /* switch focus */
        .fancy-switch:focus-within::after {
          inset: -0.25rem;
        }

        /* switch hover effects */
        .fancy-switch:has(input:checked):hover > span:first-of-type,
        .fancy-switch:has(input:not(:checked)):hover > span:last-of-type {
          opacity: 1;
          transition-delay: 0ms;
          transition-duration: 100ms;
        }

        .fancy-switch:has(input:checked):hover::before {
          inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding) 45%;
        }

        .fancy-switch:has(input:not(:checked)):hover::before {
          inset: var(--_switch-padding) 45% var(--_switch-padding) var(--_switch-padding);
        }

        /* checked - move slider to right */
        .fancy-switch:has(input:checked)::before {
          background-color: var(--_slider-bg-clr-on);
          inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding) 50%;
        }

        /* opacity states */
        .fancy-switch > span:last-of-type,
        .fancy-switch > input:checked + span:first-of-type {
          opacity: 0.75;
        }

        .fancy-switch > input:checked ~ span:last-of-type {
          opacity: 1;
        }

        /* Dark mode adjustments */
        .dark .fancy-switch {
          --_switch-bg-clr: #ea580c;
          --_slider-bg-clr: rgba(234, 88, 12, 0.65);
          --_slider-bg-clr-on: rgba(234, 88, 12, 1);
        }
      `}</style>

      <label className="fancy-switch">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange}
          aria-label={ariaLabel}
        />
        <span>
          {leftIcon}
          {leftLabel}
        </span>
        <span>
          {rightIcon}
          {rightLabel}
        </span>
      </label>
    </div>
  );
} 