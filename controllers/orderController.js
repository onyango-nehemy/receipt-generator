const { createOrder, getOrders } = require('../models/orderModel');
const { generateReceipt } = require('../services/receiptService');
const { sendReceiptEmail } = require('../services/emailService');
const { uploadReceiptToCloudinary } = require('../services/cloudinaryService');
const { saveReceipt } = require('../models/receiptsModel');
const path = require('path');
const fs = require('fs');

exports.addOrder = async (req, res) => {
    let filePath = null;

    try {
        const order = await createOrder(req.body);

        const receiptsDir = path.join(__dirname, '../receipts');
        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir, { recursive: true });
        }

        const filename = `receipt_${order.order_id}_${Date.now()}.pdf`;
        filePath = path.join(receiptsDir, filename);

        await generateReceipt(order, filePath);

        let cloudinaryUrl = null;
        try {
            const cloudinaryResult = await uploadReceiptToCloudinary(filePath, order.order_id);
            cloudinaryUrl = cloudinaryResult.secure_url;
        } catch (cloudinaryError) {
            console.error('Cloudinary upload failed:', cloudinaryError.message);
        }

        try {
            await sendReceiptEmail(order.customer_email, order.customer_name, order, filePath);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        const receiptUrl = cloudinaryUrl || `/receipts/${filename}`;

        // ✅ Generate receipt_number before saving
        const receiptNumber = `RCP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(order.order_id).padStart(4,'0')}`;
        await saveReceipt(order.order_id, receiptUrl, receiptNumber);

        if (cloudinaryUrl && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return res.status(201).json(order);

    } catch (error) {
        console.error('❌ addOrder error:', error.message);
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return res.status(500).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await getOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};