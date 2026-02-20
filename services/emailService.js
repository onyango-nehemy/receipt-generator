const transporter = require('../config/email');
const { receiptEmailHTML } = require('../templates/emailBody');

const sendReceiptEmail = async (toEmail, customerName, orderData, pdfPath) => {
    try {
        const mailOptions = {
            from: {
                name: process.env.EMAIL_FROM_NAME,
                address: process.env.EMAIL_FROM
            },
            to: toEmail,
            subject: `Your Order Receipt #${orderData.order_id} - Nehemia Onyango General Stores`,
            text: `Dear ${customerName},\n\nThank you for your order! Your receipt is attached.\n\nOrder #${orderData.order_id}\nTotal: KES ${orderData.total_amount}\n\nBest regards,\nNehemia Onyango General Stores`,
            html: receiptEmailHTML(orderData),
            attachments: [
                {
                    filename: `receipt_${orderData.order_id}.pdf`,
                    path: pdfPath,
                    contentType: 'application/pdf'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        return info;

    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
};

module.exports = { sendReceiptEmail };