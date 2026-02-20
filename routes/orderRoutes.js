const express = require('express');
const router = express.Router();
const { addOrder, getAllOrders } = require('../controllers/orderController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customer_name
 *         - customer_email
 *         - items
 *         - subtotal
 *         - total_amount
 *         - payment_method
 *       properties:
 *         order_id:
 *           type: integer
 *           description: Auto-generated order ID
 *         customer_name:
 *           type: string
 *           description: Name of the customer
 *           example: Nehemia Onyango
 *         customer_email:
 *           type: string
 *           format: email
 *           description: Email of the customer
 *           example: youremail@gmail.com
 *         items:
 *           type: array
 *           description: Array of order items
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               quantity:
 *                 type: integer
 *                 example: 1
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 999.99
 *         subtotal:
 *           type: number
 *           format: float
 *           description: Subtotal before discount
 *           example: 1049.99
 *         discount:
 *           type: number
 *           format: float
 *           description: Discount amount
 *           example: 50.00
 *         total_amount:
 *           type: number
 *           format: float
 *           description: Total amount after discount
 *           example: 999.99
 *         payment_method:
 *           type: string
 *           description: Payment method used
 *           enum: [cash, card, mobile_money, bank_transfer]
 *           example: card
 *         order_datetime:
 *           type: string
 *           format: date-time
 *           description: Order creation timestamp
 *       example:
 *         customer_name: John Doe
 *         customer_email: john.doe@example.com
 *         items:
 *           - name: Laptop
 *             quantity: 1
 *             price: 999.99
 *           - name: Wireless Mouse
 *             quantity: 2
 *             price: 25.00
 *         subtotal: 1049.99
 *         discount: 50.00
 *         total_amount: 999.99
 *         payment_method: card
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - customer_email
 *               - items
 *               - subtotal
 *               - total_amount
 *               - payment_method
 *             properties:
 *               customer_name:
 *                 type: string
 *                 example: Nehemiah Onyango
 *               customer_email:
 *                 type: string
 *                 format: email
 *                 example: youremail@example.com
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - quantity
 *                     - price
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Laptop
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 1
 *                     price:
 *                       type: number
 *                       format: float
 *                       minimum: 0
 *                       example: 999.99
 *               subtotal:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 1049.99
 *               discount:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 default: 0
 *                 example: 50.00
 *               total_amount:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 999.99
 *               payment_method:
 *                 type: string
 *                 enum: [cash, card, mobile_money, bank_transfer]
 *                 example: card
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/', addOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     description: Retrieves all orders sorted by order date (newest first)
 *     responses:
 *       200:
 *         description: List of all orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
router.get('/', getAllOrders);

module.exports = router;