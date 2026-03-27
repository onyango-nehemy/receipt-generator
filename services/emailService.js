const resend = require('../config/email');
const { receiptEmailHTML } = require('../templates/emailBody');
const fs = require('fs');

const sendReceiptEmail = async (toEmail, customerName, orderData, pdfPath) => {
    try {
        const attachments = [];
        if (pdfPath && fs.existsSync(pdfPath)) {
            const fileContent = fs.readFileSync(pdfPath).toString('base64');
            attachments.push({
                filename: `receipt_${orderData.order_id}.pdf`,
                content: fileContent,
            });
        }

        const { data, error } = await resend.emails.send({
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
            to: toEmail,
            subject: `Your Order Receipt #${orderData.order_id} - Nehemia Onyango General Stores`,
            text: `Dear ${customerName},\n\nThank you for your order! Your receipt is attached.\n\nOrder #${orderData.order_id}\nTotal: KES ${orderData.total_amount}\n\nBest regards,\nNehemia Onyango General Stores`,
            html: receiptEmailHTML(orderData),
            attachments,
        });

        if (error) throw new Error(error.message);

        console.log('Email sent to:', toEmail);
        return data;

    } catch (error) {
        console.error('Email error:', error.message);
        throw error;
    }
};

module.exports = { sendReceiptEmail };