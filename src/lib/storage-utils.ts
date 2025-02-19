// src/lib/storage-utils.ts
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateUserDocument } from '@/lib/users';

interface UploadProgressCallback {
  (progress: number): void;
}

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param path The storage path
 * @param progressCallback Optional callback for upload progress
 * @returns Promise with download URL
 */
export const uploadMedia = async (
  file: File, 
  userId: string,
  progressCallback?: UploadProgressCallback
): Promise<string> => {
  if (!file) {
    throw new Error('No file provided');
  }

  // Create a unique filename
  const fileName = `${userId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const filePath = `uploads/${userId}/${fileName}`;
  const storageRef = ref(storage, filePath);
  
  // Create upload task
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  // Return a promise that resolves with the download URL
  return new Promise((resolve, reject) => {
    // Listen for state changes, errors, and completion
    uploadTask.on(
      'state_changed',
      // Progress observer
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progressCallback) {
          progressCallback(progress);
        }
      },
      // Error observer
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      // Completion observer
      async () => {
        try {
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Converts a data URL to a File object
 * @param dataUrl The data URL (e.g. from canvas.toDataURL())
 * @param filename Desired filename
 * @returns File object
 */
export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};