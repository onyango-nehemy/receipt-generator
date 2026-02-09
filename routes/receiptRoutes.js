const express = require('express');
const router = express.Router();
const { addReceipt, getAllReceipts, generateReceipt } = require('../controllers/receiptController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Receipt:
 *       type: object
 *       required:
 *         - order_id
 *         - receipt_URL
 *       properties:
 *         receipt_id:
 *           type: integer
 *           description: Auto-generated receipt ID
 *         order_id:
 *           type: integer
 *           description: Associated order ID
 *         receipt_URL:
 *           type: string
 *           description: URL to the generated PDF receipt (Cloudinary URL)
 *           example: https://res.cloudinary.com/demo/image/upload/receipts/receipt-123.pdf
 *         generated_at:
 *           type: string
 *           format: date-time
 *           description: Receipt generation timestamp
 *       example:
 *         receipt_id: 1
 *         order_id: 123
 *         receipt_URL: https://res.cloudinary.com/demo/image/upload/receipts/receipt-123.pdf
 *         generated_at: 2024-01-15T10:30:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Receipts
 *   description: Receipt management and PDF generation endpoints
 */

/**
 * @swagger
 * /api/receipts:
 *   post:
 *     summary: Create a new receipt record
 *     tags: [Receipts]
 *     description: Saves a receipt record with order ID and receipt URL to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - receipt_URL
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: ID of the order
 *                 example: 123
 *               receipt_URL:
 *                 type: string
 *                 description: Cloudinary URL of the generated receipt PDF
 *                 example: https://res.cloudinary.com/demo/image/upload/receipts/receipt-123.pdf
 *     responses:
 *       201:
 *         description: Receipt created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/', addReceipt);

/**
 * @swagger
 * /api/receipts:
 *   get:
 *     summary: Get all receipts
 *     tags: [Receipts]
 *     description: Retrieves all receipts sorted by generation date (newest first)
 *     responses:
 *       200:
 *         description: List of all receipts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipt'
 *       500:
 *         description: Server error
 */
router.get('/', getAllReceipts);

/**
 * @swagger
 * /api/receipts/generate/{orderId}:
 *   get:
 *     summary: Generate a PDF receipt for an order
 *     tags: [Receipts]
 *     description: Generates a PDF receipt using PDFKit, uploads to Cloudinary, and returns the PDF or saves the URL
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID to generate receipt for
 *         example: 123
 *     responses:
 *       200:
 *         description: PDF receipt generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error - Failed to generate receipt
 */
router.get('/generate/:orderId', generateReceipt);

module.exports = router;