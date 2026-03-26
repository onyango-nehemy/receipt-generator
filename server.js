const app = require('./app');
const pool = require('./config/db');
const setupDatabase = require('./config/schema'); // We will create this file next

const PORT = process.env.PORT || 5000;

// Connect to database first
pool.connect()
  .then(async (client) => {
    console.log('✅ Database connected successfully.');

    try {
      // Run the auto-migration to create tables if they don't exist
      await setupDatabase(pool);
      
      // Release the client back to the pool
      client.release();

      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📖 API Docs: ${process.env.SERVER_URL || 'http://localhost:5000'}/api-docs`);
      });
    } catch (setupError) {
      console.error('❌ Error during database setup:', setupError);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1); 
  });