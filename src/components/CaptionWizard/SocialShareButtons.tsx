import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Music, Share2 } from 'lucide-react';
import { shareToSocialMedia, SocialPlatform, trackSocialShare } from '@/lib/social-sharing-utils';
import toast from 'react-hot-toast';

// Interface for the component props
interface SocialShareButtonsProps {
  caption: string;
  mediaUrl?: string;
  selectedPlatform: string;
  isFreeTier?: boolean;
  onNativeShare?: () => Promise<void>; // Added native share callback
}

// Social media platform configuration
const PLATFORMS = {
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    icon: Instagram,
    shareUrl: 'https://www.instagram.com/',
  },
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    icon: Twitter,
    shareUrl: 'https://twitter.com/intent/tweet',
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: Linkedin,
    shareUrl: 'https://www.linkedin.com/sharing/share-offsite/',
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    icon: Facebook,
    shareUrl: 'https://www.facebook.com/sharer/sharer.php',
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    icon: Music,
    shareUrl: 'https://www.tiktok.com/',
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    icon: Youtube,
    shareUrl: 'https://www.youtube.com/',
  },
};

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  caption,
  mediaUrl,
  selectedPlatform,
  isFreeTier = false,
  onNativeShare,
}) => {
  const { user } = useAuth();
  const [sharingPlatform, setSharingPlatform] = useState<string | null>(null);
  const [isNativeSharing, setIsNativeSharing] = useState(false);
  
  // Handle social media share button click
  const handleShare = async (platform: string) => {
    // Don't allow sharing if already in progress
    if (sharingPlatform || isNativeSharing) return;
    
    // Set the platform we're currently sharing to
    setSharingPlatform(platform);
    
    try {
      // Use our social sharing utility
      const result = await shareToSocialMedia(
        platform as SocialPlatform,
        caption,
        mediaUrl,
        user ? user.uid : '',
        isFreeTier
      );
      
      if (result) {
        toast.success(`Shared to ${platform}!`);
        
        // Track the share for analytics if not already tracked in the utility
        if (user?.uid) {
          await trackSocialShare(user.uid, platform as SocialPlatform);
        }
      } else {
        toast.error('Failed to share content');
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      toast.error(`Error sharing to ${platform}`);
    } finally {
      // Reset sharing state
      setSharingPlatform(null);
    }
  };

  // Handle native browser share
  const handleNativeShare = async () => {
    if (sharingPlatform || isNativeSharing || !onNativeShare) return;
    
    setIsNativeSharing(true);
    try {
      await onNativeShare();
      
      // Track the native share
      if (user?.uid) {
        await trackSocialShare(user.uid, 'native' as SocialPlatform);
      }
      
      toast.success('Content shared successfully!');
    } catch (error) {
      console.error('Native share failed:', error);
      toast.error('Failed to share content');
    } finally {
      setIsNativeSharing(false);
    }
  };

  // Check if native sharing is available
  const isNativeShareSupported = 
    typeof navigator !== 'undefined' && 
    navigator.share !== undefined;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
        Share to Social Media
      </h3>
      
      {/* Native Share Button (if supported) */}
      {isNativeShareSupported && onNativeShare && (
        <div className="mb-4">
          <button
            onClick={handleNativeShare}
            disabled={!!sharingPlatform || isNativeSharing}
            className={`
              w-full flex items-center justify-center gap-2 p-3 rounded-lg 
              bg-purple-600 text-white transition-all
              ${(sharingPlatform || isNativeSharing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 hover:shadow-md'}
            `}
          >
            {isNativeSharing ? (
              <span className="inline-block animate-spin mr-1">⌛</span>
            ) : (
              <Share2 size={18} />
            )}
            <span>Share via Browser (WhatsApp, Telegram, etc.)</span>
          </button>
        </div>
      )}
      
      <div className="mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {isNativeShareSupported ? 'Or share directly to:' : 'Share directly to:'}
        </p>
      </div>
      
      {/* Social Media Platform Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {Object.entries(PLATFORMS).map(([platformId, platformData]) => {
          const Icon = platformData.icon;
          const isSelected = selectedPlatform === platformId;
          const isSharing = sharingPlatform === platformId;
          
          return (
            <button
              key={platformId}
              onClick={() => handleShare(platformId)}
              disabled={!!sharingPlatform || isNativeSharing}
              className={`
                flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-all
                ${isSelected 
                  ? 'ring-2 ring-offset-2 ring-blue-500 font-medium' 
                  : ''}
                ${(sharingPlatform || isNativeSharing) && !isSharing
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90 hover:shadow-md'}
              `}
              style={{ backgroundColor: platformData.color, color: 'white' }}
              aria-label={`Share to ${platformData.name}`}
              title={`Share to ${platformData.name}`}
            >
              {isSharing ? (
                <span className="inline-block animate-spin">⌛</span>
              ) : (
                <Icon size={20} />
              )}
              <span className="text-xs sm:text-sm whitespace-nowrap">{platformData.name}</span>
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Note: Some platforms like Instagram, TikTok, and YouTube require manual upload.
      </p>
      
      {/* Selected platform callout */}
      {PLATFORMS[selectedPlatform as keyof typeof PLATFORMS] && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-medium">Tip:</span> You selected {PLATFORMS[selectedPlatform as keyof typeof PLATFORMS].name} as your platform. 
            Click the {PLATFORMS[selectedPlatform as keyof typeof PLATFORMS].name} button above to share directly.
          </p>
        </div>
      )}
    </div>
  );
};