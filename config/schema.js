// schema.js
const setupDatabase = async (pool) => {
  try {
    // -------------------------------
    // 1️⃣ Orders Table (base structure)
    // -------------------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL
      );
    `);

    // -------------------------------
    // 2️⃣ Neutralize legacy total_price constraint
    // -------------------------------
    await pool.query(`
      DO $$
      BEGIN
        -- Drop NOT NULL and set default on total_price if it still exists
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='orders' AND column_name='total_price'
        ) THEN
          EXECUTE 'ALTER TABLE orders ALTER COLUMN total_price DROP NOT NULL';
          EXECUTE 'ALTER TABLE orders ALTER COLUMN total_price SET DEFAULT 0';
        END IF;

        -- Rename total_price -> total_amount if rename hasn't happened yet
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

    // -------------------------------
    // 3️⃣ Add missing columns safely
    // -------------------------------
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    // -------------------------------
    // 4️⃣ Receipts Table
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