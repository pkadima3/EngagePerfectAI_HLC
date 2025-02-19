'use client';

import { useState } from 'react';
import { WizardLayout } from '@/components/ui/WizardLayout';
import { MediaUpload } from '@/components/CaptionWizard/MediaUpload';
import { NicheSelection } from '@/components/CaptionWizard/NicheSelection';
import { PlatformSelection } from '@/components/CaptionWizard/PlatformSelection';
import { GoalSelection } from '@/components/CaptionWizard/GoalSelection';
import { ToneSelection } from '@/components/CaptionWizard/ToneSelection';
import { CaptionFormData } from '@/types/caption';
import { generateCaptions } from '@/lib/openai';
import { GeneratedCaptions } from '@/components/CaptionWizard/GeneratedCaptions';
import { useAuth } from '@/contexts/AuthContext';

export default function CaptionGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<CaptionFormData>({
    mediaType: undefined,
    mediaUrl: '',
    niche: '',
    platform: 'instagram',
    goal: '',
    tone: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState([]);

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
    },
    {
      title: 'Generated Captions',
      description: 'Choose your preferred caption',
      isCompleted: true
    }
  ];

  const handleNext = async () => {
    if (currentStep === steps.length - 2) {
      await handleGenerate();
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const captions = await generateCaptions({
        platform: formData.platform,
        niche: formData.niche,
        tone: formData.tone,
        goal: formData.goal,
        mediaType: formData.mediaType
      });
      setGeneratedCaptions(captions);
    } catch (error) {
      console.error('Failed to generate captions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <MediaUpload formData={formData} setFormData={setFormData} onNext={handleNext} />;
      case 1:
        return <NicheSelection formData={formData} setFormData={setFormData} />;
      case 2:
        return <PlatformSelection formData={formData} setFormData={setFormData} />;
      case 3:
        return <GoalSelection formData={formData} setFormData={setFormData} />;
      case 4:
        return <ToneSelection formData={formData} setFormData={setFormData} />;
      case 5:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Captions */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Choose Your Caption
              </h2>
              <GeneratedCaptions captions={generatedCaptions} isLoading={isGenerating} />
            </div>
            
            {/* Right side: Media preview */}
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Your Media
                </h2>
                {formData.mediaUrl && formData.mediaType !== 'text-only' ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                    {formData.mediaType === 'image' ? (
                      <img 
                        src={formData.mediaUrl} 
                        alt="Uploaded media"
                        className="w-full object-contain max-h-[400px]" 
                      />
                    ) : (
                      <video
                        src={formData.mediaUrl}
                        controls
                        className="w-full object-contain max-h-[400px]"
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center text-gray-500 dark:text-gray-300 border border-gray-100 dark:border-gray-600 h-[300px] flex items-center justify-center">
                    <p className="text-lg">Text-only caption</p>
                  </div>
                )}
                
                {/* Image details */}
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Caption Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Platform:</span>
                      <span className="font-medium">{formData.platform}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Niche:</span>
                      <span className="font-medium">{formData.niche}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Tone:</span>
                      <span className="font-medium">{formData.tone}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Goal:</span>
                      <span className="font-medium">{formData.goal}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Caption Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create engaging captions for your social media posts with AI assistance
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <WizardLayout
              currentStep={currentStep}
              steps={steps}
              onNext={handleNext}
              onPrev={handlePrev}
              isNextDisabled={!steps[currentStep].isCompleted}
            >
              <div className="p-6 md:p-8">
                {renderStep()}
              </div>
            </WizardLayout>
          </div>
        </div>
      </div>
    </div>
  );
}