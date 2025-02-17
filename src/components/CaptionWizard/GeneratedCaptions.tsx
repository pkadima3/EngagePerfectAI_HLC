import { useState } from 'react';

interface Caption {
  title: string;
  caption: string;
  hashtags: string[];
  cta: string;
}

interface GeneratedCaptionsProps {
  captions: Caption[];
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

  return (
    <div className="space-y-6">
      {captions.map((caption, index) => (
        <div
          key={index}
          className={`
            rounded-xl border transition-all duration-300 cursor-pointer
            ${selectedCaption === index ? 'border-blue-500 shadow-lg' : 'border-gray-200'}
          `}
          onClick={() => setSelectedCaption(index)}
        >
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">{caption.title}</h3>
            
            <div className="space-y-2">
              <p className="text-gray-600">{caption.caption}</p>
              
              <div className="flex flex-wrap gap-2">
                {caption.hashtags.map((hashtag, i) => (
                  <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                    {hashtag}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-500 italic">{caption.cta}</p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(`${caption.caption}\n\n${caption.hashtags.join(' ')}\n\n${caption.cta}`);
                }}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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