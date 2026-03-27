const setupDatabase = async (pool) => {
  try {
    // 1️⃣ Sequence for receipt numbers
    await pool.query(`
      CREATE SEQUENCE IF NOT EXISTS receipt_seq START 1;
    `);

    // 2️⃣ Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL
      );
    `);

    // 3️⃣ Neutralize legacy total_price constraint
    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='orders' AND column_name='total_price'
        ) THEN
          EXECUTE 'ALTER TABLE orders ALTER COLUMN total_price DROP NOT NULL';
          EXECUTE 'ALTER TABLE orders ALTER COLUMN total_price SET DEFAULT 0';
        END IF;

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

    // 4️⃣ Add missing columns to orders
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    // 5️⃣ Receipts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        id SERIAL PRIMARY KEY,
        order_id INTEGER UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
        receipt_number VARCHAR(50),
        receipt_url TEXT NOT NULL,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6️⃣ Add UNIQUE constraint on order_id for existing tables
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'receipts_order_id_key'
        ) THEN
          EXECUTE 'ALTER TABLE receipts ADD CONSTRAINT receipts_order_id_key UNIQUE (order_id)';
        END IF;
      END$$;
    `);

    // 7️⃣ Add receipt_number column if missing and backfill NULLs
    await pool.query(`
      ALTER TABLE receipts ADD COLUMN IF NOT EXISTS receipt_number VARCHAR(50);
    `);

    await pool.query(`
      UPDATE receipts
      SET receipt_number = concat('RCP-', id, '-', order_id)
      WHERE receipt_number IS NULL;
    `);

    // 8️⃣ Apply NOT NULL on receipt_number after backfill
    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='receipts'
            AND column_name='receipt_number'
            AND is_nullable = 'YES'
        ) THEN
          EXECUTE 'ALTER TABLE receipts ALTER COLUMN receipt_number SET NOT NULL';
        END IF;
      END$$;
    `);

    console.log('Database Schema synchronized: Orders and Receipts tables verified.');
  } catch (err) {
    console.error('Schema Sync Error:', err);
    throw err;
  }
};

module.exports = setupDatabase;