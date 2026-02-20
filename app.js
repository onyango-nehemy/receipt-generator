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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/orders', orderRoutes);
app.use('/api/receipts', receiptRoutes);

module.exports = app;