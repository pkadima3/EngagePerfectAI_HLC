import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import socialMediaConfig from './social-media-config';

// Social media platform types
export type SocialPlatform = 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'youtube' | 'native';

// Share result interface
export interface ShareResult {
  success: boolean;
  platform: SocialPlatform;
  error?: string;
  shareUrl?: string;
}

// Media type definitions
export interface MediaData {
  url?: string;
  type?: 'image' | 'video' | 'text-only';
}

// Caption data interface
export interface CaptionData {
  title: string;
  caption: string;
  cta: string;
  hashtags: string[];
}

// User data needed for sharing
interface UserShareData {
  tier: 'free' | 'premium' | 'pro';
  uid: string;
}

// Interface for tracking options
interface TrackingOptions {
  postId?: string; // Optional post ID to track
  includeTimestamp?: boolean; // Whether to include timestamp
}

/**
 * Track a social media share in the user's analytics
 * 
 * @param userId The user's ID
 * @param platform The social media platform that was shared to
 * @param options Additional tracking options
 */
export const trackSocialShare = async (
  userId: string, 
  platform: SocialPlatform,
  options: TrackingOptions = {}
): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Create update object
      const updateData: Record<string, any> = {
        [`shares.${platform}`]: increment(1),
        totalShares: increment(1),
        lastSharePlatform: platform,
      };
      
      // Add timestamp if requested
      if (options.includeTimestamp) {
        updateData.lastSharedAt = serverTimestamp();
      }
      
      // Track daily shares
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      updateData[`sharesByDay.${today}`] = increment(1);
      
      // Update the user document
      await updateDoc(userDocRef, updateData);
      
      // If postId is provided, update the post document as well
      if (options.postId) {
        const postDocRef = doc(db, 'posts', options.postId);
        const postDoc = await getDoc(postDocRef);
        
        if (postDoc.exists()) {
          await updateDoc(postDocRef, {
            shareCount: increment(1),
            [`sharesByPlatform.${platform}`]: increment(1),
            lastSharedAt: serverTimestamp(),
            lastSharePlatform: platform
          });
        }
      }
      
      console.log(`Tracked share to ${platform} for user ${userId}`);
      return true;
    } else {
      console.error('User document not found');
      return false;
    }
  } catch (error) {
    console.error('Error tracking social share:', error);
    return false;
  }
};

/**
 * Format caption with hashtags, CTA, and optional branding
 */
export const formatFullCaption = (
  captionData: CaptionData, 
  isFreeTier: boolean = false
): string => {
  const { title, caption, cta, hashtags } = captionData;
  
  const formattedCaption = `${title}

${caption}

${hashtags.map(tag => `#${tag}`).join(' ')}

${cta}`;

  // Add EngagePerfect branding for free tier users
  const brandingText = isFreeTier 
    ? '\n\nCreated with EngagePerfect • https://engageperfect.com' 
    : '';
    
  return formattedCaption + brandingText;
};

/**
 * Share content to a social media platform
 * 
 * @param platform The social media platform to share to
 * @param caption The caption to share
 * @param mediaUrl Optional media URL to share
 * @param userId The user's ID (for analytics tracking)
 * @param isFreeTier Whether the user is on the free tier (for branding)
 * @param postId Optional post ID to track in analytics
 */
export const shareToSocialMedia = async (
  platform: SocialPlatform,
  caption: string,
  mediaUrl: string | undefined,
  userId: string,
  isFreeTier: boolean = false,
  postId?: string
): Promise<boolean> => {
  // Add EngagePerfect branding for free tier users
  const brandingText = isFreeTier ? '\n\nCreated with EngagePerfect • https://engageperfect.com' : '';
  const fullCaption = caption + brandingText;
  
  // For native sharing, handle differently
  if (platform === 'native') {
    try {
      // Track the share in analytics
      if (userId) {
        await trackSocialShare(userId, platform, { postId, includeTimestamp: true });
      }
      return true;
    } catch (error) {
      console.error('Error with native sharing:', error);
      return false;
    }
  }
  
  let shareUrl = '';
  
  // Create share URL based on platform
  switch (platform) {
    case 'twitter':
      // Twitter (now X) share URL
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullCaption)}&url=${encodeURIComponent(mediaUrl || '')}`;
      break;
    
    case 'facebook':
      // Facebook share URL
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mediaUrl || '')}&quote=${encodeURIComponent(fullCaption)}`;
      break;
    
    case 'linkedin':
      // LinkedIn share URL
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(mediaUrl || '')}&summary=${encodeURIComponent(fullCaption)}`;
      break;
    
    case 'instagram':
      // Instagram doesn't support direct sharing via URL, but we can open Instagram
      alert('For Instagram, please use the "Download" button and upload the content manually to Instagram.');
      // You could open Instagram app/website here
      shareUrl = 'https://www.instagram.com/';
      break;
    
    case 'tiktok':
      // TikTok doesn't support direct sharing via URL
      alert('For TikTok, please use the "Download" button and upload the content manually to TikTok.');
      shareUrl = 'https://www.tiktok.com/';
      break;
    
    case 'youtube':
      // YouTube doesn't support direct sharing via URL
      alert('For YouTube, please use the "Download" button and upload the content manually to YouTube.');
      shareUrl = 'https://www.youtube.com/';
      break;
    
    default:
      console.error(`Unsupported platform: ${platform}`);
      return false;
  }
  
  // Open the share URL in a new window
  if (shareUrl) {
    try {
      const shareWindow = window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Check if the window opened successfully
      if (!shareWindow || shareWindow.closed || typeof shareWindow.closed === 'undefined') {
        console.warn('Popup blocked. Please allow popups for this website.');
        return false;
      }
      
      // Track the share for analytics
      if (userId) {
        await trackSocialShare(userId, platform, { postId, includeTimestamp: true });
      }
      
      return true;
    } catch (error) {
      console.error(`Error opening share window for ${platform}:`, error);
      return false;
    }
  }
  
  return false;
};

/**
 * Check if native sharing is supported in the browser
 */
export const isNativeSharingSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 
         typeof navigator.share === 'function' && 
         typeof navigator.canShare === 'function';
};

/**
 * Check if file sharing is supported in the browser
 */
export const isFileSharingSupported = (file?: File): boolean => {
  if (!isNativeSharingSupported() || !file) {
    return false;
  }
  
  try {
    return navigator.canShare({ files: [file] });
  } catch (error) {
    console.error('Error checking file sharing support:', error);
    return false;
  }
};