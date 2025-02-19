import { ReactNode } from 'react';
import { CheckIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

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
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="hidden md:flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index !== steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className="relative flex flex-col items-center group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200
                    ${
                      index < currentStep
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : index === currentStep
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                        : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400'
                    }`}
                >
                  {index < currentStep ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span 
                  className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors duration-200
                    ${index <= currentStep 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {step.title}
                </span>
                
                {/* Tooltip on hover */}
                <div className="absolute -bottom-14 scale-0 group-hover:scale-100 transition-all duration-200 origin-top">
                  <div className="bg-gray-800 dark:bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors duration-200 ${
                    index < currentStep
                      ? 'bg-blue-600 dark:bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile Steps Indicator */}
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {steps[currentStep].title}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-[400px]">
        {children}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 sm:px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className={`
            px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center gap-2
            ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Previous
        </button>
        
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`
            px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center gap-2
            ${
              isNextDisabled
                ? 'bg-blue-400 text-white cursor-not-allowed dark:bg-blue-600 dark:opacity-60'
                : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm hover:shadow-md'
            }`}
        >
          {currentStep === steps.length - 1 ? (
            'Download'
          ) : (
            <>
              {currentStep === steps.length - 2 ? 'Generate' : 'Next'}
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}