const cloudinary = require('cloudinary').v2;

/**
 * Generate a signed upload signature for secure client-side uploads to Cloudinary.
 * This avoids sending large files through the Vercel server.
 */
exports.getCloudinarySignature = async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        
        // Generate signature
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: 'call_recordings',
            },
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(200).json({
            signature,
            timestamp,
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            folder: 'call_recordings'
        });
    } catch (error) {
        console.error('[CLOUDINARY_SIG] Error:', error);
        res.status(500).json({ message: 'Failed to generate upload signature' });
    }
};
