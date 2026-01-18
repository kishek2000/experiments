import { useState } from 'react';
import { Modal, Button } from '../ui';
import { db } from '~/lib/db';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to Sikho!',
    content: 'Learn to read and write Hindi with the Devanagari script. This app will guide you through the alphabet step by step.',
    icon: (
      <div className="text-6xl mb-4 devanagari bg-gradient-to-br from-amber-400 to-amber-500 bg-clip-text text-transparent">नमस्ते</div>
    )
  },
  {
    title: 'Learn by Doing',
    content: 'Study letters through structured lessons, then practice writing them on paper. Use self-assessment to track your progress.',
    icon: (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>
    )
  },
  {
    title: 'Track Your Progress',
    content: 'The app remembers which letters you know well and which need more practice. Focus on what matters most.',
    icon: (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
    )
  }
];

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      await db.settings.update('user', { onboardingComplete: true });
      onComplete();
    }
  };

  const handleSkip = async () => {
    await db.settings.update('user', { onboardingComplete: true });
    onComplete();
  };

  const step = steps[currentStep];

  return (
    <Modal isOpen={isOpen} onClose={handleSkip}>
      <div className="text-center py-4">
        <div className="flex justify-center">
          {step.icon}
        </div>
        <h2 className="text-xl font-bold text-[--color-text-primary] mb-3">{step.title}</h2>
        <p className="text-[--color-text-secondary] mb-6 leading-relaxed">{step.content}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-amber-400 w-6' 
                  : index < currentStep 
                    ? 'bg-amber-400/50' 
                    : 'bg-[--color-border-light]'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
