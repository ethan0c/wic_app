const axios = require('axios');

// Test the simplified backend service functions with size extraction
const OPENFOODFACTS_API_BASE = 'https://world.openfoodfacts.org/api/v2';

function extractSizeInOz(sizeText) {
  if (!sizeText) return { oz: 0, display: 'Unknown' };
  
  // Try to extract size from various formats
  const ozMatch = sizeText.match(/(\d+\.?\d*)\s*(oz|ounce)/i);
  if (ozMatch) {
    const oz = parseFloat(ozMatch[1]);
    return { oz, display: `${oz} oz` };
  }
  
  const mlMatch = sizeText.match(/(\d+\.?\d*)\s*(ml|milliliter)/i);
  if (mlMatch) {
    const ml = parseFloat(mlMatch[1]);
    const oz = ml * 0.033814; // 1 ml = 0.033814 oz
    return { oz, display: `${ml} ml` };
  }
  
  const lMatch = sizeText.match(/(\d+\.?\d*)\s*(l|liter)/i);
  if (lMatch) {
    const liters = parseFloat(lMatch[1]);
    const oz = liters * 33.814; // 1 liter = 33.814 oz
    return { oz, display: `${liters}L` };
  }
  
  // If no match, return original text as display
  return { oz: 0, display: sizeText };
}

async function searchByUPC(upc) {
  try {
    const response = await axios.get(`${OPENFOODFACTS_API_BASE}/product/${upc}.json`);
    
    if (response.data && response.data.status === 1 && response.data.product) {
      const product = response.data.product;
      
      // Extract size information from quantity or serving_size
      const sizeText = product.quantity || product.serving_size || '';
      const { oz, display } = extractSizeInOz(sizeText);
      
      return {
        upc: upc,
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        image: product.image_url || undefined,
        size_oz: oz,
        size_display: display
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
  console.log('🧪 Testing simplified backend service with size extraction...\n');
  
  const result = await scanProduct('04965802');
  console.log('Scan result:');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.product) {
    console.log('\n📦 Product Details:');
    console.log(`   Name: ${result.product.name}`);
    console.log(`   Brand: ${result.product.brand}`);
    console.log(`   Size: ${result.product.size_display} (${result.product.size_oz} oz)`);
    console.log(`   Image: ${result.product.image ? 'Yes' : 'No'}`);
    if (result.product.image) {
      console.log(`   Image URL: ${result.product.image}`);
    }
  }
}

testBackendService().catch(console.error);