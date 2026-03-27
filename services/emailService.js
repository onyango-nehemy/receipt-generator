const transporter = require('../config/email');
const { receiptEmailHTML } = require('../templates/emailBody');
const fs = require('fs');

const sendReceiptEmail = async (toEmail, customerName, orderData, pdfPath) => {
    try {
        // Build attachments only if file still exists
        const attachments = [];
        if (pdfPath && fs.existsSync(pdfPath)) {
            attachments.push({
                filename: `receipt_${orderData.order_id}.pdf`,
                path: pdfPath,
                contentType: 'application/pdf'
            });
        }

        const mailOptions = {
            from: {
                name: process.env.EMAIL_FROM_NAME,
                address: process.env.EMAIL_FROM
            },
            to: toEmail,
            subject: `Your Order Receipt #${orderData.order_id} - Nehemia Onyango General Stores`,
            text: `Dear ${customerName},\n\nThank you for your order! Your receipt is attached.\n\nOrder #${orderData.order_id}\nTotal: KES ${orderData.total_amount}\n\nBest regards,\nNehemia Onyango General Stores`,
            html: receiptEmailHTML(orderData),
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent to:', toEmail);
        return info;

    } catch (error) {
        console.error('❌ Email error:', error.message);
        throw error;
    }
};

module.exports = { sendReceiptEmail };