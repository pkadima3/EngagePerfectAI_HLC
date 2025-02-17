import { ReactNode } from 'react';

interface WizardStep {
  title: string;
  description: string;
  isCompleted: boolean;
}

interface WizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  steps: WizardStep[];
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
}

export function WizardLayout({
  children,
  currentStep,
  steps,
  onNext,
  onPrev,
  isNextDisabled = false
}: WizardLayoutProps) {
  return (
    <div className="flex flex-col">
      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index !== steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className="relative flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                    ${
                      index < currentStep
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : index === currentStep
                        ? 'border-blue-600 text-blue-600'
                        : 'border-gray-300 text-gray-500 dark:border-gray-600'
                    }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {step.title}
                </span>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep
                      ? 'bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-[400px]">
        {children}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              isNextDisabled
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {currentStep === steps.length - 1 ? 'Generate' : 'Next'}
        </button>
      </div>
    </div>
  );
}