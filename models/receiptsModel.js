const pool = require('../config/db');

const saveReceipt = async (orderId, receiptUrl, receiptNumber) => {
    const result = await pool.query(
        `INSERT INTO receipts (order_id, receipt_number, receipt_url)
         VALUES ($1, $2, $3)
         ON CONFLICT (order_id) DO UPDATE
           SET receipt_url = $3,
               receipt_number = $2,
               generated_at = NOW()
         RETURNING *`,
        [orderId, receiptNumber, receiptUrl]
    );
    return result.rows[0];
};

const getReceipts = async () => {
    const result = await pool.query('SELECT * FROM receipts ORDER BY generated_at DESC');
    return result.rows;
};

module.exports = { saveReceipt, getReceipts };