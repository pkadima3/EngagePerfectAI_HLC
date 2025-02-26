import React, { useState, useEffect, useRef } from 'react';
import { ShareIcon, ArrowDownTrayIcon as DownloadIcon } from '@heroicons/react/24/outline';
import { SocialShareButtons } from './SocialShareButtons';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';

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
  platform?: string;
  onShare: () => Promise<void>;
  onDownload?: () => void;
}

export const CaptionPreview = ({
  mediaUrl,
  mediaType,
  selectedCaption,
  platform = 'instagram',
  onShare,
  onDownload
}: CaptionPreviewProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  
  const [isFreeTier, setIsFreeTier] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user?.uid) {
      // In a real app, check user subscription status here
      // For example: getSubscriptionStatus(user.uid).then(status => setIsFreeTier(status === 'free'))
      setIsFreeTier(true);
    }
  }, [user]);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [mediaUrl]);

  // Handle the native browser sharing
  const handleNativeShare = async () => {
    if (isSharing || !selectedCaption) return;
    
    setIsSharing(true);
    const toastId = toast.loading('Preparing content...');
    
    try {
      // Check if Web Share API is available
      if (navigator.share) {
        // Get the sharable content
        const sharableContent = document.getElementById('sharable-content');
        if (!sharableContent) throw new Error('Sharable content not found');
        
        // Create formatted caption text
        const formattedCaption = getFormattedCaption();
        
        // Create share data
        const shareData: {
          title: string;
          text: string;
          files?: File[];
        } = {
          title: selectedCaption.title,
          text: formattedCaption,
        };
        
        // Add media if available
        if (mediaType && mediaType !== 'text-only' && mediaUrl) {
          try {
            if (mediaType === 'image') {
              // Capture image
              const canvas = await html2canvas(sharableContent as HTMLElement, {
                useCORS: true,
                scale: 2,
                logging: false,
                allowTaint: false,
                backgroundColor: getComputedStyle(document.documentElement)
                  .getPropertyValue('--background') || '#ffffff',
              });
              
              // Convert to blob and file
              const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                  (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
                  'image/png', 
                  0.95
                );
              });
              
              const imageFile = new File([blob], `image-${Date.now()}.png`, { type: 'image/png' });
              
              // Check if file sharing is supported
              if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
                shareData.files = [imageFile];
              }
            } else if (mediaType === 'video' && mediaUrl) {
              // For video, fetch the original video
              const response = await fetch(mediaUrl);
              if (!response.ok) throw new Error('Failed to fetch video');
              
              const blob = await response.blob();
              const videoFile = new File(
                [blob], 
                `video-${Date.now()}.${blob.type?.split('/')[1] || 'mp4'}`, 
                { type: blob.type || 'video/mp4' }
              );
              
              // Check if file sharing is supported
              if (navigator.canShare && navigator.canShare({ files: [videoFile] })) {
                shareData.files = [videoFile];
              }
            }
          } catch (err) {
            console.warn('Error preparing media for share:', err);
            // Continue with text-only sharing if media fails
          }
        }

        // Dismiss loading toast
        toast.dismiss(toastId);
        
        // Share the content
        await navigator.share(shareData as ShareData);
        toast.success('Shared successfully!');
        
        // Track the share if needed
        if (user?.uid) {
          await trackSocialShare(user.uid, 'native');
        }
      } else {
        // Fall back to the regular share function
        toast.dismiss(toastId);
        await onShare();
      }
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') {
        // AbortError happens when user cancels the share dialog, which is not an error
        console.error('Share failed:', error);
        toast.error('Failed to share content');
      } else {
        toast.dismiss(toastId);
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Regular share button click handler
  const handleShare = () => {
    if (isSharing || !selectedCaption) return;
    setIsSharing(true);
    
    onShare()
      .catch(error => {
        console.error('Share failed:', error);
        toast.error('Failed to share content');
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
      toast.success('Content downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download content');
    } finally {
      setIsDownloading(false);
    }
  };

  // Format the full caption text including hashtags and CTA
  const getFormattedCaption = () => {
    if (!selectedCaption) return '';
    
    const brandingText = isFreeTier 
      ? '\n\nCreated with EngagePerfect • https://engageperfect.com' 
      : '';
      
    return `${selectedCaption.title}

${selectedCaption.caption}

${selectedCaption.hashtags.map(tag => `#${tag}`).join(' ')}

${selectedCaption.cta}${brandingText}`;
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
            onClick={handleNativeShare}
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

      {/* Preview Content Container */}
      <div id="preview-container" className="preview-container" ref={previewRef}>
        {/* This div will contain ONLY the content to be shared/downloaded */}
        <div id="sharable-content" className="bg-white dark:bg-gray-800">
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
          <div className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedCaption.title}
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedCaption.caption}
              </p>
              
              <div className="space-y-2">
                {selectedCaption.cta && (
                  <p className="text-gray-600 text-xl font-semibold dark:text-white italic">
                    {selectedCaption.cta}
                  </p>
                )}
                {selectedCaption.hashtags.length > 0 && (
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
                )}
                
                {/* Add branding for free tier */}
                {isFreeTier && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                    Created with EngagePerfect • https://engageperfect.com
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* UI Controls - These won't be captured for sharing/downloading */}
        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <SocialShareButtons
            caption={getFormattedCaption()}
            mediaUrl={mediaUrl}
            selectedPlatform={platform || 'instagram'}
            isFreeTier={isFreeTier}
            onNativeShare={handleNativeShare}
          />
        </div>
      </div>
    </div>
  );
};
function trackSocialShare(uid: string, arg1: string) {
  throw new Error('Function not implemented.');
}

