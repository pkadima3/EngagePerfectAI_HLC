import { useState } from 'react';
import { CaptionFormData } from '@/types/caption';

interface NicheSelectionProps {
  formData: CaptionFormData;
  setFormData: (data: CaptionFormData) => void;
}

const SUGGESTED_NICHES = [
  { id: 'fitness', label: '💪 Fitness & Wellness' },
  { id: 'tech', label: '💻 Tech & Startups' },
  { id: 'health', label: '🏥 Health & Medical' },
  { id: 'food', label: '🍳 Food & Cooking' },
  { id: 'education', label: '📚 Education' },
  { id: 'finance', label: '💰 Finance' },
  { id: 'fashion', label: '👗 Fashion & Beauty' },
  { id: 'travel', label: '✈️ Travel & Tourism' },
  { id: 'realestate', label: '🏠 Real Estate' },
  { id: 'gaming', label: '🎮 Gaming & Entertainment' },
  { id: 'business', label: '💼 Business & Marketing' },
  { id: 'art', label: '🎨 Art & Design' }
];

export const NicheSelection = ({ formData, setFormData }: NicheSelectionProps) => {
  const [customNiche, setCustomNiche] = useState('');

  const handleNicheSelect = (niche: string) => {
    setFormData({
      ...formData,
      niche
    });
    setCustomNiche('');
  };

  const handleCustomNicheChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomNiche(value);
    setFormData({
      ...formData,
      niche: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Custom niche input */}
      <div>
        <label htmlFor="niche" className="block text-sm font-medium text-gray-700">
          Enter your niche or industry
        </label>
        <input
          type="text"
          id="niche"
          value={customNiche || formData.niche}
          onChange={handleCustomNicheChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your niche..."
        />
      </div>

      {/* Quick selections */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Or quickly select from common niches
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SUGGESTED_NICHES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNicheSelect(id)}
              className={`p-3 text-left rounded-lg transition-colors
                ${
                  formData.niche === id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};