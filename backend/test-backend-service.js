const axios = require('axios');

// Test the simplified backend service functions
const OPENFOODFACTS_API_BASE = 'https://world.openfoodfacts.org/api/v2';

async function searchByUPC(upc) {
  try {
    const response = await axios.get(`${OPENFOODFACTS_API_BASE}/product/${upc}.json`);
    
    if (response.data && response.data.status === 1 && response.data.product) {
      const product = response.data.product;
      return {
        upc: upc,
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        image: product.image_url || undefined
      };
    }
    return null;
  } catch (error) {
    console.error('OpenFoodFacts API error:', error.message);
    return null;
  }
}

async function scanProduct(upc) {
  try {
    const productInfo = await searchByUPC(upc);

    if (productInfo) {
      return {
        found: true,
        product: productInfo,
        isWicApproved: false,
        wicCategory: 'unknown'
      };
    }

    return {
      found: false,
      isWicApproved: false,
    };
  } catch (error) {
    console.error('Scan error:', error);
    return {
      found: false,
      isWicApproved: false,
    };
  }
}

// Test the simplified service
async function testBackendService() {
  console.log('🧪 Testing simplified backend service...\n');
  
  const result = await scanProduct('04965802');
  console.log('Scan result:', JSON.stringify(result, null, 2));
}

testBackendService().catch(console.error);