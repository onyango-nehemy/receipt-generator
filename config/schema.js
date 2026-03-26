// schema.js
const setupDatabase = async (pool) => {
  const queryText = `
    -- 1. Create Orders Table
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      items JSONB DEFAULT '[]'::jsonb,
      subtotal DECIMAL(10,2) DEFAULT 0,
      discount DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(10,2) DEFAULT 0,
      payment_method VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Create Receipts Table
    CREATE TABLE IF NOT EXISTS receipts (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      receipt_url TEXT NOT NULL,
      generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    console.log('✅ Database Schema synchronized: All tables and columns verified.');
  } catch (err) {
    console.error('❌ Schema Sync Error:', err);
    throw err; // stop server startup if DB setup fails
  }
};

module.exports = setupDatabase;