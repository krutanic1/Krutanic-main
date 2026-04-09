import api from '../services/api';
import { Platform } from 'react-native';
// Remove axios import as we switch to fetch

/**
 * Upload a file directly to Cloudinary using a signed request from our backend.
 * 
 * @param {string} fileUri Local URI of the file
 * @param {string} fileName Optional filename
 * @returns {Promise<string>} The URL of the uploaded file on Cloudinary
 */
export const uploadToCloudinary = async (fileUri, fileName = 'recording.m4a') => {
    try {
// Removed debug logs for production

        // 1. Get signed credentials from our backend
        const sigResponse = await api.get('/api/adv-leads/cloudinary-signature');
        const { signature, timestamp, cloud_name, api_key, folder } = sigResponse.data;
        
// Signature retrieved

        // 2. Prepare Form Data
        const formData = new FormData();
        
        // Android/iOS URI fixes
        const uri = Platform.OS === 'android' ? fileUri : fileUri.replace('file://', '');
        
        // Determine type based on extension or default
        const type = fileName.endsWith('.m4a') ? 'audio/mp4' : 
                     fileName.endsWith('.wav') ? 'audio/wav' :
                     fileName.endsWith('.mp3') ? 'audio/mpeg' : 'audio/mpeg';

        formData.append('file', {
            uri: uri,
            type: type,
            name: fileName
        });
        formData.append('api_key', api_key);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

// Uploading...

        // 3. Upload directly to Cloudinary (using fetch for better RN FormData reliability)
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const result = await response.json();
        
        if (!response.ok) {
            console.error('[CLOUDINARY] Upload Error Response:', JSON.stringify(result));
            throw new Error(result.error?.message || 'Upload failed');
        }

// Success
        return result.secure_url;
    } catch (error) {
        console.error('[CLOUDINARY] Upload failed:', error);
        throw new Error(error.message || 'Failed to upload recording to Cloudinary');
    }
};
