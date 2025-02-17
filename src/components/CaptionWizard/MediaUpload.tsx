import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { WizardStepProps } from '@/types/caption';

export function MediaUpload({ formData, setFormData }: WizardStepProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      const url = URL.createObjectURL(file);
      setFormData({
        ...formData,
        mediaType: fileType,
        mediaUrl: url
      });
    }
  }, [formData, setFormData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.mov']
    }
  });

  const handleTextOnly = () => {
    setFormData({
      ...formData,
      mediaType: 'text-only',
      mediaUrl: ''
    });
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop your media here, or click to select
        </p>
      </div>

      {formData.mediaUrl && formData.mediaType !== 'text-only' && (
        <div className="mt-4">
          {formData.mediaType === 'image' ? (
            <img 
              src={formData.mediaUrl} 
              alt="Preview" 
              className="max-h-48 mx-auto rounded"
            />
          ) : (
            <video 
              src={formData.mediaUrl} 
              controls 
              className="max-h-48 mx-auto rounded"
            />
          )}
        </div>
      )}

      <div className="text-center">
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
  );
};