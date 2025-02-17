import { CaptionFormData } from '@/types/caption';

interface PlatformSelectionProps {
  formData: CaptionFormData;
  setFormData: (data: CaptionFormData) => void;
}

const PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    textColor: 'text-white',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    color: 'bg-[#1DA1F2]',
    textColor: 'text-white',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-[#0A66C2]',
    textColor: 'text-white',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    color: 'bg-[#1877F2]',
    textColor: 'text-white',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: 'bg-black',
    textColor: 'text-white',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    color: 'bg-[#FF0000]',
    textColor: 'text-white',
  }
];

export const PlatformSelection = ({ formData, setFormData }: PlatformSelectionProps) => {
  const handlePlatformSelect = (platformId: string) => {
    setFormData({
      ...formData,
      platform: platformId as CaptionFormData['platform']
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handlePlatformSelect(platform.id)}
            className={`
              relative overflow-hidden rounded-xl p-6 transition-all duration-300
              transform hover:scale-105 hover:shadow-lg
              ${platform.color}
              ${formData.platform === platform.id ? 'ring-4 ring-blue-400 scale-105' : ''}
            `}
          >
            <div className={`flex items-center space-x-4 ${platform.textColor}`}>
              <span className="text-3xl">{platform.icon}</span>
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold">{platform.name}</span>
                {formData.platform === platform.id && (
                  <span className="text-sm opacity-90">Selected</span>
                )}
              </div>
            </div>
            
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Select the platform where you'll be posting your content
      </div>
    </div>
  );
};