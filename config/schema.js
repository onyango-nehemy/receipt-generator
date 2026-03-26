const setupDatabase = async (pool) => {
  const queryText = `
    -- 1. Create Orders Table (if it doesn't exist at all)
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. CRITICAL FIX: Manually add missing columns to the EXISTING table
    -- This ensures the DB matches your Model exactly
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10, 2) DEFAULT 0;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

    -- 3. Create Receipts Table
    CREATE TABLE IF NOT EXISTS receipts (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      receipt_url TEXT NOT NULL,
      generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Ensure receipts table also has the correct URL column
    ALTER TABLE receipts ADD COLUMN IF NOT EXISTS receipt_url TEXT;
  `;

  try {
    await pool.query(queryText);
    console.log('✅ Database Schema synchronized: All columns verified.');
  } catch (err) {
    console.error('❌ Schema Sync Error:', err);
    throw err; // This will trigger your process.exit(1) in server.js
  }
};

module.exports = setupDatabase;