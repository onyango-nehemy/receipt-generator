const { getReceipts } = require('../models/receiptsModel');
const { generateReceipt } = require('../services/receiptService');
const { sendReceiptEmail } = require('../services/emailService');
const { uploadReceiptToCloudinary } = require('../services/cloudinaryService');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');

exports.generateReceipt = async (req, res) => {
    let filePath = null;

    try {
        const { orderId } = req.params;

        const orderQuery = `
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

        const result = await pool.query(orderQuery, [orderId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const orderData = result.rows[0];

        const receiptsDir = path.join(__dirname, '../receipts');
        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir, { recursive: true });
        }

        const filename = `receipt_${orderId}_${Date.now()}.pdf`;
        filePath = path.join(receiptsDir, filename);

        await generateReceipt(orderData, filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ error: 'Failed to create receipt file' });
        }

        let cloudinaryUrl = null;
        try {
            const cloudinaryResult = await uploadReceiptToCloudinary(filePath, orderId);
            cloudinaryUrl = cloudinaryResult.secure_url;
        } catch (cloudinaryError) {
            console.error('Cloudinary upload failed:', cloudinaryError.message);
        }

        try {
            await sendReceiptEmail(orderData.customer_email, orderData.customer_name, orderData, filePath);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        const receiptUrl = cloudinaryUrl || `/receipts/${filename}`;
        await pool.query(
            `INSERT INTO receipts (order_id, receipt_url)
             VALUES ($1, $2)
             ON CONFLICT (order_id) DO UPDATE SET receipt_url = $2, generated_at = NOW()
             RETURNING *`,
            [orderId, receiptUrl]
        );

        res.download(filePath, `receipt_${orderId}.pdf`, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }

            if (cloudinaryUrl && fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (deleteError) {
                    console.error('Could not delete local file:', deleteError.message);
                }
            }
        });

    } catch (error) {
        console.error('Error generating receipt:', error);

        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (deleteError) {
                console.error('Could not delete local file:', deleteError.message);
            }
        }

        res.status(500).json({ error: 'Failed to generate receipt' });
    }
};

exports.getAllReceipts = async (req, res) => {
    try {
        const receipts = await getReceipts();
        res.json(receipts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};