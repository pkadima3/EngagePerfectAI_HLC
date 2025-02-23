import React, { useState, useEffect } from 'react';
import { ShareIcon, ArrowDownTrayIcon as DownloadIcon } from '@heroicons/react/24/outline';

interface Caption {
  title: string;
  caption: string;

  cta: string;
  hashtags: string[];
}

interface CaptionPreviewProps {
  mediaUrl?: string;
  mediaType?: string;
  selectedCaption: Caption | null;
  onShare: () => Promise<void>;
  onDownload?: () => void;
}

export const CaptionPreview = ({
  mediaUrl,
  mediaType,
  selectedCaption,
  onShare,
  onDownload
}: CaptionPreviewProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [mediaUrl]);

  const handleShare = () => {
    if (isSharing || !selectedCaption) return;
    setIsSharing(true);
    
    onShare()
      .catch(error => {
        console.error('Share failed:', error);
      })
      .finally(() => {
        setIsSharing(false);
      });
  };

  const handleDownload = async () => {
    if (isDownloading || !onDownload) return;
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  if (!selectedCaption) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
          Select a caption to see preview
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Preview
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleShare}
            disabled={isSharing || !selectedCaption}
            className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
            title="Share"
          >
            {isSharing ? (
              <span className="inline-block animate-spin">⌛</span>
            ) : (
              <ShareIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
            title="Download"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div id="preview-content" className="preview-container">
        {/* Media Section - Only show if not text-only */}
        {mediaType && mediaType !== 'text-only' && (
          <div className="w-full bg-gray-100 dark:bg-gray-900">
            {mediaType === 'image' && mediaUrl ? (
              <div className="relative">
                <img
                  src={mediaUrl}
                  alt="Preview"
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  crossOrigin="anonymous"
                />
              </div>
            ) : mediaType === 'video' && mediaUrl ? (
              <video
                src={mediaUrl}
                className="w-full h-full object-contain"
                controls
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  {imageError ? 'Error loading media' : 'No media'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Caption Content */}
        <div className="p-6 bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedCaption.title}
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {selectedCaption.caption}
            </p>
            
          
            
            <p className="text-gray-600 text-xl font-semibold dark:text-white italic">
              {selectedCaption.cta}

              <div className="flex flex-wrap gap-2">
              {selectedCaption.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-blue-600 dark:text-blue-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};