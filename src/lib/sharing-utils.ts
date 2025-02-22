// sharing-utils.ts

import html2canvas from 'html2canvas';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type MediaType = 'image' | 'video' | 'text-only';

export interface Caption {
  title: string;
  caption: string;
  hashtags: string[];
  cta: string;
}

// Helper function to create video with caption overlay
const createCaptionedVideo = async (videoElement: HTMLVideoElement, caption: Caption): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas with space for video and caption
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Set canvas dimensions
      canvas.width = videoElement.videoWidth;
      const captionHeight = 220; // Height for caption area
      canvas.height = videoElement.videoHeight + captionHeight;

      // Configure caption style
      ctx.fillStyle = '#1e1e1e'; // Dark background for caption
      ctx.font = '20px Arial';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'white';

      // Set up video recording
      const stream = canvas.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 3000000 // 3 Mbps for good quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: 'video/webm' });
        resolve(finalBlob);
      };

      // Start recording
      mediaRecorder.start();

      // Function to draw a frame
      const drawFrame = () => {
        // Clear canvas
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw video frame
        ctx.drawImage(videoElement, 0, 0);

        // Draw caption background
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, videoElement.videoHeight, canvas.width, captionHeight);

        // Draw caption text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        let y = videoElement.videoHeight + 20;

        // Title
        ctx.fillText(caption.title, 20, y);
        y += 30;

        // Main caption text
        ctx.font = '20px Arial';
        const words = caption.caption.split(' ');
        let line = '';
        for (const word of words) {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > canvas.width - 40) {
            ctx.fillText(line, 20, y);
            line = word + ' ';
            y += 25;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 20, y);
        y += 30;

        // Hashtags
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(caption.hashtags.map(tag => `#${tag}`).join(' '), 20, y);
        y += 25;

        // CTA
        ctx.fillStyle = '#9ca3af';
        ctx.fillText(caption.cta, 20, y);

        // Request next frame if video is still playing
        if (!videoElement.ended && !videoElement.paused) {
          requestAnimationFrame(drawFrame);
        } else {
          mediaRecorder.stop();
        }
      };

      // Start playing video and drawing frames
      videoElement.play();
      drawFrame();

      // Stop recording when video ends
      videoElement.onended = () => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      };

    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to upload to Firebase
const uploadToFirebase = async (blob: Blob, caption: Caption, mediaType: MediaType): Promise<string> => {
  const storage = getStorage();
  const fileName = `previews/${caption.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${mediaType === 'video' ? 'webm' : 'png'}`;
  const storageRef = ref(storage, fileName);
  
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};

/* =============================Helper function to create share data=============================
const createShareData = (caption: Caption, mediaUrl?: string) => {
  const data: ShareData = {
    title: caption.title,
    text: `${caption.caption}\n\n${caption.hashtags.map(tag => `#${tag}`).join(' ')}\n\n${caption.cta}`
  };
  
  if (mediaUrl) {
    data.url = mediaUrl;
  }
  
  return data;
};

export const sharePreview = async (
  previewRef: React.RefObject<HTMLDivElement>,
  caption: Caption,
  mediaType: MediaType
): Promise<{ status: 'shared' | 'fallback' | 'cancelled', message?: string }> => {
  if (!previewRef.current) throw new Error('Preview element not found');

  /*try {
    // Check if Web Share API is available
    if (!navigator.share) {
      return { status: 'fallback', message: 'Sharing not supported on this device' };
    }

    // Try text-only sharing first
    const basicShareData = createShareData(caption);
    
    // For text-only content, try basic sharing
    if (mediaType === 'text-only') {
      if (navigator.canShare(basicShareData)) {
        await navigator.share(basicShareData);
        return { status: 'shared', message: 'Content shared successfully' };
      }
      return { status: 'fallback', message: 'Cannot share this content' };
    }

    // Handle media sharing
    const previewContent = previewRef.current.querySelector('#preview-content');
    if (!previewContent) throw new Error('Preview content not found');

    let mediaBlob: Blob;
    if (mediaType === 'video') {
      const video = previewContent.querySelector('video');
      if (!video) throw new Error('Video element not found');
      mediaBlob = await createCaptionedVideo(video, caption);
    } else {
      const canvas = await html2canvas(previewContent as HTMLElement, {
        useCORS: true,
        scale: 2,
        logging: false,
      });
      mediaBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
          'image/png',
          1.0
        );
      });
    }

    // Create a file object for sharing
    const file = new File(
      [mediaBlob],
      `${caption.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${mediaType === 'video' ? 'webm' : 'png'}`,
      { type: mediaType === 'video' ? 'video/webm' : 'image/png' }
    );

    // Try native file sharing
    const shareDataWithFile = {
      ...basicShareData,
      files: [file]
    };

    if (navigator.canShare(shareDataWithFile)) {
      await navigator.share(shareDataWithFile);
      return { status: 'shared', message: 'Content shared with media' };
    }

    // If file sharing fails, upload to Firebase and share URL
    const mediaUrl = await uploadToFirebase(mediaBlob, caption, mediaType);
    const shareDataWithUrl = createShareData(caption, mediaUrl);

    await navigator.share(shareDataWithUrl);
    return { status: 'shared', message: 'Content shared via link' };

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { status: 'cancelled', message: 'Sharing cancelled' };
      }
      throw new Error(`Sharing failed: ${error.message}`);
    }
    throw error;
  }
};*/
//==================================================================================================

