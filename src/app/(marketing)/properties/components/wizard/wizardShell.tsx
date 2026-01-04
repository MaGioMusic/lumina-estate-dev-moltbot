'use client';

import { ReactNode } from 'react';

interface WizardShellProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => void;
  children: ReactNode;
  showNav?: boolean;
}

export function WizardShell({
  title,
  subtitle,
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  children,
  showNav = true,
}: WizardShellProps) {
  const pct = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="min-h-[80vh] w-full bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between text-sm text-slate-600">
          <div>Step {currentStep + 1} of {totalSteps}</div>
          <div className="h-1 w-64 rounded-full bg-slate-200">
            <div className="h-1 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && (<p className="mt-1 text-slate-500">{subtitle}</p>)}
        </div>

        <div className="mb-10">
          {children}
        </div>

        {showNav && (
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={onPrev}
              className="rounded-full px-4 py-2 text-slate-600 hover:text-slate-800"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-full bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


