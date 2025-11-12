const axios = require('axios');

const OPENFOODFACTS_API_BASE = 'https://world.openfoodfacts.org/api/v2';

async function testOpenFoodFacts(upc) {
  try {
    console.log(`🔍 Testing UPC: ${upc}`);
    
    const response = await axios.get(`${OPENFOODFACTS_API_BASE}/product/${upc}.json`);
    
    if (response.data && response.data.status === 1 && response.data.product) {
      const product = response.data.product;
      
      console.log('✅ Product found:');
      console.log(`   Name: ${product.product_name || 'Unknown'}`);
      console.log(`   Brand: ${product.brands || 'Unknown'}`);
      console.log(`   Image: ${product.image_url ? 'Yes' : 'No'}`);
      console.log(`   Categories: ${product.categories || 'Unknown'}`);
      
      return {
        upc: upc,
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        image: product.image_url || undefined
      };
    } else {
      console.log('❌ Product not found in OpenFoodFacts database');
      return null;
    }
  } catch (error) {
    console.error('❌ OpenFoodFacts API error:', error.message);
    return null;
  }
}

// Test with common UPCs
async function runTests() {
  console.log('🧪 Testing OpenFoodFacts API integration...\n');
  
  const testUPCs = [
    '04965802',        // The one from your logs
    '7622210992741',   // Oreo cookies 
    '3017620422003',   // Nutella
    '0041220988020',   // Common milk UPC
    '737628064502'     // Arizona tea
  ];
  
  for (const upc of testUPCs) {
    await testOpenFoodFacts(upc);
    console.log(''); // Empty line between tests
  }
}

runTests().catch(console.error);