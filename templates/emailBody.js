
const receiptEmailHTML = (orderData) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Receipt</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px; background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%); text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                NEHEMIA ONYANGO GENERAL STORES
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #ecf0f1; font-size: 14px;">
                                Your Trusted Shopping Partner
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #2C3E50; font-size: 24px;">
                                Thank You for Your Order!
                            </h2>
                            
                            <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                Dear <strong>${orderData.customer_name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                Thank you for shopping with us! Your order has been confirmed and your receipt is attached to this email.
                            </p>

                            <!-- Order Summary Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #2C3E50; font-size: 18px;">
                                            Order Summary
                                        </h3>
                                        
                                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="padding: 8px 0; color: #555555; font-size: 14px;">
                                                    <strong>Order Number:</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #555555; font-size: 14px; text-align: right;">
                                                    #${orderData.order_id}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #555555; font-size: 14px;">
                                                    <strong>Payment Method:</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #555555; font-size: 14px; text-align: right;">
                                                    ${orderData.payment_method}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0 8px 0; border-top: 2px solid #dee2e6; color: #27AE60; font-size: 16px;">
                                                    <strong>Total Amount:</strong>
                                                </td>
                                                <td style="padding: 12px 0 8px 0; border-top: 2px solid #dee2e6; color: #27AE60; font-size: 16px; text-align: right;">
                                                    <strong>KES ${parseFloat(orderData.total_amount).toFixed(2)}</strong>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Attachment Notice -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #e8f5e9; border-left: 4px solid #27AE60; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                                            <strong>📎 Your receipt is attached to this email as a PDF file.</strong><br>
                                            Please download and keep it for your records.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 10px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                If you have any questions or concerns about your order, please don't hesitate to contact us.
                            </p>
                            
                            <p style="margin: 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                Best regards,<br>
                                <strong>Nehemia Onyango General Stores</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
                                <strong>Contact Us</strong>
                            </p>
                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px;">
                                 0100-GPO EMBAKASI, NAIROBI, KENYA
                            </p>
                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px;">
                                 +254 707877483
                            </p>
                            <p style="margin: 0 0 20px 0; color: #6c757d; font-size: 13px;">
                                 support@onyangogenerals.com
                            </p>
                            <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                © ${new Date().getFullYear()} Nehemia Onyango General Stores. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

module.exports = {
    receiptEmailHTML
};