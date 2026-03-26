const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const orderRoutes = require('./routes/orderRoutes');
const receiptRoutes = require('./routes/receiptRoutes');

const app = express();

app.use(express.json());
app.use(cors());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Receipt Generator API',
      version: '1.0.0',
      description: 'API documentation for Receipt Generation App',
      contact: {
        name: 'Nehemia Onyango',
        email: 'nehemiaonyango92@gmail.com',
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL || 'http://localhost:5000',
        description: 'Server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.get('/', (req, res) => res.redirect('/api-docs'));
app.use('/api/orders', orderRoutes);
app.use('/api/receipts', receiptRoutes);
// catch all 404 for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// global error handler
app.use((err, req, res, next) => {
    console.error('❌ Global error handler:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;