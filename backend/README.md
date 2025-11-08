# WIC App Backend API

Lightweight Express + Prisma API for WIC benefit tracking and barcode scanning.

## Features

- 🔍 Barcode scanning with USDA FoodData Central integration
- ✅ WIC approval checking against approved foods database
- 📍 Nearby store locator with GPS
- 💳 User benefits and transaction tracking
- 🛒 Shopping list management

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add:
- PostgreSQL database URL
- USDA API key (get free key at https://fdc.nal.usda.gov/api-key-signup.html)

### 3. Push Database Schema
```bash
npm run db:push
```

### 4. (Optional) Seed Database
Run the SQL seed files in `../data/` directory:
```bash
# From PostgreSQL CLI or GUI tool
\i ../data/seed_users.txt
\i ../data/seed_wic-stores.txt
\i ../data/seed_wic_foods.txt
```

### 5. Start Development Server
```bash
npm run dev
```

Server runs on http://localhost:3000

## API Endpoints

### Health Check
- `GET /health` - Server status

### Scanning
- `GET /api/scan/upc/:upc` - Scan product by UPC barcode
- `GET /api/scan/plu/:plu` - Scan produce by PLU code

### Products
- `GET /api/products/approved/:category` - Get WIC-approved products by category (milk, produce, grains, cereal)
- `GET /api/products/search?q=milk` - Search WIC-approved products

### Stores
- `GET /api/stores/nearby?lat=42.36&lng=-71.05&radius=10` - Find nearby WIC stores

### User Benefits
- `GET /api/users/:userId/benefits` - Get user's WIC benefits
- `GET /api/users/:userId/transactions` - Get transaction history
- `POST /api/users/:userId/transactions` - Record a purchase

### Shopping List
- `GET /api/users/:userId/shopping-list` - Get shopping list
- `POST /api/users/:userId/shopping-list` - Add item to list
- `PATCH /api/shopping-list/:itemId` - Update item (check/uncheck)
- `DELETE /api/shopping-list/:itemId` - Delete item

## Example Scan Request

```bash
# Scan whole milk by UPC
curl http://localhost:3000/api/scan/upc/041220988020
```

Response:
```json
{
  "found": true,
  "isWicApproved": true,
  "wicCategory": "milk",
  "approvalNotes": "Whole milk approved for children 1-2 years",
  "localProduct": {
    "id": "...",
    "name": "Whole Milk",
    "brand": "Generic",
    "category": "dairy"
  },
  "usdaProduct": {
    "description": "Milk, whole, 3.25% milkfat",
    "nutrition": [...]
  }
}
```

## Deploy to Railway

1. Create account at https://railway.app
2. Install Railway CLI: `npm i -g @railway/cli`
3. Login: `railway login`
4. Initialize: `railway init`
5. Add PostgreSQL: `railway add`
6. Set environment variables in Railway dashboard
7. Deploy: `railway up`

## Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Run production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio GUI

## Tech Stack

- **Express** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **USDA FoodData Central API** - Product data
