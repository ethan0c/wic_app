import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CARD_NUMBERS = {
  HEAVY_USER: '1234567890', // Low remaining benefits - heavy usage
  MODERATE_USER: '0987654321', // Medium remaining benefits - moderate usage
  LIGHT_USER: '5555555555', // High remaining benefits - light usage
};

async function main() {
  console.log('🌱 Starting seed...');

  // Get current month period and expiration
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  const currentMonthPeriod = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const currentExpiresAt = new Date(currentYear, currentMonth, 0); // Last day of current month
  
  // Future month (next month)
  const futureMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const futureYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  const futureMonthPeriod = `${futureYear}-${String(futureMonth).padStart(2, '0')}`;
  const futureExpiresAt = new Date(futureYear, futureMonth, 0); // Last day of next month

  console.log(`📅 Current Month Period: ${currentMonthPeriod}`);
  console.log(`⏰ Current Expires At: ${currentExpiresAt.toDateString()}`);
  console.log(`📅 Future Month Period: ${futureMonthPeriod}`);
  console.log(`⏰ Future Expires At: ${futureExpiresAt.toDateString()}`);

  // === SEED STORES ===
  console.log('\n🏪 Seeding WIC stores...');
  
  await prisma.wicStore.deleteMany({}); // Clear existing stores
  
  const stores = await prisma.wicStore.createMany({
    data: [
      {
        name: 'Walmart Supercenter',
        chain: 'Walmart',
        address: '100 Main St',
        city: 'York',
        state: 'PA',
        zipCode: '17401',
        latitude: 39.9626,
        longitude: -76.7277,
        phone: '(717) 555-0100',
        hoursJson: { mon_fri: '8:00 AM - 10:00 PM', sat_sun: '9:00 AM - 9:00 PM' },
        isActive: true,
      },
      {
        name: 'Giant Food Store',
        chain: 'Giant',
        address: '200 Market St',
        city: 'York',
        state: 'PA',
        zipCode: '17402',
        latitude: 39.9526,
        longitude: -76.7377,
        phone: '(717) 555-0200',
        hoursJson: { mon_sun: '7:00 AM - 10:00 PM' },
        isActive: true,
      },
      {
        name: 'Weis Markets',
        chain: 'Weis',
        address: '300 Commerce Ave',
        city: 'York',
        state: 'PA',
        zipCode: '17403',
        latitude: 39.9726,
        longitude: -76.7177,
        phone: '(717) 555-0300',
        hoursJson: { everyday: '7:00 AM - 11:00 PM' },
        isActive: true,
      },
      {
        name: 'Target',
        chain: 'Target',
        address: '400 Shopping Plaza',
        city: 'York',
        state: 'PA',
        zipCode: '17404',
        latitude: 39.9826,
        longitude: -76.7077,
        phone: '(717) 555-0400',
        hoursJson: { mon_sat: '8:00 AM - 10:00 PM', sun: '9:00 AM - 9:00 PM' },
        isActive: true,
      },
      {
        name: 'ALDI',
        chain: 'ALDI',
        address: '500 Budget Lane',
        city: 'York',
        state: 'PA',
        zipCode: '17405',
        latitude: 39.9426,
        longitude: -76.7477,
        phone: '(717) 555-0500',
        hoursJson: { mon_sun: '9:00 AM - 8:00 PM' },
        isActive: true,
      },
    ],
  });

  console.log(`✅ Created ${stores.count} stores`);

  // === SEED GENERAL FOODS ===
  console.log('\n� Seeding general foods...');
  
  await prisma.approvedFood.deleteMany({});
  await prisma.generalFood.deleteMany({});

  // Dairy products
  const milkWhole = await prisma.generalFood.create({
    data: {
      name: 'Whole Milk',
      brand: 'Generic',
      category: 'dairy',
      subcategory: 'milk',
      upcCode: '011110123456',
      unitSize: '1 gallon',
      imageFilename: 'whole_milk_011110123456.jpg',
    },
  });

  const milk2Percent = await prisma.generalFood.create({
    data: {
      name: '2% Reduced Fat Milk',
      brand: 'Generic',
      category: 'dairy',
      subcategory: 'milk',
      upcCode: '011110123457',
      unitSize: '1 gallon',
      imageFilename: '2percent_milk_011110123457.jpg',
    },
  });

  const cheese = await prisma.generalFood.create({
    data: {
      name: 'Cheddar Cheese',
      brand: 'Generic',
      category: 'dairy',
      subcategory: 'cheese',
      upcCode: '011110123458',
      unitSize: '16 oz',
      imageFilename: 'cheddar_cheese_011110123458.jpg',
    },
  });

  const yogurt = await prisma.generalFood.create({
    data: {
      name: 'Plain Yogurt',
      brand: 'Generic',
      category: 'dairy',
      subcategory: 'yogurt',
      upcCode: '011110123459',
      unitSize: '32 oz',
      imageFilename: 'plain_yogurt_011110123459.jpg',
    },
  });

  // Grains
  const wheatBread = await prisma.generalFood.create({
    data: {
      name: 'Whole Wheat Bread',
      brand: 'Generic',
      category: 'grains',
      subcategory: 'bread',
      upcCode: '011110234567',
      unitSize: '24 oz',
      imageFilename: 'whole_wheat_bread_011110234567.jpg',
    },
  });

  const brownRice = await prisma.generalFood.create({
    data: {
      name: 'Brown Rice',
      brand: 'Generic',
      category: 'grains',
      subcategory: 'rice',
      upcCode: '011110234568',
      unitSize: '32 oz',
      imageFilename: 'brown_rice_011110234568.jpg',
    },
  });

  const cereal = await prisma.generalFood.create({
    data: {
      name: 'Whole Grain Cereal',
      brand: 'Generic',
      category: 'grains',
      subcategory: 'cereal',
      upcCode: '011110234569',
      unitSize: '18 oz',
      imageFilename: 'whole_grain_cereal_011110234569.jpg',
    },
  });

  // Protein
  const eggs = await prisma.generalFood.create({
    data: {
      name: 'Large Eggs',
      brand: 'Generic',
      category: 'protein',
      subcategory: 'eggs',
      upcCode: '011110345678',
      unitSize: '12 count',
      imageFilename: 'large_eggs_011110345678.jpg',
    },
  });

  const peanutButter = await prisma.generalFood.create({
    data: {
      name: 'Peanut Butter',
      brand: 'Generic',
      category: 'protein',
      subcategory: 'nut-butter',
      upcCode: '011110345679',
      unitSize: '18 oz',
      imageFilename: 'peanut_butter_011110345679.jpg',
    },
  });

  const driedBeans = await prisma.generalFood.create({
    data: {
      name: 'Dried Pinto Beans',
      brand: 'Generic',
      category: 'protein',
      subcategory: 'beans',
      upcCode: '011110345680',
      unitSize: '16 oz',
      imageFilename: 'dried_pinto_beans_011110345680.jpg',
    },
  });

  // Fruits
  const apples = await prisma.generalFood.create({
    data: {
      name: 'Fresh Apples',
      brand: 'Generic',
      category: 'fruits',
      subcategory: 'fresh',
      pluCode: '4131',
      unitSize: 'per lb',
      imageFilename: 'fresh_apples_4131.jpg',
    },
  });

  const bananas = await prisma.generalFood.create({
    data: {
      name: 'Fresh Bananas',
      brand: 'Generic',
      category: 'fruits',
      subcategory: 'fresh',
      pluCode: '4011',
      unitSize: 'per lb',
      imageFilename: 'fresh_bananas_4011.jpg',
    },
  });

  const strawberries = await prisma.generalFood.create({
    data: {
      name: 'Fresh Strawberries',
      brand: 'Generic',
      category: 'fruits',
      subcategory: 'fresh',
      upcCode: '011110456789',
      unitSize: '16 oz',
      imageFilename: 'fresh_strawberries_011110456789.jpg',
    },
  });

  // Vegetables
  const carrots = await prisma.generalFood.create({
    data: {
      name: 'Fresh Carrots',
      brand: 'Generic',
      category: 'vegetables',
      subcategory: 'fresh',
      pluCode: '4562',
      unitSize: 'per lb',
      imageFilename: 'fresh_carrots_4562.jpg',
    },
  });

  const spinach = await prisma.generalFood.create({
    data: {
      name: 'Fresh Spinach',
      brand: 'Generic',
      category: 'vegetables',
      subcategory: 'leafy',
      upcCode: '011110567890',
      unitSize: '10 oz',
      imageFilename: 'fresh_spinach_011110567890.jpg',
    },
  });

  const broccoli = await prisma.generalFood.create({
    data: {
      name: 'Fresh Broccoli',
      brand: 'Generic',
      category: 'vegetables',
      subcategory: 'fresh',
      pluCode: '4060',
      unitSize: 'per lb',
      imageFilename: 'fresh_broccoli_4060.jpg',
    },
  });

  console.log('✅ Created 16 general food items');

  // === SEED APPROVED FOODS ===
  console.log('\n✅ Marking foods as WIC-approved...');

  await prisma.approvedFood.createMany({
    data: [
      { generalFoodId: milkWhole.id, wicCategory: 'dairy', isApproved: true, notes: 'WIC approved whole milk' },
      { generalFoodId: milk2Percent.id, wicCategory: 'dairy', isApproved: true, notes: 'WIC approved 2% milk' },
      { generalFoodId: cheese.id, wicCategory: 'dairy', isApproved: true, notes: 'WIC approved cheese' },
      { generalFoodId: yogurt.id, wicCategory: 'dairy', isApproved: true, notes: 'WIC approved plain yogurt' },
      { generalFoodId: wheatBread.id, wicCategory: 'grains', isApproved: true, notes: 'WIC approved whole wheat bread' },
      { generalFoodId: brownRice.id, wicCategory: 'grains', isApproved: true, notes: 'WIC approved brown rice' },
      { generalFoodId: cereal.id, wicCategory: 'grains', isApproved: true, notes: 'WIC approved whole grain cereal' },
      { generalFoodId: eggs.id, wicCategory: 'protein', isApproved: true, notes: 'WIC approved eggs' },
      { generalFoodId: peanutButter.id, wicCategory: 'protein', isApproved: true, notes: 'WIC approved peanut butter' },
      { generalFoodId: driedBeans.id, wicCategory: 'protein', isApproved: true, notes: 'WIC approved dried beans' },
      { generalFoodId: apples.id, wicCategory: 'fruits', isApproved: true, notes: 'WIC approved fresh apples' },
      { generalFoodId: bananas.id, wicCategory: 'fruits', isApproved: true, notes: 'WIC approved fresh bananas' },
      { generalFoodId: strawberries.id, wicCategory: 'fruits', isApproved: true, notes: 'WIC approved fresh strawberries' },
      { generalFoodId: carrots.id, wicCategory: 'vegetables', isApproved: true, notes: 'WIC approved fresh carrots' },
      { generalFoodId: spinach.id, wicCategory: 'vegetables', isApproved: true, notes: 'WIC approved fresh spinach' },
      { generalFoodId: broccoli.id, wicCategory: 'vegetables', isApproved: true, notes: 'WIC approved fresh broccoli' },
    ],
  });

  console.log('✅ Marked 16 foods as WIC-approved');

  // Clear existing data for these test cards
  console.log('\n�🧹 Cleaning existing test card data...');
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
  
  // Current month benefits
  const heavyUserCurrentBenefits = [
    { category: 'dairy', totalAmount: 4.0, remainingAmount: 0.5, unit: 'gallons' },
    { category: 'grains', totalAmount: 16.0, remainingAmount: 2.0, unit: 'oz' },
    { category: 'protein', totalAmount: 2.0, remainingAmount: 0.25, unit: 'lbs' },
    { category: 'fruits', totalAmount: 12.0, remainingAmount: 1.5, unit: 'dollars' },
    { category: 'vegetables', totalAmount: 12.0, remainingAmount: 2.0, unit: 'dollars' },
  ];

  for (const benefit of heavyUserCurrentBenefits) {
    await prisma.wicBenefit.create({
      data: {
        wicCardNumber: CARD_NUMBERS.HEAVY_USER,
        category: benefit.category,
        totalAmount: benefit.totalAmount,
        remainingAmount: benefit.remainingAmount,
        unit: benefit.unit,
        monthPeriod: currentMonthPeriod,
        expiresAt: currentExpiresAt,
      },
    });
  }

  // Future month benefits (full amounts for all users)
  const futureBenefits = [
    { category: 'dairy', totalAmount: 4.0, unit: 'gallons' },
    { category: 'grains', totalAmount: 16.0, unit: 'oz' },
    { category: 'protein', totalAmount: 2.0, unit: 'lbs' },
    { category: 'fruits', totalAmount: 12.0, unit: 'dollars' },
    { category: 'vegetables', totalAmount: 12.0, unit: 'dollars' },
  ];

  for (const benefit of futureBenefits) {
    await prisma.wicBenefit.create({
      data: {
        wicCardNumber: CARD_NUMBERS.HEAVY_USER,
        category: benefit.category,
        totalAmount: benefit.totalAmount,
        remainingAmount: benefit.totalAmount, // Full amount for future
        unit: benefit.unit,
        monthPeriod: futureMonthPeriod,
        expiresAt: futureExpiresAt,
      },
    });
  }

  // === CARD 2: MODERATE USER (Medium remaining benefits) ===
  console.log('👤 Creating MODERATE USER card:', CARD_NUMBERS.MODERATE_USER);
  
  const moderateUserCurrentBenefits = [
    { category: 'dairy', totalAmount: 4.0, remainingAmount: 2.0, unit: 'gallons' },
    { category: 'grains', totalAmount: 16.0, remainingAmount: 8.0, unit: 'oz' },
    { category: 'protein', totalAmount: 2.0, remainingAmount: 1.0, unit: 'lbs' },
    { category: 'fruits', totalAmount: 12.0, remainingAmount: 6.0, unit: 'dollars' },
    { category: 'vegetables', totalAmount: 12.0, remainingAmount: 6.0, unit: 'dollars' },
  ];

  for (const benefit of moderateUserCurrentBenefits) {
    await prisma.wicBenefit.create({
      data: {
        wicCardNumber: CARD_NUMBERS.MODERATE_USER,
        category: benefit.category,
        totalAmount: benefit.totalAmount,
        remainingAmount: benefit.remainingAmount,
        unit: benefit.unit,
        monthPeriod: currentMonthPeriod,
        expiresAt: currentExpiresAt,
      },
    });
  }

  for (const benefit of futureBenefits) {
    await prisma.wicBenefit.create({
      data: {
        wicCardNumber: CARD_NUMBERS.MODERATE_USER,
        category: benefit.category,
        totalAmount: benefit.totalAmount,
        remainingAmount: benefit.totalAmount,
        unit: benefit.unit,
        monthPeriod: futureMonthPeriod,
        expiresAt: futureExpiresAt,
      },
    });
  }

  // === CARD 3: LIGHT USER (High remaining benefits) ===
  console.log('👤 Creating LIGHT USER card:', CARD_NUMBERS.LIGHT_USER);
  
  const lightUserCurrentBenefits = [
    { category: 'dairy', totalAmount: 4.0, remainingAmount: 3.5, unit: 'gallons' },
    { category: 'grains', totalAmount: 16.0, remainingAmount: 14.0, unit: 'oz' },
    { category: 'protein', totalAmount: 2.0, remainingAmount: 1.75, unit: 'lbs' },
    { category: 'fruits', totalAmount: 12.0, remainingAmount: 10.5, unit: 'dollars' },
    { category: 'vegetables', totalAmount: 12.0, remainingAmount: 11.0, unit: 'dollars' },
  ];

  for (const benefit of lightUserCurrentBenefits) {
    await prisma.wicBenefit.create({
      data: {
        wicCardNumber: CARD_NUMBERS.LIGHT_USER,
        category: benefit.category,
        totalAmount: benefit.totalAmount,
        remainingAmount: benefit.remainingAmount,
        unit: benefit.unit,
        monthPeriod: currentMonthPeriod,
        expiresAt: currentExpiresAt,
      },
    });
  }

  for (const benefit of futureBenefits) {
    await prisma.wicBenefit.create({
      data: {
        wicCardNumber: CARD_NUMBERS.LIGHT_USER,
        category: benefit.category,
        totalAmount: benefit.totalAmount,
        remainingAmount: benefit.totalAmount,
        unit: benefit.unit,
        monthPeriod: futureMonthPeriod,
        expiresAt: futureExpiresAt,
      },
    });
  }

  // Get some stores for transactions
  const storeList = await prisma.wicStore.findMany({ take: 3 });
  if (storeList.length === 0) {
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
          storeId: storeList[0].id,
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
          storeId: storeList[1].id,
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
          storeId: storeList[0].id,
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
          storeId: storeList[1].id,
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
          storeId: storeList[2].id,
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
          storeId: storeList[0].id,
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
  console.log(`   - 5 WIC stores seeded`);
  console.log(`   - 16 approved foods seeded`);
  console.log(`   - 3 WIC cards created with current & future benefits`);
  console.log(`   - Card 1 (${CARD_NUMBERS.HEAVY_USER}): Heavy user - low remaining benefits`);
  console.log(`   - Card 2 (${CARD_NUMBERS.MODERATE_USER}): Moderate user - medium remaining benefits`);
  console.log(`   - Card 3 (${CARD_NUMBERS.LIGHT_USER}): Light user - high remaining benefits`);
  console.log(`   - Multiple transactions created for each card`);
  console.log(`   - Current benefits expire: ${currentExpiresAt.toDateString()}`);
  console.log(`   - Future benefits expire: ${futureExpiresAt.toDateString()}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
