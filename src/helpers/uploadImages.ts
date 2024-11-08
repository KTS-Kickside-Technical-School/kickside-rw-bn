import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (fileToUpload) => {
    const result = await cloudinary.uploader.upload(fileToUpload.path);
    return {
        public_id: result.public_id,
        secure_url: result.secure_url,
    };
};

export default uploadImage;
