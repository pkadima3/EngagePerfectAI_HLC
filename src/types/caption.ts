export interface CaptionFormData {
  mediaType: 'image' | 'video' | 'text-only' | undefined;
  mediaUrl: string;
  niche: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  goal: string;
  tone: string;
}

export interface WizardStep {
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface WizardStepProps {
  formData: CaptionFormData;
  setFormData: React.Dispatch<React.SetStateAction<CaptionFormData>>;
}