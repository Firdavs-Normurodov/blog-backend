import imagekit from '../config/imagekit.js';

export const uploadToImageKit = async (file, folder = '') => {
    try {
        const fileName = `${Date.now()}-${file.originalname}`;
        
        const response = await imagekit.upload({
            file: file.buffer,
            fileName: fileName,
            folder: folder
        });
        
        return {
            fileId: response.fileId,
            url: response.url
        };
    } catch (error) {
        console.error('Error uploading to ImageKit:', error);
        throw error;
    }
};

export const deleteFromImageKit = async (fileId) => {
    if (!fileId) return;
    
    try {
        await imagekit.deleteFile(fileId);
    } catch (error) {
        console.error('Error deleting file from ImageKit:', error);
        throw error;
    }
};
