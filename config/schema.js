// schema.js
const setupDatabase = async (pool) => {
  try {
    // -------------------------------
    // 1️⃣ Orders Table
    // -------------------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL
      );
    `);

    // Rename total_price -> total_amount safely
    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='orders' AND column_name='total_price'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='orders' AND column_name='total_amount'
        ) THEN
          EXECUTE 'ALTER TABLE orders RENAME COLUMN total_price TO total_amount';
        END IF;
      END$$;
    `);

    // Add missing columns safely
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    // -------------------------------
    // 2️⃣ Receipts Table
    // -------------------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        receipt_url TEXT NOT NULL,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database Schema synchronized: Orders and Receipts tables verified.');
  } catch (err) {
    console.error('❌ Schema Sync Error:', err);
    throw err;
  }
};

module.exports = setupDatabase;