import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Three test WIC card numbers
const CARD_NUMBERS = {
  HEAVY_USER: '1234567890', // Low remaining benefits - heavy usage
  MODERATE_USER: '0987654321', // Medium remaining benefits - moderate usage
  LIGHT_USER: '5555555555', // High remaining benefits - light usage
};

async function main() {
  console.log('🌱 Starting seed...');

  // Get current month period and expiration
  const now = new Date();
  const monthPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month

  console.log(`📅 Month Period: ${monthPeriod}`);
  console.log(`⏰ Expires At: ${expiresAt.toDateString()}`);

  // Clear existing data for these test cards
  console.log('🧹 Cleaning existing test data...');
  await prisma.transactionItem.deleteMany({
    where: {
      transaction: {
        wicCardNumber: {
          in: Object.values(CARD_NUMBERS),
        },
      },
    },
  });
  await prisma.transaction.deleteMany({
    where: { wicCardNumber: { in: Object.values(CARD_NUMBERS) } },
  });
  await prisma.wicBenefit.deleteMany({
    where: { wicCardNumber: { in: Object.values(CARD_NUMBERS) } },
  });
  await prisma.shoppingListItem.deleteMany({
    where: { wicCardNumber: { in: Object.values(CARD_NUMBERS) } },
  });

  // === CARD 1: HEAVY USER (Low remaining benefits) ===
  console.log('\n👤 Creating HEAVY USER card:', CARD_NUMBERS.HEAVY_USER);
  
  const heavyUserBenefits = [
    { category: 'dairy', totalAmount: 4.0, remainingAmount: 0.5, unit: 'gallons', firstName: 'Sarah', lastName: 'Johnson' },
    { category: 'grains', totalAmount: 16.0, remainingAmount: 2.0, unit: 'oz', firstName: 'Sarah', lastName: 'Johnson' },
    { category: 'protein', totalAmount: 2.0, remainingAmount: 0.25, unit: 'lbs', firstName: 'Sarah', lastName: 'Johnson' },
    { category: 'fruits', totalAmount: 12.0, remainingAmount: 1.5, unit: 'dollars', firstName: 'Sarah', lastName: 'Johnson' },
    { category: 'vegetables', totalAmount: 12.0, remainingAmount: 2.0, unit: 'dollars', firstName: 'Sarah', lastName: 'Johnson' },
  ];

  for (const benefit of heavyUserBenefits) {
    await prisma.wicBenefit.create({
      data: {
        wicCardNumber: CARD_NUMBERS.HEAVY_USER,
        category: benefit.category,
        totalAmount: benefit.totalAmount,
        remainingAmount: benefit.remainingAmount,
        unit: benefit.unit,
        firstName: benefit.firstName,
        lastName: benefit.lastName,
        monthPeriod,
        expiresAt,
      },
    });
  }

  // === CARD 2: MODERATE USER (Medium remaining benefits) ===
  console.log('👤 Creating MODERATE USER card:', CARD_NUMBERS.MODERATE_USER);
  
  const moderateUserBenefits = [
    { category: 'dairy', totalAmount: 4.0, remainingAmount: 2.0, unit: 'gallons', firstName: 'Maria', lastName: 'Garcia' },
    { category: 'grains', totalAmount: 16.0, remainingAmount: 8.0, unit: 'oz', firstName: 'Maria', lastName: 'Garcia' },
    { category: 'protein', totalAmount: 2.0, remainingAmount: 1.0, unit: 'lbs', firstName: 'Maria', lastName: 'Garcia' },
    { category: 'fruits', totalAmount: 12.0, remainingAmount: 6.0, unit: 'dollars', firstName: 'Maria', lastName: 'Garcia' },
    { category: 'vegetables', totalAmount: 12.0, remainingAmount: 6.0, unit: 'dollars', firstName: 'Maria', lastName: 'Garcia' },
  ];

  for (const benefit of moderateUserBenefits) {
    await prisma.wicBenefit.create({
      data: {
        wicCardNumber: CARD_NUMBERS.MODERATE_USER,
        category: benefit.category,
        totalAmount: benefit.totalAmount,
        remainingAmount: benefit.remainingAmount,
        unit: benefit.unit,
        firstName: benefit.firstName,
        lastName: benefit.lastName,
        monthPeriod,
        expiresAt,
      },
    });
  }

  // === CARD 3: LIGHT USER (High remaining benefits) ===
  console.log('👤 Creating LIGHT USER card:', CARD_NUMBERS.LIGHT_USER);
  
  const lightUserBenefits = [
    { category: 'dairy', totalAmount: 4.0, remainingAmount: 3.5, unit: 'gallons', firstName: 'Emily', lastName: 'Chen' },
    { category: 'grains', totalAmount: 16.0, remainingAmount: 14.0, unit: 'oz', firstName: 'Emily', lastName: 'Chen' },
    { category: 'protein', totalAmount: 2.0, remainingAmount: 1.75, unit: 'lbs', firstName: 'Emily', lastName: 'Chen' },
    { category: 'fruits', totalAmount: 12.0, remainingAmount: 10.5, unit: 'dollars', firstName: 'Emily', lastName: 'Chen' },
    { category: 'vegetables', totalAmount: 12.0, remainingAmount: 11.0, unit: 'dollars', firstName: 'Emily', lastName: 'Chen' },
  ];

  for (const benefit of lightUserBenefits) {
    await prisma.wicBenefit.create({
      data: {
        wicCardNumber: CARD_NUMBERS.LIGHT_USER,
        category: benefit.category,
        totalAmount: benefit.totalAmount,
        remainingAmount: benefit.remainingAmount,
        unit: benefit.unit,
        firstName: benefit.firstName,
        lastName: benefit.lastName,
        monthPeriod,
        expiresAt,
      },
    });
  }

  // Get some stores for transactions
  const stores = await prisma.wicStore.findMany({ take: 3 });
  if (stores.length === 0) {
    console.log('⚠️  No stores found. Skipping transaction creation.');
  } else {
    // Get some approved foods for transaction items
    const approvedFoods = await prisma.approvedFood.findMany({
      take: 20,
      include: { generalFood: true },
    });

    if (approvedFoods.length === 0) {
      console.log('⚠️  No approved foods found. Skipping transaction creation.');
    } else {
      // Create transactions for HEAVY USER (3 purchases)
      console.log('\n🛒 Creating transactions for HEAVY USER...');
      
      // Transaction 1 - 7 days ago
      const heavyTrans1Date = new Date(now);
      heavyTrans1Date.setDate(now.getDate() - 7);
      
      const heavyTrans1 = await prisma.transaction.create({
        data: {
          wicCardNumber: CARD_NUMBERS.HEAVY_USER,
          storeId: stores[0].id,
          transactionType: 'purchase',
          totalItems: 4,
          totalValue: 15.50,
          transactionDate: heavyTrans1Date,
        },
      });

      // Milk purchase
      await prisma.transactionItem.create({
        data: {
          transactionId: heavyTrans1.id,
          approvedFoodId: approvedFoods.find(f => f.wicCategory.toLowerCase().includes('dairy'))?.id || approvedFoods[0].id,
          category: 'dairy',
          quantity: 1.0,
          unit: 'gallons',
          productName: 'Whole Milk',
        },
      });

      // Bread purchase
      await prisma.transactionItem.create({
        data: {
          transactionId: heavyTrans1.id,
          approvedFoodId: approvedFoods.find(f => f.wicCategory.toLowerCase().includes('grain'))?.id || approvedFoods[1].id,
          category: 'grains',
          quantity: 4.0,
          unit: 'oz',
          productName: 'Whole Wheat Bread',
        },
      });

      // Transaction 2 - 14 days ago
      const heavyTrans2Date = new Date(now);
      heavyTrans2Date.setDate(now.getDate() - 14);
      
      const heavyTrans2 = await prisma.transaction.create({
        data: {
          wicCardNumber: CARD_NUMBERS.HEAVY_USER,
          storeId: stores[1].id,
          transactionType: 'purchase',
          totalItems: 5,
          totalValue: 22.75,
          transactionDate: heavyTrans2Date,
        },
      });

      await prisma.transactionItem.createMany({
        data: [
          {
            transactionId: heavyTrans2.id,
            approvedFoodId: approvedFoods[0].id,
            category: 'dairy',
            quantity: 2.0,
            unit: 'gallons',
            productName: 'Low Fat Milk',
          },
          {
            transactionId: heavyTrans2.id,
            approvedFoodId: approvedFoods[1].id,
            category: 'fruits',
            quantity: 5.0,
            unit: 'dollars',
            productName: 'Fresh Apples',
          },
          {
            transactionId: heavyTrans2.id,
            approvedFoodId: approvedFoods[2].id,
            category: 'vegetables',
            quantity: 4.0,
            unit: 'dollars',
            productName: 'Fresh Carrots',
          },
        ],
      });

      // Transaction 3 - 21 days ago
      const heavyTrans3Date = new Date(now);
      heavyTrans3Date.setDate(now.getDate() - 21);
      
      const heavyTrans3 = await prisma.transaction.create({
        data: {
          wicCardNumber: CARD_NUMBERS.HEAVY_USER,
          storeId: stores[0].id,
          transactionType: 'purchase',
          totalItems: 3,
          totalValue: 18.25,
          transactionDate: heavyTrans3Date,
        },
      });

      await prisma.transactionItem.createMany({
        data: [
          {
            transactionId: heavyTrans3.id,
            approvedFoodId: approvedFoods[0].id,
            category: 'dairy',
            quantity: 0.5,
            unit: 'gallons',
            productName: 'Skim Milk',
          },
          {
            transactionId: heavyTrans3.id,
            approvedFoodId: approvedFoods[3].id,
            category: 'protein',
            quantity: 1.0,
            unit: 'lbs',
            productName: 'Peanut Butter',
          },
          {
            transactionId: heavyTrans3.id,
            approvedFoodId: approvedFoods[4].id,
            category: 'grains',
            quantity: 8.0,
            unit: 'oz',
            productName: 'Brown Rice',
          },
        ],
      });

      // Create transactions for MODERATE USER (2 purchases)
      console.log('🛒 Creating transactions for MODERATE USER...');
      
      const modTrans1Date = new Date(now);
      modTrans1Date.setDate(now.getDate() - 10);
      
      const modTrans1 = await prisma.transaction.create({
        data: {
          wicCardNumber: CARD_NUMBERS.MODERATE_USER,
          storeId: stores[1].id,
          transactionType: 'purchase',
          totalItems: 3,
          totalValue: 12.50,
          transactionDate: modTrans1Date,
        },
      });

      await prisma.transactionItem.createMany({
        data: [
          {
            transactionId: modTrans1.id,
            approvedFoodId: approvedFoods[0].id,
            category: 'dairy',
            quantity: 1.0,
            unit: 'gallons',
            productName: 'Whole Milk',
          },
          {
            transactionId: modTrans1.id,
            approvedFoodId: approvedFoods[1].id,
            category: 'grains',
            quantity: 4.0,
            unit: 'oz',
            productName: 'Whole Grain Cereal',
          },
          {
            transactionId: modTrans1.id,
            approvedFoodId: approvedFoods[2].id,
            category: 'fruits',
            quantity: 3.0,
            unit: 'dollars',
            productName: 'Bananas',
          },
        ],
      });

      const modTrans2Date = new Date(now);
      modTrans2Date.setDate(now.getDate() - 18);
      
      const modTrans2 = await prisma.transaction.create({
        data: {
          wicCardNumber: CARD_NUMBERS.MODERATE_USER,
          storeId: stores[2].id,
          transactionType: 'purchase',
          totalItems: 3,
          totalValue: 14.75,
          transactionDate: modTrans2Date,
        },
      });

      await prisma.transactionItem.createMany({
        data: [
          {
            transactionId: modTrans2.id,
            approvedFoodId: approvedFoods[0].id,
            category: 'dairy',
            quantity: 1.0,
            unit: 'gallons',
            productName: 'Low Fat Milk',
          },
          {
            transactionId: modTrans2.id,
            approvedFoodId: approvedFoods[3].id,
            category: 'vegetables',
            quantity: 3.0,
            unit: 'dollars',
            productName: 'Fresh Spinach',
          },
          {
            transactionId: modTrans2.id,
            approvedFoodId: approvedFoods[4].id,
            category: 'protein',
            quantity: 0.5,
            unit: 'lbs',
            productName: 'Dried Beans',
          },
        ],
      });

      // Create transaction for LIGHT USER (1 purchase)
      console.log('🛒 Creating transactions for LIGHT USER...');
      
      const lightTrans1Date = new Date(now);
      lightTrans1Date.setDate(now.getDate() - 5);
      
      const lightTrans1 = await prisma.transaction.create({
        data: {
          wicCardNumber: CARD_NUMBERS.LIGHT_USER,
          storeId: stores[0].id,
          transactionType: 'purchase',
          totalItems: 2,
          totalValue: 6.75,
          transactionDate: lightTrans1Date,
        },
      });

      await prisma.transactionItem.createMany({
        data: [
          {
            transactionId: lightTrans1.id,
            approvedFoodId: approvedFoods[0].id,
            category: 'dairy',
            quantity: 0.5,
            unit: 'gallons',
            productName: 'Whole Milk',
          },
          {
            transactionId: lightTrans1.id,
            approvedFoodId: approvedFoods[1].id,
            category: 'fruits',
            quantity: 1.5,
            unit: 'dollars',
            productName: 'Strawberries',
          },
        ],
      });
    }
  }

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - 3 WIC cards created with benefits`);
  console.log(`   - Card 1 (${CARD_NUMBERS.HEAVY_USER}): Heavy user - low remaining benefits`);
  console.log(`   - Card 2 (${CARD_NUMBERS.MODERATE_USER}): Moderate user - medium remaining benefits`);
  console.log(`   - Card 3 (${CARD_NUMBERS.LIGHT_USER}): Light user - high remaining benefits`);
  console.log(`   - Multiple transactions created for each card`);
  console.log(`   - All benefits expire: ${expiresAt.toDateString()}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
