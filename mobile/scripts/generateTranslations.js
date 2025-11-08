/**
 * Translation Generator Script
 * Run this to automatically generate Haitian Creole translations from English
 * 
 * Usage: node scripts/generateTranslations.js
 */

const translate = require('@vitalets/google-translate-api');
const fs = require('fs');
const path = require('path');

// Import the English translations
const translationsPath = path.join(__dirname, '../i18n/translations.ts');

// English translations to auto-translate
const englishToTranslate = {
  home: {
    welcome: 'Welcome',
    yourBenefits: 'Your WIC Benefits',
    quickActions: 'Quick Actions',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    scanItem: 'Scan Item',
    shoppingList: 'Shopping List',
    findStores: 'Find Stores',
    noTransactions: 'No transactions yet',
    startShopping: 'Start shopping with WIC!',
  },
  benefits: {
    title: 'WIC Benefits',
    availableBenefits: 'Available Benefits',
    expiresOn: 'Expires on',
    daysRemaining: 'days remaining',
    viewDetails: 'View Details',
    noBenefits: 'No benefits available',
    contactWic: 'Contact your WIC office',
  },
  categories: {
    title: 'WIC Food Categories',
    milk: 'Milk & Dairy',
    produce: 'Fruits & Vegetables',
    grains: 'Whole Grains',
    protein: 'Protein Foods',
    cereal: 'Cereal',
    juice: '100% Juice',
    bread: 'Whole Wheat Bread',
    eggs: 'Eggs',
  },
  shoppingList: {
    title: 'Shopping List',
    addItem: 'Add Item',
    noItems: 'Your shopping list is empty',
    startAdding: 'Add items from the scanner or categories',
    clear: 'Clear All',
    itemAdded: 'Item added to list',
    itemDeleted: 'Item removed',
  },
};

async function translateObject(obj, depth = 0) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      try {
        console.log(`Translating: "${value}"...`);
        const result = await translate(value, { from: 'en', to: 'ht' });
        translated[key] = result.text;
        console.log(`  ✓ Result: "${result.text}"`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`  ✗ Error translating "${value}":`, error.message);
        translated[key] = value; // Keep English if translation fails
      }
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, depth + 1);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

async function main() {
  console.log('🌐 Starting auto-translation to Haitian Creole...\n');
  
  const haitianCreole = await translateObject(englishToTranslate);
  
  console.log('\n✅ Translation complete!\n');
  console.log('📋 Haitian Creole translations:');
  console.log(JSON.stringify(haitianCreole, null, 2));
  
  // Save to a file
  const outputPath = path.join(__dirname, '../i18n/auto-translated-ht.json');
  fs.writeFileSync(outputPath, JSON.stringify(haitianCreole, null, 2), 'utf-8');
  console.log(`\n💾 Saved to: ${outputPath}`);
  console.log('\nYou can now copy these translations into your translations.ts file!');
}

main().catch(console.error);
