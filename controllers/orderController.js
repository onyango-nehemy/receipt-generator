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
        // Step 1: Create order
        const order = await createOrder(req.body);
        console.log('✅ Order created:', order.order_id);

        if (!order.order_id) {
            throw new Error('Order created but order_id is missing — check schema RETURNING clause');
        }

        // Step 2: Prepare receipts directory
        const receiptsDir = path.join(__dirname, '../receipts');
        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir, { recursive: true });
        }

        const filename = `receipt_${order.order_id}_${Date.now()}.pdf`;
        filePath = path.join(receiptsDir, filename);

        // Step 3: Generate PDF
        console.log('⏳ Generating PDF...');
        await generateReceipt(order, filePath);
        console.log('✅ PDF generated');

        // Step 4: Upload to Cloudinary
        let cloudinaryUrl = null;
        try {
            console.log('⏳ Uploading to Cloudinary...');
            const cloudinaryResult = await uploadReceiptToCloudinary(filePath, order.order_id);
            cloudinaryUrl = cloudinaryResult.secure_url;
            console.log('✅ Cloudinary upload done:', cloudinaryUrl);
        } catch (cloudinaryError) {
            console.error('❌ Cloudinary failed:', cloudinaryError.message);
        }

        // Step 5: Send email
        try {
            console.log('⏳ Sending email...');
            await sendReceiptEmail(order.customer_email, order.customer_name, order, filePath);
            console.log('✅ Email sent');
        } catch (emailError) {
            console.error('❌ Email failed:', emailError.message);
        }

        // Step 6: Save receipt record
        const receiptUrl = cloudinaryUrl || `/receipts/${filename}`;
        const receiptNumber = `RCP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(order.order_id).padStart(4,'0')}`;
        await saveReceipt(order.order_id, receiptUrl, receiptNumber);
        console.log('✅ Receipt saved:', receiptNumber);

        // Step 7: Cleanup local file if uploaded to Cloudinary
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