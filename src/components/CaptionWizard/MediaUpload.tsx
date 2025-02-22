import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { WizardStepProps, CaptionFormData } from '@/types/caption';
import { 
  ArrowUpTrayIcon, 
  CameraIcon, 
  ArrowPathIcon,
  XMarkIcon,
  ArrowRightIcon // Add this import
} from '@heroicons/react/24/outline';
import { 
  ArrowsPointingOutIcon,
  ArrowUturnLeftIcon,
  PaintBrushIcon
} from '@heroicons/react/24/solid';
import { dataURLtoFile } from '@/lib/storage-utils'; // Remove uploadMedia import
import { useAuth } from '@/contexts/AuthContext';

interface MediaUploadProps {
  formData: CaptionFormData;
  setFormData: (data: CaptionFormData) => void;
  onNext: () => void;  // Add this prop
}

export function MediaUpload({ formData, setFormData, onNext }: MediaUploadProps) {
  // State variables
  const [isEditing, setIsEditing] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeFilter, setActiveFilter] = useState('none');
  const [isCropping, setIsCropping] = useState(false);
  const [rawFile, setRawFile] = useState<File | null>(null);
  
  // Get user from auth context
  const { user } = useAuth();
  
  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Handle file upload via dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileSelected(file);
    }
  }, [formData, setFormData]);

  // Process selected file (from dropzone or file input)
  const handleFileSelected = (file: File) => {
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    const url = URL.createObjectURL(file);
    
    // Store the original image URL and raw file for later upload
    setOriginalImageUrl(url);
    setRawFile(file);
    
    // Reset editing states when new image is uploaded
    setRotationAngle(0);
    setActiveFilter('none');
    setIsCropping(false);
    
    setFormData({
      ...formData,
      mediaType: fileType,
      mediaUrl: url
    });
  };
  
  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.mov']
    }
  });
  
  // Safe click handler for upload button
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  // Text-only caption option
  const handleTextOnly = () => {
    setFormData({
      ...formData,
      mediaType: 'text-only',
      mediaUrl: ''
    });
    onNext(); // Move to next step automatically for text-only
  };
  
  // Image editing functions
  const handleRotate = () => {
    // Rotate 90 degrees clockwise each time
    const newAngle = (rotationAngle + 90) % 360;
    setRotationAngle(newAngle);
  };
  
  const handleCrop = () => {
    setIsCropping(true);
    alert('Cropping tool activated! Drag to select area.');
    
    // In a real implementation, you would show a cropping interface here
    // For simplicity, we're just toggling a state and showing an alert
  };
  
  const handleColorFilter = () => {
    // Cycle through basic filters
    const filters = ['none', 'grayscale', 'sepia', 'saturate'];
    const currentIndex = filters.indexOf(activeFilter);
    const nextFilter = filters[(currentIndex + 1) % filters.length];
    setActiveFilter(nextFilter);
  };
  
  const handleReset = () => {
    // Reset rotation and filters
    setRotationAngle(0);
    setActiveFilter('none');
    setIsCropping(false);
    
    // If we stored original image, restore it
    if (originalImageUrl) {
      setFormData({
        ...formData,
        mediaUrl: originalImageUrl
      });
    }
  };
  
  const handleClose = () => {
    // Clear all image data
    setFormData({
      ...formData,
      mediaType: undefined,
      mediaUrl: ''
    });
    setOriginalImageUrl('');
    setRotationAngle(0);
    setActiveFilter('none');
    setIsCropping(false);
    setRawFile(null);
  };

  // Camera functionality
  const handleUseCamera = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      // Set up a video element to show camera stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        
        // Show the video element (normally would be done through state)
        if (videoRef.current.style) {
          videoRef.current.style.display = 'block';
        }
      }
      
      alert('Camera activated! Click anywhere on the video to capture.');
      
      // Set a click handler to capture photo
      if (videoRef.current) {
        videoRef.current.onclick = () => {
          capturePhoto(stream);
        };
      }
    } catch (err) {
      alert('Cannot access camera. Please check permissions.');
      console.error('Camera access error:', err);
    }
  };
  
  // Capture photo from camera
  const capturePhoto = (stream: MediaStream) => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image URL
        const imageUrl = canvas.toDataURL('image/jpeg');
        
        // Stop camera stream
        stream.getTracks().forEach(track => track.stop());
        
        // Hide video element
        video.style.display = 'none';
        video.srcObject = null;
        
        // Create a file from the canvas data URL
        const file = dataURLtoFile(imageUrl, 'camera-capture.jpg');
        setRawFile(file);
        
        // Set captured image as media
        setOriginalImageUrl(imageUrl);
        setFormData({
          ...formData,
          mediaType: 'image',
          mediaUrl: imageUrl
        });
      }
    }
  };

  // Handle upload to Firebase and move to next step
  const handleContinue = () => {
    if (!rawFile && formData.mediaType !== 'text-only') {
      alert('Please select or capture media first.');
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Left side - Upload area */}
      <div className="w-full md:w-1/2 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">
          {formData.mediaUrl ? 'Media uploaded' : 'Upload your media'}
        </h2>
        
        <p className="text-gray-600 mb-4">
          Upload your media or capture directly to get AI-powered captions
        </p>
        
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            transition-all duration-200 cursor-pointer
          `}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <ArrowUpTrayIcon className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-center text-gray-600">
            Drag & drop your media here, or click to select
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports images and videos up to 50MB
          </p>
        </div>
        
        <div className="mt-6 flex gap-3">
          {/* Fixed upload button using manual file input */}
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
            Upload Media
          </button>
          
          {/* Hidden file input element that's actually used */}
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*,video/*"
            style={{ display: 'none' }}
          />
          
          <button
            type="button"
            onClick={handleUseCamera}
            className="flex-1 py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <CameraIcon className="h-5 w-5" />
            Use Camera
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <span className="text-gray-500">or</span>
          <button
            type="button"
            onClick={handleTextOnly}
            className={`ml-2 text-blue-600 hover:underline
              ${formData.mediaType === 'text-only' ? 'font-bold' : ''}`}
          >
            Create text-only caption
          </button>
        </div>
      </div>
      
      {/* Right side - Preview and editor */}
      <div className="w-full md:w-1/2 flex flex-col">
        {formData.mediaUrl && formData.mediaType !== 'text-only' ? (
          <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex flex-col h-full min-h-[280px]">
            {/* Close button */}
            <div className="absolute top-0 right-0 p-2 z-10">
              <button 
                onClick={handleClose}
                className="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Media preview */}
            <div className="flex-grow flex items-center justify-center overflow-hidden">
              {formData.mediaType === 'image' ? (
                <img 
                  src={formData.mediaUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain transition-all duration-200"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    filter: activeFilter === 'none' ? 'none' : 
                           activeFilter === 'grayscale' ? 'grayscale(100%)' :
                           activeFilter === 'sepia' ? 'sepia(70%)' :
                           activeFilter === 'saturate' ? 'saturate(200%)' : 'none'
                  }}
                />
              ) : (
                <video 
                  src={formData.mediaUrl} 
                  controls 
                  className="max-w-full max-h-full"
                />
              )}
            </div>
            
            {/* Edit toolbar */}
            {formData.mediaType === 'image' && (
              <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-center gap-6">
                <button 
                  onClick={handleRotate} 
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Rotate"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleCrop} 
                  className={`p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors
                    ${isCropping ? 'bg-blue-100 text-blue-600' : ''}`}
                  title="Crop"
                >
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleColorFilter} 
                  className={`p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors
                    ${activeFilter !== 'none' ? 'bg-blue-100 text-blue-600' : ''}`}
                  title="Adjust colors"
                >
                  <PaintBrushIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleReset} 
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Reset to original"
                >
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center h-full min-h-[280px]">
            <p className="text-gray-400 text-sm">Media preview will appear here</p>
          </div>
        )}
        
        {formData.mediaUrl && formData.mediaType !== 'text-only' && (
          <div className="mt-4 w-full">
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Continue
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Hidden video element for camera capture */}
      <video 
        ref={videoRef} 
        style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'black', zIndex: 9999 }} 
      />
      
      {/* Hidden canvas element for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}