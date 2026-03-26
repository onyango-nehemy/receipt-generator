const setupDatabase = async (pool) => {
  const queryText = `
    -- 1. Create Orders Table first (because Receipts depends on it)
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      items JSONB,
      subtotal DECIMAL(10, 2) DEFAULT 0,
      discount DECIMAL(10, 2) DEFAULT 0,
      total_amount DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(50),
      order_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Create Receipts Table
    CREATE TABLE IF NOT EXISTS receipts (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      receipt_url TEXT NOT NULL,
      generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Safety: Add columns if they were missing from previous runs
    ALTER TABLE receipts ADD COLUMN IF NOT EXISTS receipt_url TEXT;
    ALTER TABLE receipts ADD COLUMN IF NOT EXISTS order_id INTEGER;
  `;

  try {
    await pool.query(queryText);
    console.log('✅ Database Schema verified: Orders and Receipts are ready.');
  } catch (err) {
    console.error('❌ Schema Sync Error:', err);
    throw err;
  }
};

module.exports = setupDatabase;