const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // always enable SSL for Render Postgres
});

pool.on('connect', () => console.log('✅ Database connected successfully.'));
pool.on('error', (err) => console.error('❌ Database connection error:', err));

module.exports = pool;