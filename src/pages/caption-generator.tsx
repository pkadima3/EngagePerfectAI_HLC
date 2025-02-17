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
        return <MediaUpload formData={formData} setFormData={setFormData} />;
      case 1:
        return <NicheSelection formData={formData} setFormData={setFormData} />;
      case 2:
        return <PlatformSelection formData={formData} setFormData={setFormData} />;
      case 3:
        return <GoalSelection formData={formData} setFormData={setFormData} />;
      case 4:
        return <ToneSelection formData={formData} setFormData={setFormData} />;
      case 5:
        return <GeneratedCaptions captions={generatedCaptions} isLoading={isGenerating} />;
      default:
        return null;
    }
  };

  return (
    <WizardLayout 
      currentStep={currentStep} 
      steps={steps}
      onNext={handleNext}
      onPrev={handlePrev}
      isNextDisabled={!steps[currentStep].isCompleted}
    >
      {renderStep()}
    </WizardLayout>
  );
}