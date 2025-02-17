'use client';

import { useState } from 'react';
import { CaptionFormData } from '@/types/caption';
import { WizardLayout } from '@/components/ui/WizardLayout';
import { MediaUpload } from '@/components/CaptionWizard/MediaUpload';
import { NicheSelection } from '@/components/CaptionWizard/NicheSelection';
import { PlatformSelection } from '@/components/CaptionWizard/PlatformSelection';
import { GoalSelection } from '@/components/CaptionWizard/GoalSelection';
import { ToneSelection } from '@/components/CaptionWizard/ToneSelection';

export default function CaptionGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CaptionFormData>({
    mediaType: undefined,
    mediaUrl: '',
    niche: '',
    platform: 'instagram',
    goal: '',
    tone: ''
  });

  const steps = [
    {
      title: 'Upload Media',
      description: 'Upload your image or video, or choose text-only',
      isCompleted: !!formData.mediaType
    },
    {
      title: 'Select Niche',
      description: 'Choose your industry or niche',
      isCompleted: !!formData.niche
    },
    {
      title: 'Platform',
      description: 'Select social media platform',
      isCompleted: !!formData.platform
    },
    {
      title: 'Goal',
      description: 'What do you want to achieve?',
      isCompleted: !!formData.goal
    },
    {
      title: 'Tone',
      description: 'Choose your caption tone',
      isCompleted: !!formData.tone
    }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <MediaUpload formData={formData} setFormData={setFormData} />;
      case 1:
        return <NicheSelection formData={formData} setFormData={setFormData} />;
      case 2:
        return <PlatformSelection formData={formData} setFormData={setFormData} />;
      case 3:
        return <GoalSelection formData={formData} setFormData={setFormData} />;
      case 4:
        return <ToneSelection formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Caption Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create engaging captions for your social media posts
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <WizardLayout
              currentStep={currentStep}
              steps={steps}
              onNext={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
              onPrev={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
              isNextDisabled={!steps[currentStep].isCompleted}
            >
              <div className="p-6">
                {renderStep()}
              </div>
            </WizardLayout>
          </div>
        </div>
      </div>
    </div>
  );
}