// sharing-utils.ts

import html2canvas from 'html2canvas';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type MediaType = 'image' | 'video';

interface Caption {
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
      const captionHeight = 200; // Height for caption area
      canvas.height = videoElement.videoHeight + captionHeight;

      // Configure caption style
      ctx.fillStyle = '#1e1e1e'; // Dark background for caption
      ctx.font = '18px Arial';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'white';

      // Set up video recording
      const stream = canvas.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000 // 5 Mbps for good quality
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
        ctx.font = 'bold 18px Arial';
        let y = videoElement.videoHeight + 20;

        // Title
        ctx.fillText(caption.title, 20, y);
        y += 30;

        // Main caption text
        ctx.font = '16px Arial';
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

// Share preview function
export const sharePreview = async (
  previewRef: React.RefObject<HTMLDivElement>,
  caption: Caption,
  mediaType: MediaType,
  event: React.MouseEvent<HTMLButtonElement>
) => {
  event.preventDefault(); // Prevent default at the start
  
  if (!previewRef.current) throw new Error('Preview element not found');

  try {
    const previewContent = previewRef.current.querySelector('#preview-content');
    if (!previewContent) throw new Error('Preview content not found');

    let file: File;
    if (mediaType === 'video') {
      const video = previewContent.querySelector('video');
      if (!video) throw new Error('Video element not found');
      const blob = await createCaptionedVideo(video, caption);
      file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
    } else {
      const canvas = await html2canvas(previewContent as HTMLElement, {
        useCORS: true,
        scale: 2,
        logging: false,
      });
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Failed to create blob')), 'image/png', 1.0);
      });
      file = new File([blob], `image-${Date.now()}.png`, { type: 'image/png' });
    }

    const shareData = {
      title: caption.title,
      text: `${caption.caption}\n\n${caption.hashtags.map(tag => `#${tag}`).join(' ')}\n\n${caption.cta}`,
      files: [file]
    };

    // Check if sharing is supported
    if (!navigator.canShare || !navigator.canShare(shareData)) {
      return { status: 'fallback' };
    }

    // Share within the click event context
    await navigator.share(shareData);
    return { status: 'shared' };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { status: 'cancelled' };
    }
    throw error;
  }
};

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