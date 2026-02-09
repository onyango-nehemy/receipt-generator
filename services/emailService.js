const transporter = require('../config/email');
const { receiptEmailHTML } = require('../templates/emailBody');

const sendReceiptEmail = async (toEmail, customerName, orderData, pdfPath) => {
    try {
        const emailHTML = receiptEmailHTML(orderData);

        const mailOptions = {
            from: {
                name: process.env.EMAIL_FROM_NAME,
                address: process.env.EMAIL_FROM
            },
            to: toEmail,
            subject: `Your Order Receipt #${orderData.order_id} - Nehemia Onyango General Stores`,
            text: `Dear ${customerName},\n\nThank you for your order! Your receipt is attached.\n\nOrder #${orderData.order_id}\nTotal: KES ${orderData.total_amount}\n\nBest regards,\nNehemia Onyango General Stores`,
            html: emailHTML,
            attachments: [
                {
                    filename: `receipt_${orderData.order_id}.pdf`,
                    path: pdfPath,
                    contentType: 'application/pdf'
                }
            ]
        };

        console.log(`📧 Sending receipt to: ${toEmail}`);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        
        return info;

    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
};

module.exports = { sendReceiptEmail };