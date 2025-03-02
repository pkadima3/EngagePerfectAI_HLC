'use client';

import { useState, useRef } from 'react';
import { WizardLayout } from '@/components/ui/WizardLayout';
import { MediaUpload } from '@/components/CaptionWizard/MediaUpload';
import { NicheSelection } from '@/components/CaptionWizard/NicheSelection';
import { PlatformSelection } from '@/components/CaptionWizard/PlatformSelection';
import { GoalSelection } from '@/components/CaptionWizard/GoalSelection';
import { ToneSelection } from '@/components/CaptionWizard/ToneSelection';
import { CaptionFormData } from '@/types/caption';
import { generateCaptions } from '@/lib/openai';
import { GeneratedCaptions } from '@/components/CaptionWizard/GeneratedCaptions';
import { CaptionPreview } from '@/components/CaptionWizard/CaptionPreview';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { sharePreview, downloadPreview } from '@/lib/sharing-utils';

import { MediaType } from '@/lib/sharing-utils';
import html2canvas from 'html2canvas';
//import { trackSocialShare } from '@/lib/social-sharing';

//TO BE USED IN THE FUTURE +++++++++++++++++++++++++++++++++
/*import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';*/

import { shareToSocialMedia, trackSocialShare } from '@/lib/social-sharing-utils';

interface Caption {
  title: string;
  caption: string;

  cta: string;
  hashtags: string[];
}

