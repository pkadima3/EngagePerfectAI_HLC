import { useState } from 'react';

interface Caption {
  title: string;
  caption: string;
  cta: string;
  hashtags: string[];
}

interface GeneratedCaptionsProps {
  captions: Array<{
    title: string;
    caption: string;
    cta: string;
    hashtags: string[];
    
  }>;
  isLoading: boolean;
}

export const GeneratedCaptions = ({ captions, isLoading }: GeneratedCaptionsProps) => {
  const [selectedCaption, setSelectedCaption] = useState<number | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!captions || captions.length === 0) {
    return <div>No captions generated yet.</div>;
  }

  return (
    <div className="space-y-6">
      {captions.map((caption, index) => (
        <div
          key={index}
          className={`
            bg-white rounded-lg border transition-all duration-300 cursor-pointer
            ${selectedCaption === index ? 'border-blue-500 shadow-md' : 'border-gray-200'}
            hover:border-blue-300
          `}
          onClick={() => setSelectedCaption(index)}
        >
           <div className="p-4">
           <h3 className="text-lg font-semibold text-gray-800 mb-3">{caption.title}</h3>
            
           <div className="space-y-3">
           <p className="text-gray-600 text-sm">{caption.caption}</p>
              
                      
              <p className="text-gray-500 italic">{caption.cta}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {caption.hashtags.map((hashtag, i) => (
                  <span key={i} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(`${caption.caption}\n\n${caption.hashtags.join(' ')}\n\n${caption.cta}`);
                }}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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