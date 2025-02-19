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

export interface GenerateCaptionsParams {
  platform: string;
  niche: string;
  tone: string;
  goal: string;
  mediaType?: string;
  mediaContext?: string;
  maxLength?: number;
  userId?: string;
}

export interface GeneratedCaption {
  title: string;
  caption: string;
  hashtags: string[];
  cta: string;
}