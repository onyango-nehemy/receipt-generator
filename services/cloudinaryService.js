const cloudinary = require('../config/cloudinary');
const fs = require('fs');


const uploadReceiptToCloudinary = async (filePath, orderId) => {
    try {
        console.log(`☁️  Uploading receipt to Cloudinary...`);

        // Upload PDF to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'receipts',                   
            public_id: `receipt_${orderId}`,       
            resource_type: 'raw',                  
            overwrite: true,                       
            format: 'pdf'                          
        });

        console.log('✅ Receipt uploaded to Cloudinary successfully!');
        console.log('📎 Cloudinary URL:', result.secure_url);

        return result;

    } catch (error) {
        console.error('❌ Error uploading to Cloudinary:', error);
        throw error;
    }
};


const deleteReceiptFromCloudinary = async (publicId) => {
    try {
        console.log(`🗑️  Deleting receipt from Cloudinary: ${publicId}`);

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'raw'
        });

        console.log('✅ Receipt deleted from Cloudinary');
        return result;

    } catch (error) {
        console.error('❌ Error deleting from Cloudinary:', error);
        throw error;
    }
};


const getCloudinaryReceiptUrl = (orderId) => {
    return cloudinary.url(`receipts/receipt_${orderId}.pdf`, {
        resource_type: 'raw'
    });
};

module.exports = {
    uploadReceiptToCloudinary,
    deleteReceiptFromCloudinary,
    getCloudinaryReceiptUrl
};