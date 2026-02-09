const { saveReceipt, getReceipts } = require('../models/receiptsModel');
const { generateReceipt } = require('../services/receiptService');
const { sendReceiptEmail } = require('../services/emailService');
const { uploadReceiptToCloudinary } = require('../services/cloudinaryService');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');

exports.generateReceipt = async (req, res) => {
    let filePath = null; // Track file path for cleanup

    try {
        const { orderId } = req.params;

        // 1. Get order from the database
        const OrderQuery = `
            SELECT
                o.order_id,
                o.customer_name,
                o.customer_email,
                o.items,
                o.subtotal,
                o.discount,
                o.total_amount,
                o.payment_method,
                o.order_datetime
            FROM orders o
            WHERE o.order_id = $1
        `;

        const result = await pool.query(OrderQuery, [orderId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order is not available' });
        }

        const orderData = result.rows[0];

        // 2. Create receipts directory if it doesn't exist
        const receiptsDir = path.join(__dirname, '../receipts');
        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir, { recursive: true });
        }

        // 3. Generate filename
        const filename = `receipt_${orderId}_${Date.now()}.pdf`;
        filePath = path.join(receiptsDir, filename);

        console.log('💾 Generating PDF receipt...');

        // 4. Generate receipt PDF
        await generateReceipt(orderData, filePath);

        // 5. Verify PDF was created
        if (!fs.existsSync(filePath)) {
            console.log('❌ Receipt file not found!');
            return res.status(500).json({ error: 'Failed to create receipt file' });
        }

        console.log('✅ PDF receipt created successfully');

        // 6. Upload PDF to Cloudinary
        let cloudinaryUrl = null;
        try {
            const cloudinaryResult = await uploadReceiptToCloudinary(filePath, orderId);
            cloudinaryUrl = cloudinaryResult.secure_url;
            console.log('✅ Receipt uploaded to Cloudinary');
        } catch (cloudinaryError) {
            console.error('⚠️ Cloudinary upload failed:', cloudinaryError.message);
            // Continue even if Cloudinary fails - we still have local file
        }

        // 7. Send email with PDF attachment
        try {
            await sendReceiptEmail(
                orderData.customer_email,
                orderData.customer_name,
                orderData,
                filePath
            );
            console.log('✅ Email sent to customer');
        } catch (emailError) {
            console.error('⚠️ Email sending failed:', emailError.message);
            // Continue even if email fails
        }

        // 8. Save receipt to database (use Cloudinary URL if available, otherwise local path)
        const receiptUrl = cloudinaryUrl || `/receipts/${filename}`;
        const receipt = await saveReceipt(orderId, receiptUrl);
        console.log('💾 Receipt saved to database');

        // 9. Send PDF file as download to user
        res.download(filePath, `receipt_${orderId}.pdf`, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).json({ error: 'Error downloading receipt' });
            }

            console.log('✅ Receipt downloaded successfully');

            // 10. Delete local file after download (since we have it in Cloudinary)
            if (cloudinaryUrl) {
                try {
                    fs.unlinkSync(filePath);
                    console.log('🗑️  Local PDF file deleted (saved in Cloudinary)');
                } catch (deleteError) {
                    console.error('⚠️ Could not delete local file:', deleteError.message);
                }
            }
        });

    } catch (error) {
        console.error('❌ Error generating receipt:', error);

        // Clean up local file if it exists
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log('🗑️  Cleaned up local file after error');
            } catch (deleteError) {
                console.error('⚠️ Could not delete local file:', deleteError.message);
            }
        }

        res.status(500).json({ error: 'Failed to generate receipt' });
    }
};

// Manually add receipt
exports.addReceipt = async (req, res) => {
    try {
        const { order_id, receipt_url } = req.body;
        const receipt = await saveReceipt(order_id, receipt_url);
        res.status(201).json(receipt);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all receipts
exports.getAllReceipts = async (req, res) => {
    try {
        const receipts = await getReceipts();
        res.json(receipts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  