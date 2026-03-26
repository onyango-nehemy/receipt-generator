// config/schema.js
const setupDatabase = async (pool) => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      items JSONB NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      receipt_number VARCHAR(100) UNIQUE NOT NULL,
      generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    console.log('✅ Database tables verified/created.');
  } catch (err) {
    console.error('❌ Error initializing database tables:', err);
    throw err; // Critical error, should stop the server
  }
};

module.exports = setupDatabase;