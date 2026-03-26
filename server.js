// Only load dotenv locally
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to database first
pool.connect()
  .then(() => {
    console.log('✅ Database connected successfully.');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1); // stop the app if DB connection fails
  })