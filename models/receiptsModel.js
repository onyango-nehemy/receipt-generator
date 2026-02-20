const pool = require('../config/db');

const saveReceipt = async (order_id, receipt_url) => {
    const query = `
        INSERT INTO receipts (order_id, receipt_url)
        VALUES ($1, $2)
        RETURNING *
    `;

    const result = await pool.query(query, [order_id, receipt_url]);
    return result.rows[0];
};

const getReceipts = async () => {
    const result = await pool.query('SELECT * FROM receipts ORDER BY generated_at DESC');
    return result.rows;
};

module.exports = { saveReceipt, getReceipts };