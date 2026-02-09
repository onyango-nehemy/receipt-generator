# Receipt Generator API

A Node.js/Express API that automatically generates PDF receipts and emails them to customers.

## Features

- ✅ Create orders via REST API
- ✅ Auto-generate professional PDF receipts
- ✅ Email receipts to customers
- ✅ Cloud storage with Cloudinary
- ✅ PostgreSQL database
- ✅ Swagger API documentation

## Tech Stack

- Node.js & Express
- PostgreSQL
- PDFKit
- Nodemailer
- Cloudinary
- Swagger

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/receipt-generator.git
cd receipt-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your credentials

4. Create PostgreSQL database and tables

5. Start the server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/orders` - Create order and send receipt
- `GET /api/orders` - Get all orders
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/generate/:orderId` - Resend receipt

## API Documentation

Visit `/api-docs` for Swagger documentation

## Author

Nehemia Onyango

## License

ISC