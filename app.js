const express=require('express');
const app=express();

//swagger configurations
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


//middleware
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Receipt Generator API',
      version: '1.0.0',
      description: 'API documentation for E-Commerce Receipt Generator',
      contact: {
        name: 'Nehemia Onyango',
        email: 'nehemiaonyango92@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const orderRoutes=require('./routes/orderRoutes');
const receiptRoutes=require('./routes/receiptRoutes');

app.use('/api/orders',orderRoutes);
app.use('/api/receipts',receiptRoutes);
module.exports=app; 