export default function CaptionGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const previewRef = useRef<HTMLDivElement | null>(null) as React.RefObject<HTMLDivElement>;
  
  const [formData, setFormData] = useState<CaptionFormData>({
    mediaType: undefined,
    mediaUrl: '',
    niche: '',
    platform: 'instagram',
    goal: '',
    tone: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<Caption[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<Caption | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | undefined>(undefined);

  const steps = [
    {
      title: 'Upload Media',
      description: 'Upload your image or video, or choose text-only',
      isCompleted: !!formData.mediaType
    },
    {
      title: 'Select Niche',
      description: 'Choose your industry or niche',
      isCompleted: !!formData.niche
    },
    {
      title: 'Platform',
      description: 'Select social media platform',
      isCompleted: !!formData.platform
    },
    {
      title: 'Goal',
      description: 'What do you want to achieve?',
      isCompleted: !!formData.goal
    },
    {
      title: 'Tone',
      description: 'Choose your caption tone',
      isCompleted: !!formData.tone
    },
    {
      title: 'Generated Captions',
      description: 'Choose your preferred caption',
      isCompleted: true
    }
  ];

  const handleNext = () => {
    // If we're on the last step, don't do anything
    if (currentStep >= steps.length - 1) return;
    
    // Don't auto-generate on step 4 (tone selection) - use the Generate button instead
    if (currentStep === 4) return;
    
    // Otherwise, move to the next step
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!formData.tone) {
      toast.warning('Please select a tone first');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedCaptions([]); // Clear previous captions while loading
    setSelectedCaption(null);
    
    try {
      const captions = await generateCaptions({
        platform: formData.platform,
        niche: formData.niche,
        tone: formData.tone,
        goal: formData.goal,
        mediaType: formData.mediaType
      });
      
      setGeneratedCaptions(captions);
      toast.success('Captions generated successfully!');
      
      // Move to caption results page after successful generation
      setCurrentStep(5);
      
    } catch (error) {
      console.error('Failed to generate captions:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate captions');
      
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCaptionSelect = (caption: Caption) => {
    setSelectedCaption(caption);
  };

const handleShare = async () => {
  if (!selectedCaption) {
    toast.warning('Please select a caption first');
    return;
  }

  setIsSharing(true);
  try {
    // Create formatted caption text with all parts combined
    const captionText = `${selectedCaption.title}\n\n${selectedCaption.caption}\n\n${selectedCaption.hashtags.map(tag => `#${tag}`).join(' ')}\n\n${selectedCaption.cta}`;
    
    // Add sharing logic here
    // Determine if user is on free tier (based on user object)
    let isFreeTier = true; // Default to free tier for now
    
    // If we have user data, check if they're on a paid plan
    // Note: You'll need to add proper user subscription info in your AuthContext
    if (user && typeof user === 'object') {
      // Access custom user properties safely with optional chaining
      const userCustomData = (user as any).customData;
      if (userCustomData && userCustomData.subscription === 'premium') {
      isFreeTier = false;
      }
    }

    // Add branding for free tier users
    const shareText = isFreeTier 
      ? `${captionText}\n\nCreated with EngagePerfect • https://engageperfect.com`
      : captionText;
    
    // Get the sharable content element
    const sharableContent = document.getElementById('sharable-content');
    if (!sharableContent) {
      toast.error('Content not found for sharing');
      return;
    }
    
    // Create basic share data
    const shareData: ShareData = {
      title: selectedCaption.title,
      text: shareText,
    };

    // Try to get media if available
    if (formData.mediaType && formData.mediaType !== 'text-only' && formData.mediaUrl) {
      // Try to get the media file for sharing
      let mediaFile: File | undefined;
      
      try {
        if (formData.mediaType === 'video') {
          // For video content
          const video = sharableContent.querySelector('video');
          if (!video) throw new Error('Video element not found');
          
          // Create captioned video
          const shareToastId = toast.loading('Creating captioned video...');
          
          try {
            // Create a captioned video with the selected caption
            mediaFile = await createCaptionedVideo(video, selectedCaption);
          } catch (captionError) {
            console.warn('Error creating captioned video, using original:', captionError);
            
            // Fallback to original video if captioning fails
            const response = await fetch(video.src);
            if (!response.ok) throw new Error('Failed to fetch video');
            
            const blob = await response.blob();
            mediaFile = new File([blob], `video-${Date.now()}.${blob.type?.split('/')[1] || 'mp4'}`, { 
              type: blob.type || 'video/mp4' 
            });
          }
          
          toast.dismiss(shareToastId);
        } else if (formData.mediaType === 'image') {
          // For image content
          // Show loading indicator during rendering
          const shareToastId = toast.loading('Preparing image...');
          
          const canvas = await html2canvas(sharableContent, {
            useCORS: true,
            scale: 2, // Better quality
            logging: false,
            allowTaint: false,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background') || '#ffffff',
            ignoreElements: (element) => {
              // Ignore any UI controls that shouldn't be in the shared image
              return element.classList.contains('social-share-buttons') || 
                     element.classList.contains('preview-controls');
            }
          });
          
          // Dismiss loading toast
          toast.dismiss(shareToastId);
          
          const blob = await new Promise<Blob>((resolve, reject) => 
            canvas.toBlob(
              (b) => b ? resolve(b) : reject(new Error('Failed to create image')), 
              'image/png', 
              0.95
            )
          );
          
          mediaFile = new File([blob], `image-${Date.now()}.png`, { type: 'image/png' });
        }

        // Try sharing with media if available
        if (mediaFile && navigator.canShare && navigator.canShare({ files: [mediaFile] })) {
          // Create proper share data with file
          const fileShareData = {
            title: shareData.title,
            text: shareData.text,
            files: [mediaFile]
          };
          
          await navigator.share(fileShareData);
          toast.success('Content shared successfully!');
          
          // Track the share in analytics
          if (user?.uid) {
            await trackSocialShare(user.uid, 'native', {
              postId: currentPostId,
              includeTimestamp: true
            });
          }
          return;
        }
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') {
          console.error('Error preparing media for share:', error);
        }
        // Continue to text-only sharing if media sharing fails
      }
    }

    // If we reach here, we couldn't share with media - try text-only sharing
    if (navigator.share) {
      await navigator.share(shareData);
      toast.success('Caption shared successfully!');
      
      // Track the share in analytics
      if (user?.uid) {
        await trackSocialShare(user.uid, 'native', {
          postId: currentPostId,
          includeTimestamp: true
        });
      }
    } else {
      // Fallback to clipboard if Web Share API is not available
      await navigator.clipboard.writeText(shareText);
      toast.success('Caption copied to clipboard!');
    }
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') {
      // User cancelled the share - no error message needed
      console.log('Share cancelled by user');
    } else {
      console.error('Error sharing:', error);
      toast.error('Failed to share content');
    }
  } finally {
    setIsSharing(false);
  }
};

const handleDownload = async () => {
  if (!selectedCaption) {
    toast.warning('Please select a caption first');
    return;
  }

  try {
    // For text-only captions or when no media type is specified
    if (!formData.mediaType || formData.mediaType === 'text-only') {
      const content = `${selectedCaption.title}\n\n${selectedCaption.caption}\n\n${selectedCaption.hashtags.map(tag => `#${tag}`).join(' ')}\n\n${selectedCaption.cta}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedCaption.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Caption downloaded successfully!');
      return;
    }

    // For media content, use the existing download logic
    await downloadPreview(
      previewRef,
      formData.mediaType as MediaType,
      selectedCaption
    );
    toast.success('Downloaded successfully!');
  } catch (error) {
    console.error('Error downloading:', error);
    toast.error('Failed to download content');
  }
};

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <MediaUpload formData={formData} setFormData={setFormData} onNext={handleNext} />;
      case 1:
        return <NicheSelection formData={formData} setFormData={setFormData} />;
      case 2:
        return <PlatformSelection formData={formData} setFormData={setFormData} />;
      case 3:
        return <GoalSelection formData={formData} setFormData={setFormData} />;
      case 4:
        return (
          <ToneSelection 
            formData={formData} 
            setFormData={setFormData}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        );
      case 5:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Captions */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Choose Your Caption
              </h2>
              <GeneratedCaptions 
                captions={generatedCaptions} 
                isLoading={isGenerating}
                onSelect={handleCaptionSelect}
              />
            </div>
            
            {/* Right side: Preview */}
            <div className="lg:col-span-6">
              <div className="sticky top-8 space-y-6">
                {/* Caption Preview */}
                <div ref={previewRef}>
                  <CaptionPreview
                    mediaUrl={formData.mediaUrl}
                    mediaType={formData.mediaType}
                    selectedCaption={selectedCaption}
                    platform={formData.platform}  // Add this line to pass the selected platform
                    onShare={handleShare}
                    onDownload={handleDownload}
                  />
                </div>
                
                {/* Caption Details */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Caption Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Platform:</span>
                      <span className="font-medium">{formData.platform}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Niche:</span>
                      <span className="font-medium">{formData.niche}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Tone:</span>
                      <span className="font-medium">{formData.tone}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Goal:</span>
                      <span className="font-medium">{formData.goal}</span>
                    </p>
                  </div>
                </div>
                
                {/* Sharing options */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Share Your Content
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      disabled={!selectedCaption}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share
                    </button>
                    
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      disabled={!selectedCaption}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Caption Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create engaging captions for your social media posts with AI assistance
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <WizardLayout
              currentStep={currentStep}
              steps={steps}
              onNext={handleNext}
              onPrev={handlePrev}
              isNextDisabled={!steps[currentStep].isCompleted}
              isGenerating={isGenerating}
              hideNextButton={currentStep === 4}
            >
              <div className="p-6 md:p-8">
                {renderStep()}
              </div>
            </WizardLayout>
          </div>
        </div>
      </div>
    </div>
  );
}

async function createCaptionedVideo(video: HTMLVideoElement, selectedCaption: Caption): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas elements
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }

      // Match canvas size to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Set up MediaRecorder to capture the canvas
      const stream = canvas.captureStream(30); // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9', // Most compatible format
        videoBitsPerSecond: 5000000 // 5 Mbps for good quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Combine recorded chunks into a single blob
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `captioned-video-${Date.now()}.webm`, { 
          type: 'video/webm'
        });
        resolve(file);
      };

      // Start recording
      mediaRecorder.start();

      // Format caption text
      const captionText = selectedCaption.caption;
      const hashtagsText = selectedCaption.hashtags.map(tag => `#${tag}`).join(' ');

      // Helper function to draw a frame with caption
      const drawFrame = () => {
        if (video.ended || video.paused) {
          mediaRecorder.stop();
          return;
        }

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Apply semi-transparent background for captions
        const captionAreaHeight = canvas.height * 0.3; // Use 30% of height for caption area
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, canvas.height - captionAreaHeight, canvas.width, captionAreaHeight);

        // Draw caption text
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(canvas.height * 0.04)}px Arial`;
        ctx.textAlign = 'center';

        // Draw title at top
        ctx.fillText(selectedCaption.title, canvas.width / 2, canvas.height - captionAreaHeight + 40);

        // Draw caption text (may need to wrap)
        const maxLineWidth = canvas.width * 0.9;
        const lineHeight = Math.round(canvas.height * 0.05);
        const words = captionText.split(' ');
        let line = '';
        let y = canvas.height - captionAreaHeight + 80;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxLineWidth && i > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = words[i] + ' ';
            y += lineHeight;
            
            // Prevent text from going off screen
            if (y > canvas.height - 20) break;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, canvas.width / 2, y);

        // Draw hashtags at bottom
        ctx.font = `${Math.round(canvas.height * 0.03)}px Arial`;
        ctx.fillText(hashtagsText, canvas.width / 2, canvas.height - 30);

        // Request next frame
        requestAnimationFrame(drawFrame);
      };

      // Handle video playback
      video.addEventListener('play', () => {
        drawFrame();
      });

      // Start video playback
      video.currentTime = 0;
      video.muted = false; // Keep original audio
      video.play().catch(error => {
        console.error('Video playback failed:', error);
        mediaRecorder.stop();
        reject(new Error('Failed to play video for processing'));
      });

      // Set timeout to stop recording if video is too long (max 60 seconds)
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          video.pause();
          mediaRecorder.stop();
        }
      }, 60000);
    } catch (error) {
      reject(error);
    }
  });
}