// Share preview function
export const sharePreview = async (
  previewRef: React.RefObject<HTMLDivElement>,
  caption: Caption,
  mediaType: MediaType
): Promise<{ status: 'shared' | 'fallback' | 'cancelled'; message?: string }> => {
  if (!previewRef.current) throw new Error('Preview element not found');

  try {
    const previewContent = previewRef.current.querySelector('#preview-content');
    if (!previewContent) throw new Error('Preview content not found');

    // Create basic share data
    const shareData: ShareData = {
      title: caption.title,
      text: `${caption.caption}\n\n${caption.hashtags.map(tag => `#${tag}`).join(' ')}\n\n${caption.cta}`
    };

    // Handle different media types
    let mediaFile: File | undefined;
    if (mediaType === 'video') {
      const video = previewContent.querySelector('video');
      if (!video) throw new Error('Video element not found');
      
      // Use createCaptionedVideo to get the video with captions
      const captionedVideoBlob = await createCaptionedVideo(video, caption);
      mediaFile = new File([captionedVideoBlob], `video-${Date.now()}.webm`, { type: 'video/webm' });
    } else if (mediaType === 'image') {
      const canvas = await html2canvas(previewContent as HTMLElement, {
        useCORS: true,
        scale: 2,
        logging: false,
      });
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Failed to create blob')), 'image/png', 1.0);
      });
      mediaFile = new File([blob], `image-${Date.now()}.png`, { type: 'image/png' });
    }

    // Try sharing with media if available
    if (mediaFile) {
      const shareDataWithFile = { ...shareData, files: [mediaFile] };
      if (navigator.canShare && navigator.canShare(shareDataWithFile)) {
        await navigator.share(shareDataWithFile);
        return { status: 'shared', message: 'Content shared with media' };
      }

      // If file sharing fails, upload to Firebase and share URL
      const mediaUrl = await uploadToFirebase(mediaFile, caption, mediaType);
      const shareDataWithUrl = { ...shareData, url: mediaUrl };

      if (navigator.share) {
        await navigator.share(shareDataWithUrl);
        return { status: 'shared', message: 'Content shared via link' };
      }
    }

    // Fallback to basic text sharing
    if (navigator.share) {
      await navigator.share(shareData);
      return { status: 'shared', message: 'Content shared (text only)' };
    }

    return { status: 'fallback', message: 'Sharing not supported' };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { status: 'cancelled', message: 'Share cancelled' };
      }
      throw error;
    }
    throw error;
  }
};

// =============================Helper function to download preview=============================
// Download preview function
export const downloadPreview = async (
  previewRef: React.RefObject<HTMLDivElement>,
  caption: Caption,
  mediaType: MediaType
) => {
  if (!previewRef.current) throw new Error('Preview element not found');

  const previewContent = previewRef.current.querySelector('#preview-content');
  if (!previewContent) throw new Error('Preview content not found');

  try {
    let blob: Blob;

    if (mediaType === 'video') {
      const video = previewContent.querySelector('video');
      if (!video) throw new Error('Video element not found');
      
      // Create captioned video
      blob = await createCaptionedVideo(video, caption);
    } else {
      const canvas = await html2canvas(previewContent as HTMLElement, {
        useCORS: true,
        scale: 2,
        logging: false,
      });
      
      blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
          'image/png',
          1.0
        );
      });
    }

    // Upload to Firebase
    await uploadToFirebase(blob, caption, mediaType);

    // Download locally
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${caption.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${mediaType === 'video' ? 'webm' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error downloading:', error);
    throw error;
  }
};

