const pool = require('../config/db');

const createOrder = async (order) => {
    const {
        customer_name,
        customer_email,
        items,
        subtotal,
        discount,
        total_amount,
        payment_method
    } = order;

    const query = `
        INSERT INTO orders (customer_name, customer_email, items, subtotal, discount, total_amount, payment_method)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const result = await pool.query(query, [
        customer_name,
        customer_email,
        JSON.stringify(items),
        subtotal,
        discount,
        total_amount,
        payment_method
    ]);

    return result.rows[0];
};

const getOrders = async () => {
    const result = await pool.query('SELECT * FROM orders ORDER BY order_datetime DESC');
    return result.rows;
};

module.exports = { createOrder, getOrders };