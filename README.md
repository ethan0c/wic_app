# WIC Mobile Application

A comprehensive mobile application for WIC (Women, Infants, and Children) program participants to manage benefits, scan products, and shop with confidence.

## 🎯 Project Overview

This WIC app helps users:
- View and track their WIC benefits in real-time
- Scan product barcodes to verify WIC eligibility
- Get instant feedback on approved/rejected items
- Find WIC-approved alternatives
- Locate nearby WIC-approved stores
- Manage shopping lists

## 🏗️ Project Structure

```
WIC/
├── backend/          # Node.js/Express API with TypeScript
│   ├── prisma/       # Database schema and migrations
│   ├── scripts/      # Utility scripts for data management
│   └── src/          # API controllers, routes, and services
├── mobile/           # React Native mobile app with Expo
│   ├── components/   # Reusable UI components
│   ├── screens/      # App screens (Auth, Main, Profile, Settings)
│   ├── context/      # React Context providers
│   ├── services/     # API and audio feedback services
│   └── data/         # Mock data and APL (Approved Product List)
└── data/             # Shared data files and documentation
```

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **API Design**: RESTful architecture

### Mobile
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Camera**: expo-camera (barcode scanning)
- **Accessibility**: expo-speech (text-to-speech)
- **Icons**: Lucide React Native

## 📱 Key Features

### Scanner Screen
- Real-time barcode scanning with camera
- Manual UPC entry option
- Text-to-speech accessibility support
- 8 demo examples for testing
- Benefit balance calculations
- Rejection reason explanations

### Benefits Screen
- Visual progress bars (red for used, gray for remaining)
- Real-time balance updates
- Category-based benefit tracking
- Monthly allowance display

### Categories Screen
- Browse all WIC-approved products
- Filter by category
- Product images with emoji fallbacks
- Quick access to product details

### Profile & Settings
- WIC card management (masked display)
- Language selection (English/Spanish/Haitian Creole)
- Theme switching (Light/Dark/System)
- Store locator

## 🔐 Security Features

- WIC card number masking (shows only last 4 digits)
- Secure benefit balance tracking
- Protected API endpoints

## 🌐 Internationalization

Supports multiple languages:
- English (default)
- Spanish
- Haitian Creole (auto-translated)

## 📊 Database Schema

Key models:
- `User`: WIC card holders
- `GeneralFood`: All food products
- `ApprovedFood`: WIC-approved products
- `UserBenefit`: Individual benefit balances
- `Transaction`: Purchase history
- `Store`: WIC-approved store locations

## 🛠️ Utility Scripts

Located in `backend/scripts/`:
- `generateImageMapping.ts` - Creates mapping of product images
- `updateProductImage.ts` - Update single product image
- `batchUpdateImages.ts` - Bulk update product images
- `listProducts.ts` - List all products with image status

## 🤖 AI-Assisted Development

This project utilized AI assistance (GitHub Copilot) for:
- Batch file updates and refactoring
- Utility script generation
- Mock data and seed file creation
- Component duplication for similar screens
- Database schema migrations
- Type definition updates

See [PROMPTS.md](./PROMPTS.md) for detailed AI assistance documentation.

## 📝 License

This project is for educational and demonstration purposes.

## 👥 Contributors

Developed with AI assistance for rapid prototyping and development acceleration.
