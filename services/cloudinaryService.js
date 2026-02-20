const cloudinary = require('../config/cloudinary');

const uploadReceiptToCloudinary = async (filePath, orderId) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'receipts',
            public_id: `receipt_${orderId}`,
            resource_type: 'raw',
            overwrite: true,
            format: 'pdf'
        });

        return result;

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

const deleteReceiptFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'raw'
        });

        return result;

    } catch (error) {
        console.error('Cloudinary delete error:', error);
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