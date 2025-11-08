# WIC Database Seeding Guide

## Overview
The database has been set up with 3 test WIC card numbers, each with different usage patterns to demonstrate the app's full functionality.

## Test WIC Card Numbers

### 1. Heavy User (Low Remaining Benefits)
**Card Number:** `1234567890`
**Name:** Sarah Johnson
**Usage Pattern:** High usage - most benefits consumed

#### Benefits:
- **Dairy:** 4.0 gallons total, 0.5 remaining (87.5% used)
- **Grains:** 16.0 oz total, 2.0 oz remaining (87.5% used)
- **Protein:** 2.0 lbs total, 0.25 lbs remaining (87.5% used)
- **Fruits:** $12.00 total, $1.50 remaining (87.5% used)
- **Vegetables:** $12.00 total, $2.00 remaining (83.3% used)

#### Transactions:
- **3 purchases** showing heavy shopping activity
- Last purchase: 7 days ago
- Items include: Milk, Bread, Peanut Butter, Apples, Carrots, Brown Rice

---

### 2. Moderate User (Medium Remaining Benefits)
**Card Number:** `0987654321`
**Name:** Maria Garcia
**Usage Pattern:** Moderate usage - half benefits consumed

#### Benefits:
- **Dairy:** 4.0 gallons total, 2.0 remaining (50% used)
- **Grains:** 16.0 oz total, 8.0 oz remaining (50% used)
- **Protein:** 2.0 lbs total, 1.0 lbs remaining (50% used)
- **Fruits:** $12.00 total, $6.00 remaining (50% used)
- **Vegetables:** $12.00 total, $6.00 remaining (50% used)

#### Transactions:
- **2 purchases** showing moderate shopping activity
- Last purchase: 10 days ago
- Items include: Milk, Cereal, Bananas, Spinach, Dried Beans

---

### 3. Light User (High Remaining Benefits)
**Card Number:** `5555555555`
**Name:** Emily Chen
**Usage Pattern:** Light usage - most benefits still available

#### Benefits:
- **Dairy:** 4.0 gallons total, 3.5 remaining (12.5% used)
- **Grains:** 16.0 oz total, 14.0 oz remaining (12.5% used)
- **Protein:** 2.0 lbs total, 1.75 lbs remaining (12.5% used)
- **Fruits:** $12.00 total, $10.50 remaining (12.5% used)
- **Vegetables:** $12.00 total, $11.00 remaining (8.3% used)

#### Transactions:
- **1 purchase** showing light shopping activity
- Last purchase: 5 days ago
- Items include: Milk, Strawberries

---

## How to Run the Seed

### Step 1: Push Schema to Database
```bash
cd backend
npm run db:push
```

### Step 2: Run Seed Script
```bash
npm run db:seed
```

### Step 3: Verify in Prisma Studio
```bash
npm run db:studio
```

## What Gets Seeded

### WIC Benefits
- 15 total benefit records (5 categories × 3 cards)
- All expire at the end of the current month
- Varying `remainingAmount` values to show different usage patterns

### Transactions
- 6 total transactions across the 3 cards
- Each transaction includes:
  - Store ID (linked to existing WicStore records)
  - Transaction type: 'purchase'
  - Total items count
  - Total value
  - Transaction date (spread throughout the month)

### Transaction Items
- Multiple items per transaction showing:
  - Linked approved food products
  - Category (dairy, grains, protein, fruits, vegetables)
  - Quantity purchased
  - Unit of measurement
  - Product name

## Mobile App Integration

The mobile app has been updated to fetch real data:

### BenefitsScreen
- Fetches benefits using `getUserBenefits(cardNumber)`
- Displays loading/error states
- Groups benefits by category
- Shows progress bars based on actual usage
- Updates in real-time when switching cards

### API Endpoints
- `GET /api/users/:wicCardNumber/benefits` - Get all benefits for a card
- `GET /api/users/:wicCardNumber/transactions` - Get transaction history
- `POST /api/users/:wicCardNumber/transactions` - Create new transaction

## Testing the App

1. **Test Card Switching:**
   - Enter card `1234567890` → See low remaining benefits (heavy user)
   - Enter card `0987654321` → See medium remaining benefits (moderate user)
   - Enter card `5555555555` → See high remaining benefits (light user)

2. **Test Expiration Warnings:**
   - All benefits expire at the end of the current month
   - Benefits screen shows dynamic expiration countdown
   - Color-coded warnings: Red (<10 days), Yellow (10-19 days), Blue (≥20 days)

3. **Test Transactions:**
   - View purchase history for each card
   - See different transaction patterns
   - Verify benefits decrease matches transaction history

## Database Schema

### WicBenefit Table
```prisma
model WicBenefit {
  id              String   @id @default(uuid())
  wicCardNumber   String
  firstName       String?
  lastName        String?
  category        String   // 'dairy', 'grains', 'protein', 'fruits', 'vegetables'
  totalAmount     Decimal
  remainingAmount Decimal
  unit            String   // 'gallons', 'dollars', 'oz', 'lbs', 'dozen'
  monthPeriod     String   // '2025-01'
  expiresAt       DateTime // Last day of month
}
```

### Transaction Table
```prisma
model Transaction {
  id              String   @id @default(uuid())
  wicCardNumber   String
  storeId         String?
  transactionType String   // 'purchase', 'reset'
  totalItems      Int
  totalValue      Decimal
  transactionDate DateTime
  items           TransactionItem[]
}
```

## Notes

- **No User Accounts:** The system uses WIC card numbers instead of user authentication
- **Monthly Reset:** Benefits are per-month (monthPeriod field)
- **Automatic Cleanup:** The seed script clears existing test data before seeding
- **Real Stores Required:** Seed script requires at least 1 WicStore record to create transactions
- **Real Products Required:** Seed script requires ApprovedFood records to link transaction items

## Next Steps

1. ✅ Schema updated
2. ✅ Seed file created
3. ⏳ Run `npm run db:push` in backend folder
4. ⏳ Run `npm run db:seed` to populate test data
5. ⏳ Test mobile app with all 3 card numbers
6. ⏳ Verify benefits display correctly
7. ⏳ Verify transaction history shows
8. ⏳ Test benefit updates when scanning products
