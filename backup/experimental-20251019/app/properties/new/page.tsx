'use client';

import { useEffect, useState } from 'react';
import { WizardShell } from '../../properties/components/wizard/wizardShell';
import { Step1DetailsForm } from '../../properties/components/wizard/steps/Step1Details';
import type { ListingDraft, Step1Details } from '../../../types/listing';

const DRAFT_STORAGE_KEY = 'lumina_listing_draft_v1';

export default function NewPropertyPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [draft, setDraft] = useState<ListingDraft>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        setDraft(JSON.parse(raw) as ListingDraft);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);

  const handleStep1Submit = (values: Step1Details) => {
    setDraft(prev => ({ ...prev, step1: values }));
    setCurrentStep(1);
  };

  return (
    <WizardShell
      title={getStepTitle(currentStep)}
      subtitle="Consectetur adipiscing elit duis tristique sollicitudin nibh sit."
      currentStep={currentStep}
      totalSteps={5}
      onPrev={() => setCurrentStep(s => Math.max(0, s - 1))}
      onNext={() => setCurrentStep(s => Math.min(4, s + 1))}
      showNav={currentStep > 0}
    >
      {currentStep === 0 && (
        <Step1DetailsForm initialValues={draft.step1} onSubmit={handleStep1Submit} />
      )}
      {currentStep > 0 && (
        <div className="mx-auto max-w-3xl text-center text-slate-600">
          Coming soon: steps {currentStep + 1}–5.
        </div>
      )}
    </WizardShell>
  );
}

function getStepTitle(step: number): string {
  if (step === 0) return 'Property Details';
  if (step === 1) return 'Home Facts';
  if (step === 2) return 'Open House';
  if (step === 3) return 'Home Photo';
  return 'Additional Information';
}


