import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CheckCircle } from 'lucide-react';

interface Caption {
  title: string;
  caption: string;
  cta: string;
  hashtags: string[];
}

interface GeneratedCaptionsProps {
  captions: Caption[];
  isLoading: boolean;
  onSelect?: (caption: Caption) => void;
}

export const GeneratedCaptions = ({ captions, isLoading, onSelect }: GeneratedCaptionsProps) => {
  const [selectedCaption, setSelectedCaption] = useState<number | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optional: Add toast notification for success
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleCardClick = (index: number, caption: Caption) => {
    setSelectedCaption(index);
    onSelect?.(caption);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Generating your captions...
        </p>
      </div>
    );
  }

  if (!captions || captions.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        No captions generated yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {captions.map((caption, index) => (
        <div
          key={index}
          className={`
            relative group cursor-pointer
            bg-white dark:bg-gray-800 p-6 rounded-lg
            border-2 transition-all duration-200 ease-in-out
            ${selectedCaption === index 
              ? 'border-blue-500 ring-2 ring-blue-500/50' 
              : 'border-gray-100 dark:border-gray-700 hover:border-blue-300'}
          `}
          onClick={() => handleCardClick(index, caption)}
        >
          {/* Selection indicator */}
          {selectedCaption === index && (
            <div className="absolute -top-2 -right-2">
              <CheckCircle className="w-6 h-6 text-blue-500 bg-white dark:bg-gray-800 rounded-full" />
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {caption.title}
            </h3>
            
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {caption.caption}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {caption.hashtags.map((tag, i) => (
                <span 
                  key={i} 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 italic">
              {caption.cta}
            </p>

            {/* Actions */}
            <div className="flex justify-end pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(`${caption.caption}\n\n${caption.hashtags.map(tag => `#${tag}`).join(' ')}\n\n${caption.cta}`);
                }}
                className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md 
                          hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                Copy Caption
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};