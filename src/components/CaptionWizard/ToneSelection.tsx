import { CaptionFormData } from '@/types/caption';

interface ToneSelectionProps {
  formData: CaptionFormData;
  setFormData: (data: CaptionFormData) => void;
}

const TONES = [
  {
    id: 'professional',
    name: 'Professional',
    icon: '👔',
    color: 'bg-gradient-to-br from-slate-600 to-slate-800',
    description: 'Formal and business-like approach'
  },
  {
    id: 'casual',
    name: 'Casual',
    icon: '😊',
    color: 'bg-gradient-to-br from-sky-400 to-cyan-500',
    description: 'Relaxed and friendly tone'
  },
  {
    id: 'humorous',
    name: 'Humorous',
    icon: '😄',
    color: 'bg-gradient-to-br from-amber-400 to-orange-500',
    description: 'Fun and entertaining style'
  },
  {
    id: 'persuasive',
    name: 'Persuasive',
    icon: '🎯',
    color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    description: 'Convincing and compelling'
  },
  {
    id: 'inspirational',
    name: 'Inspirational',
    icon: '✨',
    color: 'bg-gradient-to-br from-rose-400 to-pink-600',
    description: 'Motivating and uplifting'
  },
  {
    id: 'educational',
    name: 'Educational',
    icon: '📚',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    description: 'Informative and instructive'
  }
];

export const ToneSelection = ({ formData, setFormData }: ToneSelectionProps) => {
  const handleToneSelect = (toneId: string) => {
    setFormData({
      ...formData,
      tone: toneId
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => handleToneSelect(tone.id)}
            className={`
              relative overflow-hidden rounded-xl transition-all duration-300
              transform hover:scale-102 hover:shadow-lg
              ${tone.color}
              ${formData.tone === tone.id ? 'ring-4 ring-blue-400 scale-102' : ''}
            `}
          >
            <div className="p-6 text-white">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{tone.icon}</span>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold">{tone.name}</span>
                  <span className="text-sm opacity-90">{tone.description}</span>
                </div>
              </div>

              {/* Selection indicator */}
              {formData.tone === tone.id && (
                <div className="absolute top-3 right-3">
                  <div className="bg-white bg-opacity-25 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id={`grid-${tone.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill={`url(#grid-${tone.id})`} />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Select the tone that best fits your content
      </div>
    </div>
  );
};