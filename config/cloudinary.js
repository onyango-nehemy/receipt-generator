const cloudinary=require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const cloudinaryConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log('Connected to cloud successfully:', result.status);
    } catch (error) {
        console.error('Cloudinary connection error:', error.message);
    }
};
cloudinaryConnection();

module.exports=cloudinary;